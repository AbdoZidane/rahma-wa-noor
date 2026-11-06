import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { recordSiteVisit } from "@/lib/site.functions";

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

    void recordSiteVisit({ data: { visitorId: visitSessionId, pagePath: pathname } }).then((result) => {
      if (result?.ok) {
        window.dispatchEvent(new Event("visitor-count-updated"));
      }
    }).catch((error) => {
      console.warn("Visitor analytics could not record this visit:", error);
    });
  }, [pathname]);

  return null;
}
