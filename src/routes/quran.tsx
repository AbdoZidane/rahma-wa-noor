import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CopyButton } from "@/components/site/CopyButton";
import { toArabicDigits, VERSE_GROUPS } from "@/lib/content/quran";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [
      { title: "آيات من القرآن الكريم | رحمة ونور" },
      {
        name: "description",
        content:
          "آيات مختارة من القرآن الكريم بالرسم العثماني مع اسم السورة ورقم الآية، في الصبر والرحمة والبقاء لله.",
      },
      { property: "og:title", content: "آيات من القرآن الكريم | رحمة ونور" },
      {
        property: "og:description",
        content: "آيات قرآنية مختارة بالرسم العثماني مع أسماء السور وأرقام الآيات.",
      },
    ],
  }),
  component: QuranPage,
});

function QuranPage() {
  return (
    <>
      <PageHeader eyebrow="كلام الله" title="آيات من القرآن الكريم">
        النص بالرسم العثماني، منقول من مصحف المدينة عبر مشروع «تنزيل» للنصوص القرآنية الموثّقة.
      </PageHeader>
      <section className="pattern-islamic">
        <div className="mx-auto grid max-w-4xl gap-6 px-5 py-16">
          {VERSE_GROUPS.map((g) => {
            const ref =
              g.from === g.to
                ? `الآية ${toArabicDigits(g.from)}`
                : `الآيات ${toArabicDigits(g.from)}–${toArabicDigits(g.to)}`;
            const plain = `${g.verses.map((v) => `${v.text} ﴿${toArabicDigits(v.n)}﴾`).join(" ")}\n\n[سورة ${g.surah}: ${ref}]`;
            return (
              <article
                key={g.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/60 px-6 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary">سورة {g.surah}</h2>
                    <p className="text-sm text-muted-foreground">
                      {ref} · {g.theme}
                    </p>
                  </div>
                  <CopyButton text={plain} />
                </header>
                <p className="quran-text px-6 py-8 text-center text-2xl text-foreground sm:px-10 sm:text-3xl">
                  {g.verses.map((v) => (
                    <span key={v.n}>
                      {v.text}{" "}
                      <span
                        className="inline-block font-quran text-gold"
                        aria-label={`الآية ${v.n}`}
                      >
                        ﴿{toArabicDigits(v.n)}﴾
                      </span>{" "}
                    </span>
                  ))}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
