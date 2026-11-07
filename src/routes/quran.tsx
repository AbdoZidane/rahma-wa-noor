import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Headphones, ArrowLeft, Sparkles, Volume2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CopyButton } from "@/components/site/CopyButton";
import { Button } from "@/components/ui/button";
import { toArabicDigits, VERSE_GROUPS } from "@/lib/content/quran";
import { DECEASED_NAME } from "@/lib/queries";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [
      { title: "القرآن الكريم | رحمة ونور" },
      {
        name: "description",
        content: `بوابة القرآن الكريم: المصحف الكريم للقراءة، والاستماع إلى التلاوات، وآيات مختارة في ذكرى ${DECEASED_NAME}.`,
      },
      { property: "og:title", content: "القرآن الكريم | رحمة ونور" },
      {
        property: "og:description",
        content:
          "المصحف الكريم للقراءة والاستماع إلى القرآن الكريم بأصوات القراء، وآيات بالرسم العثماني.",
      },
    ],
  }),
  component: QuranPortalPage,
});

function QuranPortalPage() {
  const location = useLocation();
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("quran_last_read_surah"));
      if (saved >= 1 && saved <= 114) setLastReadSurah(saved);
    } catch {
      // Continue without a saved reading position when storage is unavailable.
    }
  }, []);
  const isSubroute = location.pathname.startsWith("/quran/") && location.pathname !== "/quran";

  if (isSubroute) {
    return <Outlet />;
  }
  return (
    <>
      <PageHeader eyebrow="كتاب الله العزيز" title="القرآن الكريم">
        «إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ
        يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا»
        <span className="mt-2 block text-sm text-gold-soft">
          صدقة جارية في ذكرى {DECEASED_NAME} رحمه الله
        </span>
      </PageHeader>

      <section className="pattern-islamic">
        <div className="mx-auto max-w-5xl px-5 py-16">
          {/* Section: The Two Clear Choices Requested by User */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5 text-gold" />
              اختر طريقة التفاعل مع كتاب الله
            </span>
            <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">
              بوابة القرآن الكريم
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              نوفر لك خيارين مباركين للتدبر في آيات الله: القراءة المتأنية أو الاستماع الخاشع
            </p>
          </div>

          {lastReadSurah && (
            <div className="mt-5 text-center">
              <Link
                to="/quran/read"
                search={{ surah: String(lastReadSurah) } as never}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                متابعة القراءة من آخر سورة وصلت إليها
              </Link>
            </div>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Choice 1: المصحف الكريم للقراءة */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold">
              <div
                className="pointer-events-none absolute -left-12 -top-12 size-36 rounded-full bg-gold/10 blur-2xl transition-all duration-300 group-hover:bg-gold/20"
                aria-hidden="true"
              />
              <div>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-110 shadow-soft">
                  <BookOpen className="size-7" />
                </span>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-full bg-gold/15 px-3 py-0.5 text-xs font-semibold text-gold-foreground">
                    الخيار الأول
                  </span>
                  <span className="text-xs text-muted-foreground">تصفح وقراءة</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-primary sm:text-3xl">
                  المصحف الكريم للقراءة
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  تصفح وقراءة سور وآيات القرآن الكريم بالرسم العثماني الموثق، مع فهارس الأجزاء
                  والسور، وعلامات الحفظ للقراءة اليومية.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Button asChild variant="gold" size="lg" className="w-full justify-between gap-2">
                  <Link to="/quran/read">
                    <span>فتح المصحف الكريم للقراءة</span>
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>

            {/* Choice 2: الاستماع إلى القرآن الكريم بأصوات القراء */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold">
              <div
                className="pointer-events-none absolute -left-12 -top-12 size-36 rounded-full bg-forest/10 blur-2xl transition-all duration-300 group-hover:bg-forest/20"
                aria-hidden="true"
              />
              <div>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-110 shadow-soft">
                  <Headphones className="size-7" />
                </span>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-full bg-forest/15 px-3 py-0.5 text-xs font-semibold text-primary">
                    الخيار الثاني
                  </span>
                  <span className="text-xs text-muted-foreground">تلاوات خاشعة</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-primary sm:text-3xl">
                  الاستماع إلى القرآن الكريم بأصوات القراء
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  استمع إلى تلاوات عطرة ومؤثرة لنخبة من كبار أئمة وقراء العالم الإسلامي بروايات
                  متعددة، بصوت نقي وعذب يبعث السكينة والطمأنينة.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Button
                  asChild
                  variant="heroOutline"
                  size="lg"
                  className="w-full justify-between gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link to="/quran/listen">
                    <span>الاستماع إلى التلاوات</span>
                    <Volume2 className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 sm:flex-row sm:px-6">
            <div className="text-center sm:text-start">
              <h3 className="font-serif text-lg font-bold text-primary">ختمة القرآن الجماعية</h3>
              <p className="mt-1 text-sm text-muted-foreground">شارك بقراءة جزء واحد، وتابع اكتمال الختمة مع الجميع.</p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-gold/50">
              <Link to="/quran/khatma">المشاركة في الختمة <ArrowLeft className="ms-2 size-4" /></Link>
            </Button>
          </div>

          {/* Preserved Feature: Selected Quranic Verses in Ottoman Script */}
          <div className="mt-20 border-t border-border pt-16">
            <div className="text-center">
              <h3 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                آيات مختارة في الرحمة والصبر والبقاء لله
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                بالرسم العثماني الموثّق مع إمكانية نسخ ومشاركة الآيات
              </p>
            </div>

            <div className="mt-8 grid gap-6">
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
                        <h4 className="text-xl font-bold text-primary">سورة {g.surah}</h4>
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
          </div>
        </div>
      </section>
    </>
  );
}
