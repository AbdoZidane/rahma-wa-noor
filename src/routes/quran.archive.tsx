import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Headphones, MapPin, CalendarDays, Play, Search, Radio, Sparkles, Landmark, Disc3 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DECEASED_NAME } from "@/lib/queries";

export const Route = createFileRoute("/quran/archive")({
  head: () => ({
    meta: [
      { title: "نوادر التلاوات والمحافل | رحمة ونور" },
      { name: "description", content: "مكتبة تلاوات إذاعية وأرشيفية موثقة لكبار قراء القرآن الكريم." },
    ],
  }),
  component: QuranArchivePage,
});

type ArchiveRecording = {
  id: string;
  reciter: string;
  title: string;
  details: string;
  place?: string;
  year?: string;
  url: string;
};

const RECORDINGS: ArchiveRecording[] = [
  {
    id: "naina-south-africa-qiyama",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة القيامة وقصار السور",
    details: "سهرة قرآنية مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/8026dced-446e-42a8-9571-3525e3d460bd",
  },
  {
    id: "naina-south-africa-yusuf",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة يوسف",
    details: "تلاوة مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/f4405619-1646-45b2-977b-5da6bd05da6b",
  },
  {
    id: "mustafa-al-imam",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سورة البقرة وقصار السور",
    details: "سهرة قرآنية مسجلة من المسجد الأقصى",
    place: "المسجد الأقصى",
    url: "https://misrquran.gov.eg/episodedetails/6c0d7fea-d594-4166-adf1-cf6c240672e6",
  },
  {
    id: "mustafa-ali-imran",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من آل عمران وقصار السور",
    details: "تلاوة إذاعية مع تعليق للشيخ محمد الغزالي",
    url: "https://misrquran.gov.eg/episodedetails/8661c5ea-a3a8-4059-9f55-ed5d2dc65022",
  },
  {
    id: "mustafa-ibrahim",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من سورة إبراهيم",
    details: "تلاوة مسجلة من مسجد السيدة زينب",
    place: "مسجد السيدة زينب",
    url: "https://misrquran.gov.eg/episodedetails/dce4c5b9-d923-4594-902f-b68017890a10",
  },
  {
    id: "minshawi-sajda-alaq",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورتي السجدة والعلق",
    details: "من أول سورة السجدة حتى الآية 19، ومن أول سورة العلق حتى الآية 8",
    url: "https://misrquran.gov.eg/episodedetails/aa3063a2-8e00-4e87-a689-ea3235715e2e",
  },
  {
    id: "minshawi-tauba",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة التوبة",
    details: "من الآية 36 حتى الآية 40",
    url: "https://misrquran.gov.eg/episodedetails/6612ebf1-c032-450d-9773-000d2619cbd9",
  },
  {
    id: "banna-anbiya",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الأنبياء",
    details: "تلاوة قرآنية مع تعليق للدكتور محمد الطيب النجار",
    url: "https://misrquran.gov.eg/episodedetails/4708f529-b08f-4c90-be26-6c612aff57e6",
  },
  {
    id: "banna-baqara",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة ضمن احتفال محافظة الإسكندرية بالمولد النبوي الشريف",
    place: "الإسكندرية",
    url: "https://misrquran.gov.eg/episodedetails/a254dedd-c929-461f-a970-01b417cd1d17",
  },
  {
    id: "bahtimi-baqara",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    url: "https://misrquran.gov.eg/episodedetails/ae0d5187-b5f6-4238-9ccf-eace3416e6f4",
  },
  {
    id: "bahtimi-maryam",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "سهرة قرآنية من سورة مريم",
    details: "سهرة قرآنية مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    year: "1963",
    url: "https://misrquran.gov.eg/episodedetails/28543119-1cf6-4ee3-af49-ba767bb16902",
  },
  {
    id: "naina-furqan-hussein-1990",
    reciter: "الشيخ أحمد نعينع",
    title: "سورة الفرقان",
    details: "تسجيل محفل من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    year: "1990",
    url: "https://www.nourelquran.com/play-5711.html?ref=site",
  },
  {
    id: "minshawi-ahzab-rare",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الأحزاب",
    details: "تسجيل أرشيفي من مكتبة نور القرآن",
    url: "https://www.nourelquran.com/play-5710.html?ref=site",
  },
  {
    id: "banna-noor-hussein",
    reciter: "الشيخ محمود علي البنا",
    title: "سورة النور",
    details: "تلاوة مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    url: "https://www.nourelquran.com/play-5716.html?ref=site",
  },
  {
    id: "mustafa-short-surahs-tv",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "قصار السور",
    details: "تسجيل من مسجد التليفزيون",
    place: "مسجد التليفزيون",
    url: "https://www.nourelquran.com/play-5724.html?ref=site",
  },
  {
    id: "mustafa-yusuf-1965",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سورة يوسف",
    details: "تسجيل أرشيفي من عام 1965",
    place: "مسجد السلطان أبو العلا",
    year: "1965",
    url: "https://www.nourelquran.com/play-6866.html?ref=site",
  },
  {
    id: "minshawi-baghdad-1965",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة من تليفزيون بغداد",
    details: "تسجيل تلفزيوني أرشيفي",
    place: "بغداد",
    year: "1965",
    url: "https://www.nourelquran.com/play-6867.html?ref=site",
  },
  {
    id: "mustafa-tv-studios",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من استوديوهات التليفزيون",
    details: "تسجيل إذاعي من أرشيف التلاوات النادرة",
    place: "استوديوهات التليفزيون",
    url: "https://www.nourelquran.com/play-5989.html?ref=site",
  },
];

function QuranArchivePage() {
  const [query, setQuery] = useState("");
  const [reciterFilter, setReciterFilter] = useState("الكل");
  const [archiveFilter, setArchiveFilter] = useState<"الكل" | "محافل ومساجد" | "تسجيلات مؤرخة" | "أرشيف الإذاعة">("الكل");
  const [active, setActive] = useState<ArchiveRecording | null>(null);

  const reciters = useMemo(
    () => ["الكل", ...Array.from(new Set(RECORDINGS.map((item) => item.reciter)))],
    [],
  );
  const filtered = useMemo(() => {
    const term = query.trim();
    return RECORDINGS.filter((item) => {
      const matchesReciter = reciterFilter === "الكل" || item.reciter === reciterFilter;
      const matchesArchive =
        archiveFilter === "الكل" ||
        (archiveFilter === "محافل ومساجد" && Boolean(item.place)) ||
        (archiveFilter === "تسجيلات مؤرخة" && Boolean(item.year)) ||
        (archiveFilter === "أرشيف الإذاعة" && item.url.includes("misrquran.gov.eg"));
      const haystack = [item.reciter, item.title, item.details, item.place ?? "", item.year ?? ""].join(" ");
      return matchesReciter && matchesArchive && (!term || haystack.includes(term));
    });
  }, [query, reciterFilter, archiveFilter]);

  return (
    <>
      <PageHeader eyebrow="مكتبة التراث القرآني" title="نوادر التلاوات والمحافل">
        تسجيلات إذاعية وأمسيات قرآنية موثقة لكبار القراء — صدقة جارية في ذكرى {DECEASED_NAME}
      </PageHeader>

      <section className="pattern-islamic py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="soft" size="sm" className="gap-2">
              <Link to="/quran/listen"><ArrowRight className="size-4" />العودة للاستماع</Link>
            </Button>
            <span className="rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {filtered.length} تسجيلًا في المكتبة
            </span>
          </div>

          <div className="relative mb-6 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-forest via-primary to-forest p-5 text-primary-foreground shadow-xl sm:p-7">
            <div className="pointer-events-none absolute -left-8 -top-10 size-44 rounded-full border border-gold/20" />
            <div className="pointer-events-none absolute -bottom-16 right-1/3 size-52 rounded-full border border-gold/15" />
            <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-soft">
                  <Sparkles className="size-3.5" /> مختارات من ذاكرة التلاوة المصرية
                </span>
                <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">أصوات من زمنٍ جميل</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-foreground/80">
                  محافل ومساجد واستوديوهات وتسجيلات إذاعية؛ نحتفظ مع كل تلاوة بما توفر من مكانها وتاريخها، لتسمعها وتتعرف على حكايتها.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-black/10 p-4">
                <Disc3 className="size-10 text-gold" />
                <div>
                  <p className="text-2xl font-bold tabular-nums">{RECORDINGS.length}</p>
                  <p className="text-xs text-primary-foreground/75">تسجيلًا أرشيفيًا</p>
                </div>
              </div>
            </div>
            <div className="relative mt-5 flex flex-wrap gap-2 text-xs">
              {["محافل قرآنية", "تسجيلات إذاعية", "استوديوهات", "تلاوات نادرة"].map((label) => (
                <span key={label} className="rounded-full border border-gold/25 bg-black/10 px-3 py-1.5">{label}</span>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم الشيخ أو السورة أو المكان..." className="pr-9" />
            </div>
            <select
              value={reciterFilter}
              onChange={(event) => setReciterFilter(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="تصفية حسب القارئ"
            >
              {reciters.map((reciter) => <option key={reciter} value={reciter}>{reciter}</option>)}
            </select>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {(["الكل", "محافل ومساجد", "تسجيلات مؤرخة", "أرشيف الإذاعة"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setArchiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  archiveFilter === filter
                    ? "border-gold bg-gold text-forest shadow-gold"
                    : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-gold/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gold">{item.reciter}</p>
                    <h3 className="mt-1 font-serif text-lg font-bold leading-relaxed text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.details}</p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-primary">
                    <Headphones className="size-5" />
                  </span>
                </div>
                {(item.place || item.year) && (
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.place && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{item.place}</span>}
                    {item.year && <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{item.year}</span>}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-gold"><Landmark className="size-3" /> تسجيل أرشيفي</span>
                  {item.year && <span className="rounded-full bg-secondary px-2.5 py-1">{item.year}</span>}
                </div>
                <Button onClick={() => setActive(item)} variant="gold" className="mt-4 w-full gap-2 shadow-gold">
                  <Play className="size-4" />استمع داخل الموقع
                </Button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              لا توجد تسجيلات مطابقة لبحثك.
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
                  التسجيل معروض من أرشيف إذاعة القرآن الكريم المصرية، مع إبقاء الزائر داخل صفحة رحمة ونور.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
