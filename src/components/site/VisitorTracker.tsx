import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "rahma-noor-visitor-id";

function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function VisitorTracker() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    void supabase.rpc("record_site_visit", {
      p_visitor_id: visitorId,
      p_page_path: pathname,
    }).then(({ error }) => {
      if (error) console.warn("Visitor analytics could not record this visit:", error.message);
    });
  }, [pathname]);

  return null;
}
