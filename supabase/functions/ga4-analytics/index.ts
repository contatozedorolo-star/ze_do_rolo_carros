import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GA4_PROPERTY_ID = "1361498115";

async function requireAdmin(req: Request): Promise<{ ok: true } | { ok: false; res: Response }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }) };
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: userData, error: userErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (userErr || !userData?.user) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }) };
  }
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }) };
  }
  return { ok: true };
}

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

  // Require authenticated admin
  const authCheck = await requireAdmin(req);
  if (!authCheck.ok) return authCheck.res;

  try {
    const accessToken = await getAccessToken();

    const [activeUsersReport, pageViewsReport, trafficSourceReport, dailyReport, topPagesReport] =
      await Promise.all([
        runRealtimeReport(accessToken, { metrics: [{ name: "activeUsers" }] }),
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
        runReport(accessToken, {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "sessions" }],
          limit: 10,
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        }),
        runReport(accessToken, {
          dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        runReport(accessToken, {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }],
          limit: 10,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        }),
      ]);

    const activeUsers = activeUsersReport?.rows?.[0]?.metricValues?.[0]?.value ?? "0";
    const vehiclePageViews = pageViewsReport?.rows?.[0]?.metricValues?.[0]?.value ?? "0";
    const trafficSources = (trafficSourceReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        source: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value, 10),
      })
    );
    const dailyVisits = (dailyReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        date: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value, 10),
        users: parseInt(row.metricValues[1].value, 10),
      })
    );
    const topPages = (topPagesReport?.rows || []).map(
      (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
        path: row.dimensionValues[0].value,
        title: row.dimensionValues[1].value,
        views: parseInt(row.metricValues[0].value, 10),
      })
    );

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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
