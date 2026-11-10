import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CopyButton } from "@/components/site/CopyButton";
import { DUAS, DUA_BENEFIT_HADITH } from "@/lib/content/duas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "الدعاء للمتوفى | رحمة ونور" },
      {
        name: "description",
        content: "أدعية صحيحة للمتوفى من القرآن الكريم والسنة النبوية مع مصادرها وزر نسخ لكل دعاء.",
      },
      { property: "og:title", content: "الدعاء للمتوفى | رحمة ونور" },
      {
        property: "og:description",
        content: "أدعية صحيحة للمتوفى من الكتاب والسنة، في ذكرى عبدالرازق محمود زيدان.",
      },
    ],
  }),
  component: DuasPage,
});

function DuasPage() {
  return (
    <>
      <PageHeader eyebrow="من الكتاب والسنة" title="الدعاء للمتوفى">
        «{DUA_BENEFIT_HADITH.text}»
        <span className="mt-2 block text-sm text-gold-soft">{DUA_BENEFIT_HADITH.source}</span>
      </PageHeader>
      <section className="pattern-islamic">
        <div className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:gap-6 sm:px-5 sm:py-16">
          {DUAS.map((d) => (
            <article
              key={d.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-8"
            >
              <header className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
                  {d.kind === "quran" ? (
                    <BookOpen className="size-5 text-gold" />
                  ) : (
                    <ScrollText className="size-5 text-gold" />
                  )}
                  {d.title}
                </h2>
                <CopyButton text={`${d.text}\n\n${d.source}`} />
              </header>
              <p
                className={cn(
                  "mt-4 text-lg leading-[2.1] text-foreground sm:mt-5 sm:text-2xl",
                  d.kind === "quran" ? "quran-text" : "dua-text",
                )}
              >
                {d.kind === "quran" ? `﴿${d.text}﴾` : d.text}
              </p>
              <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                {d.source}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
