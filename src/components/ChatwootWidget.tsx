import { useEffect } from "react";

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    chatwootSettings: {
      position?: string;
      type?: string;
      launcherTitle?: string;
    };
  }
}

const ChatwootWidget = () => {
  useEffect(() => {
    // Configure Chatwoot settings before loading
    window.chatwootSettings = {
      position: "left", // Position on left to avoid overlap with Zé IA button on right
      type: "standard",
      launcherTitle: "Suporte",
    };

    // Load Chatwoot SDK asynchronously
    const loadChatwoot = () => {
      const BASE_URL = "https://chatwootapp.autoia.store";
      const script = document.createElement("script");
      script.src = `${BASE_URL}/packs/js/sdk.js`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: "372no18RzWhsd73LpgkrUSQt",
            baseUrl: BASE_URL,
          });
        }
      };

      script.onerror = () => {
        console.error("Failed to load Chatwoot SDK");
      };

      document.head.appendChild(script);
    };

    // Check if script already exists to prevent duplicates
    const existingScript = document.querySelector(
      'script[src*="chatwootapp.autoia.store"]'
    );

    if (!existingScript) {
      loadChatwoot();
    }

    // Cleanup on unmount
    return () => {
      // Remove Chatwoot widget elements if they exist
      const chatwootWidget = document.querySelector(".woot-widget-holder");
      const chatwootBubble = document.querySelector(".woot-widget-bubble");
      if (chatwootWidget) chatwootWidget.remove();
      if (chatwootBubble) chatwootBubble.remove();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChatwootWidget;
