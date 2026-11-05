import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_SESSION_KEY = "rahma-noor-visit-session-id";

function getVisitSessionId(): string | null {
  try {
    let id = sessionStorage.getItem(VISITOR_SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(VISITOR_SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function VisitorTracker() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const visitSessionId = getVisitSessionId();
    if (!visitSessionId) return;

    void supabase.rpc("record_site_visit", {
      p_visitor_id: visitSessionId,
      p_page_path: pathname,
    }).then(({ error }) => {
      if (error) {
        console.warn("Visitor analytics could not record this visit:", error.message);
        return;
      }
      window.dispatchEvent(new Event("visitor-count-updated"));
    });
  }, [pathname]);

  return null;
}
