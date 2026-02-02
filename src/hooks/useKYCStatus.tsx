import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export type KYCStatusType = "pending" | "under_review" | "approved" | "rejected" | null;

interface UseKYCStatusReturn {
  isVerified: boolean;
  kycStatus: KYCStatusType;
  hasSubmittedKYC: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useKYCStatus = (): UseKYCStatusReturn => {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<KYCStatusType>(null);
  const [loading, setLoading] = useState(true);

  const fetchKYCStatus = async () => {
    if (!user) {
      setKycStatus(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("kyc_verifications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching KYC status:", error);
        setKycStatus(null);
      } else if (data) {
        setKycStatus(data.status as KYCStatusType);
      } else {
        setKycStatus(null);
      }
    } catch (err) {
      console.error("Error in KYC status fetch:", err);
      setKycStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, [user]);

  return {
    isVerified: kycStatus === "approved",
    kycStatus,
    hasSubmittedKYC: kycStatus !== null,
    loading,
    refetch: fetchKYCStatus,
  };
};
