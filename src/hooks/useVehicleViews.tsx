import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Track a vehicle view
export const useTrackVehicleView = (vehicleId: string | undefined) => {
  useEffect(() => {
    if (!vehicleId) return;
    
    // Only track if it's a valid UUID
    const isValidUUID = vehicleId.length === 36 && 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicleId);
    
    if (!isValidUUID) return;

    const trackView = async () => {
      try {
        // Get current user if logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        // Generate a simple hash of the session for anonymous tracking
        const sessionId = sessionStorage.getItem('view_session') || 
          Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('view_session', sessionId);
        
        // Check if this session already viewed this vehicle recently (last 30 minutes)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        
        const { data: existingView } = await supabase
          .from("vehicle_views")
          .select("id")
          .eq("vehicle_id", vehicleId)
          .eq("ip_hash", sessionId)
          .gte("viewed_at", thirtyMinutesAgo)
          .maybeSingle();
        
        // Only insert if no recent view from this session
        if (!existingView) {
          await supabase.from("vehicle_views").insert({
            vehicle_id: vehicleId,
            viewer_id: user?.id || null,
            ip_hash: sessionId,
          });
        }
      } catch (error) {
        // Silently fail - view tracking is not critical
        console.log("View tracking failed:", error);
      }
    };

    trackView();
  }, [vehicleId]);
};

// Get view count for a vehicle
export const useVehicleViewCount = (vehicleId: string | undefined) => {
  return useQuery({
    queryKey: ["vehicle-views", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return 0;
      
      const { count, error } = await supabase
        .from("vehicle_views")
        .select("*", { count: "exact", head: true })
        .eq("vehicle_id", vehicleId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!vehicleId,
    staleTime: 60000, // Cache for 1 minute
  });
};

// Get user statistics (views, proposals received, vehicles sold)
export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // Get all vehicles for this user
      const { data: vehicles } = await supabase
        .from("vehicles")
        .select("id, is_sold")
        .eq("user_id", userId);
      
      const vehicleIds = vehicles?.map(v => v.id) || [];
      const vehiclesSold = vehicles?.filter(v => v.is_sold).length || 0;
      
      // Get total views for all user's vehicles
      let totalViews = 0;
      if (vehicleIds.length > 0) {
        const { count: viewsCount } = await supabase
          .from("vehicle_views")
          .select("*", { count: "exact", head: true })
          .in("vehicle_id", vehicleIds);
        totalViews = viewsCount || 0;
      }
      
      // Get total proposals received (as seller)
      const { count: proposalsReceived } = await supabase
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", userId);
      
      // Get proposals sent
      const { count: proposalsSent } = await supabase
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .eq("proposer_id", userId);
      
      return {
        totalViews,
        proposalsReceived: proposalsReceived || 0,
        proposalsSent: proposalsSent || 0,
        vehiclesSold,
        totalVehicles: vehicleIds.length,
      };
    },
    enabled: !!userId,
    staleTime: 30000, // Cache for 30 seconds
  });
};
