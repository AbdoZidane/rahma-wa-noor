import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, LoaderCircle, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  completeQuranKhatmaPart,
  getQuranKhatmaParts,
  releaseQuranKhatmaPart,
  reserveQuranKhatmaPart,
  type KhatmaPart,
} from "@/lib/site.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/quran/khatma")({
  head: () => ({
    meta: [
      { title: "ختمة القرآن الجماعية | رحمة ونور" },
      { name: "description", content: "شارك في ختمة قرآن جماعية من 30 جزءًا، واختر جزءًا متاحًا." },
    ],
  }),
  component: QuranKhatmaPage,
});

const TOKEN_KEY = "rahma_quran_khatma_claims";

type LocalClaims = Record<string, string>;

function readClaims(): LocalClaims {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}") as LocalClaims;
  } catch {
    return {};
  }
}

function QuranKhatmaPage() {
  const isReadingPart = useRouterState({
    select: (state) => state.location.pathname.startsWith("/quran/khatma/read/"),
  });
  const [parts, setParts] = useState<KhatmaPart[]>([]);
  const [claims, setClaims] = useState<LocalClaims>({});
  const [loading, setLoading] = useState(true);
  const [busyPart, setBusyPart] = useState<number | null>(null);
  const [name, setName] = useState("");

  const refresh = useCallback(async () => {
    const data = await getQuranKhatmaParts();
    setParts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setClaims(readClaims());
  }, []);

  // Refresh the server state whenever the reader route returns to the khatma list.
  useEffect(() => {
    if (!isReadingPart) void refresh();
  }, [isReadingPart, refresh]);

  const completed = useMemo(() => parts.filter((part) => part.status === "completed").length, [parts]);
  const reserved = useMemo(() => parts.filter((part) => part.status === "reserved").length, [parts]);
  const available = 30 - completed - reserved;

  const saveClaims = (next: LocalClaims) => {
    setClaims(next);
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(next));
    } catch {
      toast.error("تعذر حفظ بيانات المشاركة على هذا الجهاز.");
    }
  };

  const reserve = async (part: number) => {
    const token = crypto.randomUUID();
    setBusyPart(part);
    const result = await reserveQuranKhatmaPart({ data: { part, name, token } });
    if (result.ok) {
      saveClaims({ ...claims, [String(part)]: token });
      toast.success("تم حجز الجزء لك. تقبل الله منك.");
      await refresh();
    } else {
      toast.error("الجزء لم يعد متاحًا أو تعذر الحجز. حدّث الصفحة وحاول مرة أخرى.");
      await refresh();
    }
    setBusyPart(null);
  };

  const release = async (part: number) => {
    const token = claims[String(part)];
    if (!token) return;
    setBusyPart(part);
    const result = await releaseQuranKhatmaPart({ data: { part, token } });
    if (result.ok) {
      const next = { ...claims };
      delete next[String(part)];
      saveClaims(next);
      toast.success("تم إتاحة الجزء من جديد.");
      await refresh();
    } else {
      toast.error("تعذر إلغاء الحجز.");
    }
    setBusyPart(null);
  };

  if (isReadingPart) return <Outlet />;

  return (
    <>
      <PageHeader eyebrow="مشاركة في الخير" title="ختمة القرآن الجماعية">
        اختر جزءًا متاحًا، واقرأه على مهل، ثم سجّل إتمامه ليظهر تقدم الختمة للجميع.
      </PageHeader>

      <section className="pattern-islamic min-h-[65vh] py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/quran"><ArrowRight className="ms-1 size-4" /> العودة للقرآن</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={loading}>
              <RotateCcw className="ms-1 size-4" /> تحديث
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">تقدم الختمة</h2>
                <p className="mt-1 text-sm text-muted-foreground">كل ختمة تتكون من 30 جزءًا</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold tabular-nums text-primary">{completed}/30</p>
                <p className="text-xs text-muted-foreground">أجزاء مكتملة</p>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(completed / 30) * 100}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>متاح: {available}</span><span>محجوز: {reserved}</span><span>مكتمل: {completed}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <label htmlFor="khatma-name" className="mb-2 block text-sm font-semibold text-foreground">
              الاسم (اختياري)
            </label>
            <input
              id="khatma-name"
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 60))}
              maxLength={60}
              placeholder="اكتب اسمك أو اتركه فارغًا"
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-2 text-xs text-muted-foreground">لن تحتاج إلى إنشاء حساب. بيانات حجزك تُحفظ على هذا الجهاز.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-14 text-muted-foreground"><LoaderCircle className="size-7 animate-spin" /></div>
          ) : parts.length !== 30 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">تعذر تحميل أجزاء الختمة الآن. حاول التحديث بعد قليل.</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {parts.map((part) => {
                const token = claims[String(part.part_number)];
                const mine = Boolean(token) && part.status === "reserved";
                const isBusy = busyPart === part.part_number;
                return (
                  <article key={part.part_number} className="rounded-xl border border-border bg-card p-3 text-center shadow-xs">
                    <div className="text-xs text-muted-foreground">الجزء</div>
                    <div className="my-1 text-2xl font-bold text-primary">{part.part_number.toLocaleString("ar-EG")}</div>
                    <div className="mb-3 min-h-5 text-xs">
                      {part.status === "completed" ? <span className="text-emerald-700">مكتمل</span> :
                        mine ? <span className="font-semibold text-primary">محجوز لك</span> :
                        part.status === "reserved" ? <span className="text-amber-700">محجوز</span> :
                        <span className="text-muted-foreground">متاح</span>}
                    </div>
                    {part.status === "available" ? (
                      <Button size="sm" className="w-full" onClick={() => void reserve(part.part_number)} disabled={busyPart !== null}>
                        {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : "احجز"}
                      </Button>
                    ) : mine ? (
                      <div className="grid gap-1">
                        <Button asChild size="sm" className="w-full">
                          <Link
                            to="/quran/khatma/read/$part"
                            params={{ part: String(part.part_number) }}
                          >
                            <BookOpen className="ms-1 size-3.5" /> اقرأ الجزء
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => void release(part.part_number)} disabled={busyPart !== null}>إلغاء الحجز</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>—</Button>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-center text-sm text-muted-foreground">
            <BookOpen className="mx-auto mb-2 size-5 text-gold" />
            اجعل نيتك خالصة لله، ونسأل الله أن يتقبل من الجميع.
          </div>
        </div>
      </section>
    </>
  );
}
