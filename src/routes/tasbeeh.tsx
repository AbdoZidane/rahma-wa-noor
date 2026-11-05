import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { toArabicDigits } from "@/lib/content/quran";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasbeeh")({
  head: () => ({
    meta: [
      { title: "المسبحة الإلكترونية | رحمة ونور" },
      {
        name: "description",
        content: "مسبحة إلكترونية أنيقة: اختر الذكر واضغط للعدّ، مع هدف ٣٣ أو ١٠٠ وزر إعادة الضبط.",
      },
      { property: "og:title", content: "المسبحة الإلكترونية | رحمة ونور" },
      {
        property: "og:description",
        content: "سبّح واذكر الله، واجعل ثوابها صدقة عن عبدالرازق محمود زيدان.",
      },
    ],
  }),
  component: TasbeehPage,
});

const DHIKR = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللَّهُ",
  "أَسْتَغْفِرُ اللَّهَ",
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
];
const TARGETS = [33, 100, 1000, 0] as const;

function TasbeehPage() {
  const [dhikr, setDhikr] = useState(0);
  const [target, setTarget] = useState<number>(33);
  const [counts, setCounts] = useState<number[]>(() => DHIKR.map(() => 0));
  const [total, setTotal] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tasbeeh") || "null");
      if (saved && Array.isArray(saved.counts) && saved.counts.length === DHIKR.length) {
        setCounts(saved.counts);
        setTotal(saved.total ?? 0);
        setDhikr(saved.dhikr ?? 0);
        setTarget([33, 100, 1000, 0].includes(saved.target) ? saved.target : 33);
        setVibrationEnabled(saved.vibrationEnabled === true);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      "tasbeeh",
      JSON.stringify({ counts, total, dhikr, target, vibrationEnabled }),
    );
  }, [counts, total, dhikr, target, vibrationEnabled, loaded]);

  const count = counts[dhikr];
  const reached = target > 0 && count > 0 && count % target === 0;

  const tap = useCallback(() => {
    setCounts((c) => c.map((v, i) => (i === dhikr ? v + 1 : v)));
    setTotal((t) => t + 1);
    setPulse((p) => p + 1);
    if (vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
      const next = counts[dhikr] + 1;
      navigator.vibrate(target > 0 && next % target === 0 ? [60, 40, 60] : 15);
    }
  }, [dhikr, counts, target, vibrationEnabled]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && e.target === document.body) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tap]);

  const reset = () => setCounts((c) => c.map((v, i) => (i === dhikr ? 0 : v)));
  const progress = target > 0 ? ((count % target) / target) * 100 || (reached ? 100 : 0) : 0;
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <>
      <PageHeader eyebrow="ذكر الله" title="المسبحة الإلكترونية">
        ﴿أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ﴾ [الرعد: 28]
      </PageHeader>
      <section className="pattern-islamic">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <div
            className="flex flex-wrap justify-center gap-2"
            role="radiogroup"
            aria-label="اختر الذكر"
          >
            {DHIKR.map((d, i) => (
              <button
                key={d}
                role="radio"
                aria-checked={i === dhikr}
                onClick={() => setDhikr(i)}
                className={cn(
                  "rounded-full border px-4 py-2 font-serif text-lg transition-all duration-200",
                  i === dhikr
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-card text-foreground hover:border-gold",
                )}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-10">
            <p className="font-serif text-3xl text-primary sm:text-4xl">{DHIKR[dhikr]}</p>

            <button
              type="button"
              onClick={tap}
              aria-label={`تسبيح — العدد الحالي ${count}`}
              className="relative mx-auto mt-8 block size-64 rounded-full bg-forest-gradient pattern-islamic-strong text-forest-foreground shadow-gold transition-transform duration-150 active:scale-95 sm:size-72 select-none touch-manipulation"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="2.5"
                />
                {target > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C - (C * progress) / 100}
                    className="transition-[stroke-dashoffset] duration-300"
                  />
                )}
              </svg>
              <span
                key={pulse}
                className="relative block text-7xl font-semibold tabular-nums text-gold-gradient animate-pop sm:text-8xl"
              >
                {toArabicDigits(count)}
              </span>
              <span className="relative mt-2 block text-sm text-forest-foreground/70">
                اضغط للتسبيح
              </span>
            </button>

            <p
              className={cn(
                "mt-6 h-6 font-serif text-lg text-primary transition-opacity",
                reached ? "opacity-100" : "opacity-0",
              )}
            >
              أتممت {toArabicDigits(count)} — بارك الله فيك
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div
                className="flex rounded-full bg-secondary p-1"
                role="radiogroup"
                aria-label="الهدف"
              >
                {TARGETS.map((t) => (
                  <button
                    key={t}
                    role="radio"
                    aria-checked={target === t}
                    onClick={() => setTarget(t)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm transition-colors",
                      target === t
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground hover:text-primary",
                    )}
                  >
                    {t === 0 ? "بلا حد" : toArabicDigits(t)}
                  </button>
                ))}
              </div>
              <Button
                variant={vibrationEnabled ? "gold" : "soft"}
                className="rounded-full"
                onClick={() => setVibrationEnabled((enabled) => !enabled)}
                aria-pressed={vibrationEnabled}
              >
                {vibrationEnabled ? "الاهتزاز مفعّل" : "تفعيل الاهتزاز"}
              </Button>
              <Button
                variant="soft"
                className="rounded-full"
                onClick={reset}
                disabled={count === 0}
              >
                <RotateCcw /> إعادة الضبط
              </Button>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-semibold text-primary">إحصائية أذكارك</p>
              <p className="mt-2 text-sm text-muted-foreground">
                مجموع تسبيحاتك المحفوظة: {toArabicDigits(total)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DHIKR.map((item, index) => (
                  <div key={item} className="rounded-xl bg-secondary/70 p-3 text-start">
                    <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-primary">
                      {toArabicDigits(counts[index])}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setTotal(0);
                  setCounts(DHIKR.map(() => 0));
                }}
                className="mt-4 text-xs underline-offset-4 text-muted-foreground hover:text-primary hover:underline"
              >
                تصفير الإحصائية
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
