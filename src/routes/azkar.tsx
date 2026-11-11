import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Moon, RotateCcw, Sun, HandHeart } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/site/CopyButton";
import { AFTER_PRAYER_AZKAR, EVENING_AZKAR, MORNING_AZKAR, SLEEP_AZKAR, type Zikr } from "@/lib/content/azkar";
import { toArabicDigits } from "@/lib/content/quran";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/azkar")({
  head: () => ({
    meta: [
      { title: "أذكار الصباح والمساء | رحمة ونور" },
      {
        name: "description",
        content: "أذكار الصباح والمساء بنصوص واضحة ومصادر موثوقة، مع إمكانية تحديد ما أتممته.",
      },
      { property: "og:title", content: "أذكار الصباح والمساء | رحمة ونور" },
      {
        property: "og:description",
        content: "أذكار الصباح والمساء من القرآن والسنة الصحيحة مع مصادرها.",
      },
    ],
  }),
  component: AzkarPage,
});

type Period = "morning" | "evening" | "after-prayer" | "sleep";
const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const storageKey = (p: Period) => `azkar:${p}:${today()}`;

function AzkarPage() {
  const [tab, setTab] = useState<Period>("morning");

  useEffect(() => {
    if (new Date().getHours() >= 15) setTab("evening");
  }, []);

  return (
    <>
      <PageHeader eyebrow="حصن المسلم" title="الأذكار اليومية">
        قال الله تعالى: ﴿فَٱذْكُرُونِىٓ أَذْكُرْكُمْ﴾ [البقرة: 152]
      </PageHeader>
      <section className="pattern-islamic">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Period)} dir="rtl">
            <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-2 gap-1 rounded-2xl bg-secondary p-1 sm:grid-cols-4">
              <TabsTrigger
                value="morning"
                className="rounded-xl px-2 py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sun className="ms-1 size-4" /> الصباح
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className="rounded-xl px-2 py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Moon className="ms-1 size-4" /> المساء
              </TabsTrigger>
              <TabsTrigger value="after-prayer" className="rounded-xl px-2 py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HandHeart className="ms-1 size-4" /> بعد الصلاة
              </TabsTrigger>
              <TabsTrigger value="sleep" className="rounded-xl px-2 py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Moon className="ms-1 size-4" /> النوم
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <AzkarList period="morning" items={MORNING_AZKAR} />
            </TabsContent>
            <TabsContent value="evening">
              <AzkarList period="evening" items={EVENING_AZKAR} />
            </TabsContent>
            <TabsContent value="after-prayer">
              <AzkarList period="after-prayer" items={AFTER_PRAYER_AZKAR} />
            </TabsContent>
            <TabsContent value="sleep">
              <AzkarList period="sleep" items={SLEEP_AZKAR} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

function AzkarList({ period, items }: { period: Period; items: Zikr[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(storageKey(period)) || "{}"));
    } catch {
      setDone({});
    }
  }, [period]);

  const update = (next: Record<string, boolean>) => {
    setDone(next);
    try {
      localStorage.setItem(storageKey(period), JSON.stringify(next));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  };

  const completed = useMemo(() => items.filter((z) => done[z.id]).length, [items, done]);
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div className="mt-8">
      <div className="sticky top-16 z-10 -mx-5 mb-6 border-b border-border bg-background/90 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">
            أتممت {toArabicDigits(completed)} من {toArabicDigits(items.length)}
          </span>
          <Button variant="ghost" size="sm" onClick={() => update({})} disabled={completed === 0}>
            <RotateCcw /> إعادة البدء
          </Button>
        </div>
        <Progress value={pct} className="mt-2 h-2 bg-secondary" />
        {completed === items.length && (
          <p className="mt-3 text-center font-serif text-lg text-primary">
            تقبّل الله منك، ولا تنسَ الدعاء لعبدالرازق بالرحمة والمغفرة
          </p>
        )}
      </div>

      <div className="grid gap-5">
        {items.map((z) => {
          const checked = !!done[z.id];
          return (
            <article
              key={z.id}
              className={cn(
                "block cursor-pointer rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 sm:p-8",
                checked ? "border-gold/70 bg-secondary/60" : "border-border hover:border-gold/40",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-forest px-3 py-1 text-xs text-forest-foreground">
                  {z.count === 1 ? "مرة واحدة" : `${toArabicDigits(z.count)} مرات`}
                </span>
                <div className="flex items-center gap-3">
                  <CopyButton text={`${z.text}\n\n${z.source}`} />
                  <label htmlFor={`${period}-${z.id}`} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    {checked ? "تمّ" : "تحديد كمكتمل"}
                    <Checkbox
                      id={`${period}-${z.id}`}
                      checked={checked}
                      onCheckedChange={(v) => update({ ...done, [z.id]: v === true })}
                      className="size-6 rounded-md border-gold data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </label>
                </div>
              </div>
              <p
                className={cn(
                  "mt-5 whitespace-pre-line text-xl leading-[2.2] text-foreground transition-opacity sm:text-2xl",
                  z.isQuran ? "quran-text" : "dua-text",
                  checked && "opacity-60",
                )}
              >
                {z.text}
              </p>
              <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                {z.source}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
