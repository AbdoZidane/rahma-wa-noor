import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getPublicVisitorCount } from "@/lib/site.functions";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  const loadCount = useCallback(async () => {
    const value = await getPublicVisitorCount();
    if (value !== null && value !== undefined) setCount(Number(value));
  }, []);

  useEffect(() => {
    void loadCount();
    window.addEventListener("visitor-count-updated", loadCount);
    return () => window.removeEventListener("visitor-count-updated", loadCount);
  }, [loadCount]);

  return (
    <div
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 text-xs font-semibold text-gold"
      title="إجمالي الزيارات"
      aria-label={count === null ? "إجمالي الزيارات" : `إجمالي الزيارات: ${count.toLocaleString("ar-EG")}`}
      dir="rtl"
    >
      <Eye className="size-4" aria-hidden="true" />
      <span>الزيارات</span>
      <span className="tabular-nums">{count === null ? "—" : count.toLocaleString("ar-EG")}</span>
    </div>
  );
}
