import { queryOptions } from "@tanstack/react-query";
import { getApprovedPrayers, getSiteContent } from "./site.functions";

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 60_000,
});

export const approvedPrayersQuery = queryOptions({
  queryKey: ["approved-prayers"],
  queryFn: () => getApprovedPrayers(),
  staleTime: 30_000,
  // Refresh the public prayer wall periodically without competing with initial rendering.
  refetchInterval: 60_000,
  refetchIntervalInBackground: false,
});

export function portraitSrc(path: string | null | undefined) {
  if (!path) return null;
  return `${import.meta.env.VITE_SUPABASE_URL}${path}`;
}

export const DECEASED_NAME = "عبدالرازق محمود زيدان";
export const SITE_TITLE = "رحمة ونور | ذكرى عبدالرازق محمود زيدان";
