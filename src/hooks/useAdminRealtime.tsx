import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseAdminRealtimeOptions {
  enabled: boolean;
  onNewPending: () => void;
}

// Generate a short notification beep using Web Audio API
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.frequency.value = 880;
    osc1.type = "sine";
    gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.3);

    // Second tone (higher, slight delay)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.frequency.value = 1100;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
    osc2.start(audioCtx.currentTime + 0.15);
    osc2.stop(audioCtx.currentTime + 0.45);

    // Cleanup
    setTimeout(() => audioCtx.close(), 1000);
  } catch (e) {
    console.warn("Could not play notification sound:", e);
  }
};

// Update browser tab title with pending count
export const updateTabTitle = (pendingCount: number) => {
  const baseTitle = "Painel Admin | Zé do Rolo";
  if (pendingCount > 0) {
    document.title = `(${pendingCount}) ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
};

export const useAdminRealtime = ({ enabled, onNewPending }: UseAdminRealtimeOptions) => {
  const { toast } = useToast();
  const onNewPendingRef = useRef(onNewPending);
  onNewPendingRef.current = onNewPending;

  const handleKYCChange = useCallback(
    async (payload: any) => {
      const newRecord = payload.new;
      if (!newRecord) return;

      // Only alert on under_review status
      if (newRecord.status !== "under_review") return;

      // Fetch user name
      let userName = "Usuário";
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", newRecord.user_id)
          .single();
        if (data?.full_name) userName = data.full_name;
      } catch {}

      playNotificationSound();

      toast({
        title: "🔔 Nova pendência",
        description: `${userName} enviou um documento para verificação.`,
        duration: 8000,
      });

      onNewPendingRef.current();
    },
    [toast]
  );

  const handleVehicleChange = useCallback(
    async (payload: any) => {
      const newRecord = payload.new;
      if (!newRecord) return;

      // Only alert on pending moderation status
      if (newRecord.moderation_status !== "pending") return;

      // For UPDATE events, check if the old status was already pending
      if (payload.eventType === "UPDATE" && payload.old?.moderation_status === "pending") return;

      playNotificationSound();

      toast({
        title: "🚗 Novo anúncio",
        description: `"${newRecord.title}" aguardando aprovação.`,
        duration: 8000,
      });

      onNewPendingRef.current();
    },
    [toast]
  );

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("admin-realtime-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "kyc_verifications",
        },
        handleKYCChange
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "kyc_verifications",
        },
        handleKYCChange
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "vehicles",
        },
        handleVehicleChange
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "vehicles",
        },
        handleVehicleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, handleKYCChange, handleVehicleChange]);
};
