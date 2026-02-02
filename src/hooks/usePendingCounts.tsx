import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PendingCounts {
  kycPending: number;
  vehiclesPending: number;
  total: number;
}

export const usePendingCounts = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ["pending-counts"],
    queryFn: async (): Promise<PendingCounts> => {
      // Fetch KYC pending count (under_review status)
      const { count: kycCount, error: kycError } = await supabase
        .from("kyc_verifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "under_review");

      if (kycError) {
        console.error("Error fetching KYC count:", kycError);
      }

      // Fetch pending vehicles count
      const { count: vehiclesCount, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("moderation_status", "pending");

      if (vehiclesError) {
        console.error("Error fetching vehicles count:", vehiclesError);
      }

      const kycPending = kycCount || 0;
      const vehiclesPending = vehiclesCount || 0;

      return {
        kycPending,
        vehiclesPending,
        total: kycPending + vehiclesPending,
      };
    },
    enabled: isAdmin,
    staleTime: 1000 * 30, // Cache for 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
