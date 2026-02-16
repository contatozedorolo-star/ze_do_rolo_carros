import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GA4_PROPERTY_ID = "1361498115";

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!clientId) throw new Error("GOOGLE_CLIENT_ID not configured");
  if (!clientSecret) throw new Error("GOOGLE_CLIENT_SECRET not configured");
  if (!refreshToken) throw new Error("GOOGLE_REFRESH_TOKEN not configured");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OAuth token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function runReport(accessToken: string, body: Record<string, unknown>) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GA4 API error: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runRealtimeReport(accessToken: string, body: Record<string, unknown>) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GA4 Realtime API error: ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = await getAccessToken();

    // Run all reports in parallel
    const [activeUsersReport, pageViewsReport, trafficSourceReport, dailyReport, topPagesReport] =
      await Promise.all([
        // 1. Active users (realtime)
        runRealtimeReport(accessToken, {
          metrics: [{ name: "activeUsers" }],
        }),

        // 2. Page views for /veiculo/ pages (last 30 days)
        runReport(accessToken, {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          metrics: [{ name: "screenPageViews" }],
          dimensionFilter: {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "CONTAINS", value: "/veiculo/" },
            },
          },
        }),

        // 3. Traffic sources (last 30 days)
        runReport(accessToken, {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "sessions" }],
          limit: 10,
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        }),

        // 4. Daily visits (last 7 days)
        runReport(accessToken, {
          dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "activeUsers" },
          ],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),

        // 5. Top pages (last 30 days)
        runReport(accessToken, {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }],
          limit: 10,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        }),
      ]);

    // Parse active users
    const activeUsers =
      activeUsersReport?.rows?.[0]?.metricValues?.[0]?.value ?? "0";

    // Parse vehicle page views
    const vehiclePageViews =
      pageViewsReport?.rows?.[0]?.metricValues?.[0]?.value ?? "0";

    // Parse traffic sources
    const trafficSources = (trafficSourceReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        source: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value, 10),
      })
    );

    // Parse daily visits
    const dailyVisits = (dailyReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        date: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value, 10),
        users: parseInt(row.metricValues[1].value, 10),
      })
    );

    // Parse top pages
    const topPages = (topPagesReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        path: row.dimensionValues[0].value,
        title: row.dimensionValues[1].value,
        views: parseInt(row.metricValues[0].value, 10),
      })
    );

    // Calculate totals
    const totalViews = topPages.reduce((sum: number, p: { views: number }) => sum + p.views, 0);

    return new Response(
      JSON.stringify({
        activeUsers: parseInt(activeUsers, 10),
        vehiclePageViews: parseInt(vehiclePageViews, 10),
        totalViews,
        trafficSources,
        dailyVisits,
        topPages,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("GA4 analytics error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
