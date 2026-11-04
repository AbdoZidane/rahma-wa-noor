import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User, BookHeart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Portrait } from "@/components/site/Portrait";
import { siteContentQuery, DECEASED_NAME, portraitSrc } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `عن ${DECEASED_NAME} | رحمة ونور` },
      {
        name: "description",
        content: `صفحة تذكارية وسيرة عطرة في ذكرى ${DECEASED_NAME} رحمه الله رحمة واسعة.`,
      },
      { property: "og:title", content: `عن ${DECEASED_NAME} | رحمة ونور` },
      {
        property: "og:description",
        content: `سيرة طيبة وذكريات عطرة في ذكرى المرحوم بإذن الله ${DECEASED_NAME}.`,
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  component: AboutPage,
});

function AboutPage() {
  const { data: content } = useSuspenseQuery(siteContentQuery);

  return (
    <>
      <PageHeader eyebrow="سيرة طيبة وأثر باقٍ" title={`عن ${DECEASED_NAME}`}>
        «إِذَا مَاتَ الإنْسَانُ انْقَطَعَ عنْه عَمَلُهُ إِلَّا مِن ثَلَاثَةٍ: إِلَّا مِن صَدَقَةٍ
        جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو له»
      </PageHeader>

      <section className="pattern-islamic">
        <div className="mx-auto max-w-4xl px-5 py-16">
          {/* Profile Card */}
          <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-10 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <Portrait
                src={portraitSrc(content.portraitPath)}
                name={DECEASED_NAME}
                className="w-48 sm:w-56"
              />
            </div>
            <div className="space-y-4 text-center md:text-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5 text-gold" />
                رحمه الله وأسكنه الفردوس الأعلى
              </div>
              <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
                {DECEASED_NAME}
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/90">
                {content.biography ||
                  "عاش طيب الذكر، نقي السرير، محباً للخير وأهله. نسأل الله العظيم أن يجعل هذا العمل صدقة جارية تنير قبره وتثقل موازينه يوم يلقى ربه."}
              </p>
            </div>
          </div>

          {/* Memories & Notes */}
          {content.memories && content.memories.length > 0 && (
            <div className="mt-16">
              <div className="mb-6 flex items-center gap-2">
                <BookHeart className="size-6 text-gold" />
                <h3 className="font-serif text-2xl font-bold text-primary">من ذكريات العائلة</h3>
              </div>
              <div className="grid gap-4">
                {content.memories.map((m) => (
                  <article
                    key={m.id}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                  >
                    {m.title && (
                      <h4 className="mb-2 font-serif text-xl font-bold text-primary">{m.title}</h4>
                    )}
                    <p className="leading-relaxed text-foreground/90">{m.body}</p>
                    {m.author && (
                      <footer className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="size-3.5" />
                        <span>{m.author}</span>
                      </footer>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
