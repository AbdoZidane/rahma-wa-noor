import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Headphones, Play, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DECEASED_NAME } from "@/lib/queries";

export const Route = createFileRoute("/quran/archive")({
  head: () => ({
    meta: [
      { title: "نبرات مميزة | رحمة ونور" },
      { name: "description", content: "مختارات صوتية من تلاوات كبار قراء القرآن الكريم." },
    ],
  }),
  component: QuranArchivePage,
});

type ArchiveRecording = {
  id: string;
  reciter: string;
  title: string;
  surah: string;
  details: string;
  place?: string;
  year?: string;
  url: string;
};

const RECORDINGS: ArchiveRecording[] = [
  {
    id: "naina-south-africa-qiyama",
    surah: "القيامة وقصار السور",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة القيامة وقصار السور",
    details: "سهرة قرآنية مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/8026dced-446e-42a8-9571-3525e3d460bd",
  },
  {
    id: "naina-south-africa-yusuf",
    surah: "يوسف",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة يوسف",
    details: "تلاوة مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/f4405619-1646-45b2-977b-5da6bd05da6b",
  },
  {
    id: "mustafa-al-imam",
    surah: "البقرة وقصار السور",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سورة البقرة وقصار السور",
    details: "سهرة قرآنية مسجلة من المسجد الأقصى",
    place: "المسجد الأقصى",
    url: "https://misrquran.gov.eg/episodedetails/6c0d7fea-d594-4166-adf1-cf6c240672e6",
  },
  {
    id: "mustafa-ali-imran",
    surah: "آل عمران وقصار السور",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من آل عمران وقصار السور",
    details: "تلاوة إذاعية مع تعليق للشيخ محمد الغزالي",
    url: "https://misrquran.gov.eg/episodedetails/8661c5ea-a3a8-4059-9f55-ed5d2dc65022",
  },
  {
    id: "mustafa-ibrahim",
    surah: "إبراهيم",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من سورة إبراهيم",
    details: "تلاوة مسجلة من مسجد السيدة زينب",
    place: "مسجد السيدة زينب",
    url: "https://misrquran.gov.eg/episodedetails/dce4c5b9-d923-4594-902f-b68017890a10",
  },
  {
    id: "minshawi-sajda-alaq",
    surah: "السجدة والعلق",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورتي السجدة والعلق",
    details: "من أول سورة السجدة حتى الآية 19، ومن أول سورة العلق حتى الآية 8",
    url: "https://misrquran.gov.eg/episodedetails/aa3063a2-8e00-4e87-a689-ea3235715e2e",
  },
  {
    id: "minshawi-tauba",
    surah: "التوبة",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة التوبة",
    details: "من الآية 36 حتى الآية 40",
    url: "https://misrquran.gov.eg/episodedetails/6612ebf1-c032-450d-9773-000d2619cbd9",
  },
  {
    id: "banna-anbiya",
    surah: "الأنبياء",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الأنبياء",
    details: "تلاوة قرآنية مع تعليق للدكتور محمد الطيب النجار",
    url: "https://misrquran.gov.eg/episodedetails/4708f529-b08f-4c90-be26-6c612aff57e6",
  },
  {
    id: "banna-baqara",
    surah: "البقرة",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة ضمن احتفال محافظة الإسكندرية بالمولد النبوي الشريف",
    place: "الإسكندرية",
    url: "https://misrquran.gov.eg/episodedetails/a254dedd-c929-461f-a970-01b417cd1d17",
  },
  {
    id: "bahtimi-baqara",
    surah: "البقرة",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    url: "https://misrquran.gov.eg/episodedetails/ae0d5187-b5f6-4238-9ccf-eace3416e6f4",
  },
  {
    id: "bahtimi-maryam",
    surah: "مريم",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "سهرة قرآنية من سورة مريم",
    details: "سهرة قرآنية مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    year: "1963",
    url: "https://misrquran.gov.eg/episodedetails/28543119-1cf6-4ee3-af49-ba767bb16902",
  },
  {
    id: "naina-furqan-hussein-1990",
    surah: "الفرقان",
    reciter: "الشيخ أحمد نعينع",
    title: "سورة الفرقان",
    details: "تسجيل محفل من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    year: "1990",
    url: "https://www.nourelquran.com/play-5711.html?ref=site",
  },
  {
    id: "minshawi-ahzab-rare",
    surah: "الأحزاب",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الأحزاب",
    details: "تسجيل أرشيفي من مكتبة نور القرآن",
    url: "https://www.nourelquran.com/play-5710.html?ref=site",
  },
  {
    id: "banna-noor-hussein",
    surah: "النور",
    reciter: "الشيخ محمود علي البنا",
    title: "سورة النور",
    details: "تلاوة مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    url: "https://www.nourelquran.com/play-5716.html?ref=site",
  },
  {
    id: "mustafa-short-surahs-tv",
    surah: "قصار السور",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "قصار السور",
    details: "تسجيل من مسجد التليفزيون",
    place: "مسجد التليفزيون",
    url: "https://www.nourelquran.com/play-5724.html?ref=site",
  },
  {
    id: "mustafa-yusuf-1965",
    surah: "يوسف",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سورة يوسف",
    details: "تسجيل أرشيفي من عام 1965",
    place: "مسجد السلطان أبو العلا",
    year: "1965",
    url: "https://www.nourelquran.com/play-6866.html?ref=site",
  },
  {
    id: "minshawi-baghdad-1965",
    surah: "غير محددة في المصدر",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تسجيل تليفزيون بغداد",
    details: "تسجيل تلفزيوني أرشيفي",
    place: "بغداد",
    year: "1965",
    url: "https://www.nourelquran.com/play-6867.html?ref=site",
  },
  {
    id: "mustafa-tv-studios",
    surah: "غير محددة في المصدر",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تسجيل من استوديوهات التليفزيون",
    details: "تسجيل إذاعي من أرشيف التلاوات النادرة",
    place: "استوديوهات التليفزيون",
    url: "https://www.nourelquran.com/play-5989.html?ref=site",
  },
];

function QuranArchivePage() {
  const [query, setQuery] = useState("");
    const [active, setActive] = useState<ArchiveRecording | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar");
    return RECORDINGS.filter((item) => {
      const haystack = [item.reciter, item.title, item.surah, item.details].join(" ").toLocaleLowerCase("ar");
      return !term || haystack.includes(term);
    });
  }, [query]);
  const grouped = useMemo(() => {
    const groups = new Map<string, ArchiveRecording[]>();
    for (const item of filtered) {
      const current = groups.get(item.reciter) ?? [];
      current.push(item);
      groups.set(item.reciter, current);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <>
      <PageHeader eyebrow="مختارات صوتية" title="نبرات مميزة">
        مختارات من أصوات كبار القراء… كل قارئ له بصمته التي لا تتكرر.
      </PageHeader>

      <section className="pattern-islamic py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="soft" size="sm" className="gap-2">
              <Link to="/quran/listen"><ArrowRight className="size-4" />العودة للاستماع</Link>
            </Button>
            <span className="rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {filtered.length} تلاوة
            </span>
          </div>

          <div className="mb-6 rounded-3xl border border-gold/30 bg-gradient-to-br from-forest via-primary to-forest p-5 text-primary-foreground sm:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-soft">
              <Sparkles className="size-4" /> مختارات تستحق الاستماع
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">لكل صوت حكاية</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-foreground/80">
              اسمع واكتشف اللون الذي يميز كل قارئ؛ وابحث باسم الشيخ أو السورة للوصول بسرعة.
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم الشيخ أو السورة..." className="pr-9" />
            </div>
          </div>

          <div className="space-y-7">
            {grouped.map(([reciter, recordings]) => (
              <section key={reciter} aria-label={reciter}>
                <div className="mb-3 flex items-center justify-between border-b border-gold/30 pb-2">
                  <h2 className="font-serif text-lg font-bold text-primary">{reciter}</h2>
                  <span className="text-xs text-muted-foreground">{recordings.length} تلاوة</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {recordings.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-gold/50">
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-primary">
                          <Headphones className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif text-base font-bold leading-relaxed text-foreground">{item.title}</h3>
                          <p className="mt-1 inline-flex rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">السورة: {item.surah}</p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.details}</p>
                        </div>
                      </div>
                      <Button onClick={() => setActive(item)} variant="gold" className="mt-3 w-full gap-2">
                        <Play className="size-4" />استمع
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              مفيش نتائج مطابقة. جرّب اسم قارئ أو سورة تانية.
            </div>
          )}

          {active && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="مشغل التلاوة">
              <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-border p-4">
                  <div>
                    <p className="text-xs font-semibold text-gold">{active.reciter}</p>
                    <h2 className="mt-1 font-serif font-bold text-primary">{active.title}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActive(null)}>إغلاق</Button>
                </div>
                <div className="bg-secondary/30 p-2 sm:p-4">
                  <iframe
                    key={active.id}
                    src={active.url}
                    title={active.title}
                    className="h-[65vh] min-h-[360px] w-full rounded-xl border border-border bg-background"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <p className="px-4 pb-4 text-xs leading-6 text-muted-foreground">
                  مصدر التسجيل يظهر داخل المشغل؛ وقد يتوقف تشغيل بعض المصادر مؤقتًا إذا كانت الخدمة الأصلية غير متاحة.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
