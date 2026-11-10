import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Headphones, Play, Search, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
    id: "naina-ali-imran-late",
    surah: "آل عمران",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من سورة آل عمران",
    details: "من الآية 93 حتى الآية 161",
    
    year: "1990",
    url: "https://misrquran.gov.eg/recorddetails/ccc329a4-315f-4b12-90f0-0618c43e17f9",
  },
  {
    id: "minshawi-luqman",
    surah: "لقمان",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة قرآنية من سورة لقمان",
    details: "تسجيل من مسجد سلامة الراضي بحي بولاق الدكرور",
    url: "https://www.nourelquran.com/play-5710.html?ref=site",
  },
  {
    id: "banna-naml",
    surah: "النمل",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    details: "تسجيل إذاعي برواية حفص",
    place: "مسجد الإمام الحسين",
    url: "https://www.nourelquran.com/play-5716.html?ref=site",
  },
  {
    id: "mustafa-qamar-rahman",
    surah: "القمر والرحمن والبلد والشمس",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سور متعددة",
    details: "سهرة قرآنية من أرشيف إذاعة القرآن الكريم",
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
    surah: "الواقعة والحديد",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تسجيل تليفزيون بغداد",
    details: "تسجيل من استديو تلفزيون العراق بتاريخ 27 يناير 1965",
    place: "بغداد",
    year: "1965",
    url: "https://www.nourelquran.com/play-6867.html?ref=site",
  },

  {
    id: "naina-muminun-noor",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع من المصحف المرتل",
    surah: "المؤمنون إلى النور",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/9635b6e1-2cdb-4689-98af-6c80e0e0a15a",
  },
  {
    id: "naina-ali-imran-radio",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "آل عمران",
    details: "من الآية 21 إلى الآية 92",
    url: "https://misrquran.gov.eg/recorddetails/c601be3e-2e58-4290-a88e-4035cb0e0937",
  },
  {
    id: "naina-mumtahana-tahrim",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "الممتحنة والتحريم",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/bf7c677f-96c2-4c2d-be1e-783f5c43b1f5",
  },
  {
    id: "naina-tur-rahman",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "الطور والرحمن",
    details: "من سورة الطور الآية 29 إلى سورة الرحمن الآية 45",
    url: "https://misrquran.gov.eg/recorddetails/efb95c50-d111-4063-8057-48e6e89ba4db",
  },
  {
    id: "mustafa-hujurat-qaf",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة قرآنية من سورتي الحجرات وق",
    surah: "الحجرات وق",
    details: "تلاوة إذاعية مع تعليق للشيخ إسماعيل صادق العدوي",
    url: "https://misrquran.gov.eg/episodedetails/4923968c-66fb-4162-a217-2c9038d85755",
  },
  {
    id: "mustafa-ali-imran-evening",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سورة آل عمران",
    surah: "آل عمران",
    details: "تسجيل من المسجد الأقصى الشريف",
    place: "المسجد الأقصى",
    url: "https://misrquran.gov.eg/episodedetails/56d3e1bb-2478-4f3e-8adb-0ae5cd3cf3d3",
  },
  {
    id: "minshawi-shuara",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الشعراء",
    surah: "الشعراء",
    details: "من الآية 52 حتى الآية 109",
    url: "https://misrquran.gov.eg/episodedetails/c54d54ac-6b7b-4a3a-8cc2-ba43751940c4",
  },
  {
    id: "minshawi-ibrahim",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة إبراهيم",
    surah: "إبراهيم",
    details: "من الآية 23 حتى الآية 52",
    url: "https://misrquran.gov.eg/episodedetails/250011b2-08d9-46af-b91f-3a0005286338",
  },
  {
    id: "minshawi-anam",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الأنعام",
    surah: "الأنعام",
    details: "من الآية 73 حتى الآية 103",
    url: "https://misrquran.gov.eg/episodedetails/68393f70-dedc-463c-9d0c-dfcfb2290ba6",
  },
  {
    id: "banna-rad",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الرعد وقصار السور",
    surah: "الرعد وقصار السور",
    details: "تلاوة إذاعية مع تعليق للدكتور علي عبد اللطيف منصور",
    url: "https://misrquran.gov.eg/episodedetails/6a0fb111-e68e-402d-8134-abeb9d061e0b",
  },
  {
    id: "banna-yusuf",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "يوسف",
    details: "من الآية 53 حتى الآية 111",
    url: "https://misrquran.gov.eg/recorddetails/0b71e37e-7f85-4bce-bbc2-2bbfd76c2a15",
  },
  {
    id: "banna-hud",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "هود",
    details: "من الآية 61 حتى الآية 123",
    url: "https://misrquran.gov.eg/recorddetails/c4bf798a-a2ae-4460-ab30-1d18c03620ce",
  },
  {
    id: "banna-furqan",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "الفرقان",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/e899f990-bef5-45f4-9be6-ce94a95aac4f",
  },
  {
    id: "bahtimi-ibrahim-studio",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة من سورة إبراهيم",
    surah: "إبراهيم",
    details: "تسجيل استديو من أرشيف أعلام التلاوة",
    url: "https://www.youtube-nocookie.com/embed/pzOuPRV2py8",
  },
  {
    id: "bahtimi-qasas",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة خارجية من سورة القصص",
    surah: "القصص",
    details: "من الآية 5 إلى الآية 26",
    url: "https://www.youtube-nocookie.com/embed/64GqGBU0vr8",
  },
  {
    id: "bahtimi-taha",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة استديو من سورة طه",
    surah: "طه",
    details: "تسجيل من أرشيف أعلام التلاوة",
    url: "https://www.youtube-nocookie.com/embed/l7eTrWXerRk",
  },
  {
    id: "bahtimi-rad",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة خارجية من سورة الرعد",
    surah: "الرعد",
    details: "تسجيل من أرشيف أعلام التلاوة",
    url: "https://www.youtube-nocookie.com/embed/e1VMiUj37Is",
  },
  {
    id: "bahtimi-forqan-qiyama-alaq",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة خارجية من سور متعددة",
    surah: "الفرقان والقيامة والعلق",
    details: "تسجيل خارجي من أرشيف أعلام التلاوة",
    url: "https://www.youtube-nocookie.com/embed/ZYsDjXvomzg",
  },
];

function QuranArchivePage() {
  const [query, setQuery] = useState("");
  const [expandedReciter, setExpandedReciter] = useState<string | null>(null);
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map(([reciter, recordings]) => {
              const expanded = expandedReciter === reciter;
              return (
                <section key={reciter} className={expanded ? "sm:col-span-2 lg:col-span-3" : ""}>
                  <button
                    type="button"
                    onClick={() => setExpandedReciter(expanded ? null : reciter)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gold/30 bg-card p-4 text-right shadow-soft transition-colors hover:border-gold hover:bg-gold/5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-primary">
                      <Headphones className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-base font-bold text-foreground">{reciter}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{recordings.length} تسجيلات مختارة</span>
                    </span>
                    {expanded ? <ChevronUp className="size-5 text-gold" /> : <ChevronDown className="size-5 text-gold" />}
                  </button>
                  {expanded && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {recordings.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                          <h3 className="font-serif text-base font-bold leading-relaxed text-foreground">{item.title}</h3>
                          <p className="mt-2 inline-flex rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">السورة: {item.surah}</p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.details}</p>
                          <Button onClick={() => setActive(item)} variant="gold" className="mt-3 w-full gap-2">
                            <Play className="size-4" />استمع داخل الموقع
                          </Button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
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
