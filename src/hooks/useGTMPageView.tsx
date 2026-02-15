import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Fires a DataLayer page_view on every route change (SPA-friendly).
 * Also detects AI-referral via ?ref=ze-ia and fires view_item_from_ai.
 * Detects brand filter pages and sends brand info.
 */
const useGTMPageView = () => {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    // Dynamic page_view
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search,
      page_title: document.title,
    });

    // AI referral tracking
    const params = new URLSearchParams(location.search);
    if (params.get("ref") === "ze-ia") {
      window.dataLayer.push({
        event: "view_item_from_ai",
        page_path: location.pathname,
        page_title: document.title,
      });
    }

    // Brand filter tracking (e.g. /veiculos?marca=honda or /marcas/honda)
    const brandFromQuery = params.get("marca");
    const brandFromPath = location.pathname.match(/^\/marcas\/(.+)/)?.[1];
    const brand = brandFromQuery || brandFromPath;
    if (brand) {
      window.dataLayer.push({
        event: "filter_by_brand",
        brand: decodeURIComponent(brand),
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default useGTMPageView;
