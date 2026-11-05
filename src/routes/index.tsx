
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Headphones,
  HandHeart,
  Moon,
  Sparkles,
  Sun,
  RotateCcw,
  ArrowLeft,
  Volume2,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/site/Portrait";
import { Divider, StarMark } from "@/components/site/Ornament";
import { CopyButton } from "@/components/site/CopyButton";
import { DailyWird } from "@/components/site/DailyWird";
import {
  approvedPrayersQuery,
  DECEASED_NAME,
  siteContentQuery,
} from "@/lib/queries";
import { DUAS, DUA_BENEFIT_HADITH } from "@/lib/content/duas";
import { toArabicDigits } from "@/lib/content/quran";
import { cn, formatArabicDate } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `رحمة ونور | ذكرى ${DECEASED_NAME}` },
      {
        name: "description",
        content: `رحمك الله يا جدي — موقع تذكاري لعبدالرازق محمود زيدان: القرآن الكريم، الأدعية، الأذكار، المسبحة الإلكترونية، وسيرته العطرة.`,
      },
      { property: "og:title", content: `رحمة ونور | ذكرى ${DECEASED_NAME}` },
      {
        property: "og:description",
        content: `موقع تذكاري وصدقة جارية: القرآن الكريم تلاوة وقراءة، الأدعية، الأذكار، المسبحة وسيرة الجد.`,
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery),
      context.queryClient.ensureQueryData(approvedPrayersQuery),
    ]),
  component: IndexPage,
});

const QUICK_SECTIONS = [
  { id: "quran-section", number: "١", label: "القرآن الكريم", icon: BookOpen },
  { id: "duas-section", number: "٢", label: "الأدعية", icon: HandHeart },
  { id: "azkar-section", number: "٣", label: "الأذكار", icon: Sun },
  { id: "tasbeeh-section", number: "٤", label: "المسبحة الإلكترونية", icon: Sparkles },
] as const;

const MINI_TASBEEH_PRESETS = [
  "سبحان الله وبحمده",
  "الحمد لله رب العالمين",
  "لا إله إلا الله",
  "الله أكبر",
  "أستغفر الله وأتوب إليه",
  "اللهم صلِّ على محمد",
];

function IndexPage() {
  const { data: content } = useSuspenseQuery(siteContentQuery);
  const { data: prayers } = useSuspenseQuery(approvedPrayersQuery);
  const latest = prayers.slice(0, 3);

  // Embedded Mini Tasbeeh state for Section 4
  const [selectedDhikr, setSelectedDhikr] = useState(MINI_TASBEEH_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [pulse, setPulse] = useState(0);
  const [miniLoaded, setMiniLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tasbeeh-home") || "null");
      if (saved && typeof saved.count === "number") {
        setCount(saved.count);
        setSelectedDhikr(
          MINI_TASBEEH_PRESETS.includes(saved.selectedDhikr)
            ? saved.selectedDhikr
            : MINI_TASBEEH_PRESETS[0],
        );
        setTarget([33, 100, 1000].includes(saved.target) ? saved.target : 33);
      }
    } catch {
      /* Ignore invalid local progress and start fresh. */
    }
    setMiniLoaded(true);
  }, []);

  useEffect(() => {
    if (!miniLoaded) return;
    localStorage.setItem("tasbeeh-home", JSON.stringify({ count, selectedDhikr, target }));
  }, [count, selectedDhikr, target, miniLoaded]);

  const increment = () => {
    setCount((c) => c + 1);
    setPulse((p) => p + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-forest-gradient pattern-islamic-strong relative overflow-hidden text-forest-foreground">
        <div
          className="pointer-events-none absolute left-1/2 top-24 size-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl animate-glow"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-start">
            <p className="mb-4 flex items-center justify-center gap-2 text-sm text-gold-soft lg:justify-start animate-fade-up">
              <Moon className="size-4" /> إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
            </p>
            <h1 className="font-script text-5xl leading-[1.5] text-gold-gradient sm:text-7xl animate-fade-up">
              رحمك الله يا جدي
            </h1>
            <p className="mt-4 font-serif text-3xl font-bold sm:text-4xl animate-fade-up [animation-delay:150ms]">
              {DECEASED_NAME}
            </p>
            <Divider className="my-8 lg:justify-start" />
            <p className="mx-auto max-w-xl font-serif text-xl leading-loose text-forest-foreground/85 lg:mx-0 animate-fade-up [animation-delay:300ms]">
              ستظل ذكراك الطيبة حية في قلوبنا، ونسأل الله العلي القدير أن يغفر لك ويرحمك ويجعل قبرك
              روضة من رياض الجنة.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start animate-fade-up [animation-delay:450ms]">
              <Button asChild variant="gold" size="xl">
                <a href="#main-sections">استكشف أقسام الموقع</a>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/prayers">اترك دعاءً له</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:200ms]">
            <Portrait
              src="/grandfather.jpeg"
              name={DECEASED_NAME}
              className="sm:w-72"
            />
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="border-t border-gold/15 bg-forest-deep/60 backdrop-blur-xs">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <span className="hidden text-xs font-semibold text-gold-soft sm:inline">
                أقسام الموقع الرئيسية:
              </span>
              {QUICK_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-forest/40 px-3 py-1.5 text-xs text-forest-foreground/90 transition-all hover:border-gold hover:bg-gold/15 hover:text-gold"
                  >
                    <span className="font-serif text-gold">{toArabicDigits(sec.number)}.</span>
                    <Icon className="size-3.5 text-gold" />
                    <span>{sec.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Hadith Banner */}
      <section className="bg-parchment-gradient">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center">
          <p className="dua-text text-2xl text-primary sm:text-3xl">«{DUA_BENEFIT_HADITH.text}»</p>
          <p className="mt-3 text-sm text-muted-foreground">{DUA_BENEFIT_HADITH.source}</p>
        </div>
      </section>

      <DailyWird />

      {/* Main Anchor Target */}
      <div id="main-sections" className="scroll-mt-16" />

      {/* 1. Quran */}
      <section
        id="quran-section"
        className="pattern-islamic scroll-mt-20 py-20 border-b border-border"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
              <StarMark className="size-3.5 text-gold" />
              القسم الأول
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">
              القرآن الكريم
            </h2>
            <Divider className="mt-4" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              كتاب الله العزيز، نور للصدور وشفاء للقلوب، وخير ما يُهدى ثواب قراءته والاستماع إليه
              صدقة جارية لفقيدنا الغالي رحمه الله.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold">
              <div>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-110 shadow-soft">
                  <BookOpen className="size-7" />
                </span>
                <span className="mt-6 block text-xs font-semibold text-gold">الخيار الأول</span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-primary sm:text-3xl">
                  المصحف الكريم للقراءة
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  تصفح وقراءة آيات وسور القرآن الكريم كاملة بالرسم العثماني المعتمد، مع فهارس ميسرة
                  للسور والأجزاء وعلامات حفظ الورد اليومي.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <Button asChild variant="gold" size="lg" className="w-full justify-between gap-2">
                  <Link to="/quran/read">
                    <span>قراءة المصحف الكريم</span>
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold">
              <div>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-110 shadow-soft">
                  <Headphones className="size-7" />
                </span>
                <span className="mt-6 block text-xs font-semibold text-gold">الخيار الثاني</span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-primary sm:text-3xl">
                  الاستماع إلى القرآن الكريم بأصوات القراء
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  استمع إلى تلاوات عطرة وخاشعة بأصوات كبار أئمة وقراء العالم الإسلامي بروايات
                  متعددة، بصوت نقي يبعث السكينة والاطمئنان في النفس.
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
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="soft" size="lg" className="rounded-full gap-2">
              <Link to="/quran">
                <span>تصفح بوابة القرآن والآيات المختارة</span>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Duas */}
      <section
        id="duas-section"
        className="bg-secondary/40 scroll-mt-20 py-20 border-b border-border"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
              <StarMark className="size-3.5 text-gold" />
              القسم الثاني
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">
              الأدعية للمتوفى
            </h2>
            <Divider className="mt-4" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              أدعية صحيحة ومأثورة من القرآن الكريم والسنة النبوية المطهرة، نسأل الله أن يتقبلها
              ويجعلها نوراً وضياءً له في قبره.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {DUAS.slice(0, 2).map((dua) => (
              <article
                key={dua.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                      <ScrollText className="size-4 text-gold" />
                      {dua.title}
                    </h3>
                    <CopyButton text={`${dua.text}\n\n${dua.source}`} />
                  </div>
                  <p className="dua-text mt-5 text-xl leading-relaxed text-foreground">
                    {dua.text}
                  </p>
                </div>
                <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                  {dua.source}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg" className="rounded-full">
              <Link to="/duas">عرض جميع الأدعية للمتوفى</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/prayers">اترك دعاءً خاصاً</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Azkar */}
      <section
        id="azkar-section"
        className="pattern-islamic scroll-mt-20 py-20 border-b border-border"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
              <StarMark className="size-3.5 text-gold" />
              القسم الثالث
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">
              الأذكار اليومية
            </h2>
            <Divider className="mt-4" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — حصن المسلم اليومي من أذكار الصباح
              والمساء والنوم وما بعد الصلاة، بأدلتها الشرعية ومصادرها الموثوقة.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/azkar"
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold transition-transform group-hover:scale-110">
                <Sun className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-primary">أذكار الصباح</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                تبدأ بها يومك بحفظ الله ورعايته وتوفيقه.
              </p>
            </Link>

            <Link
              to="/azkar"
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold transition-transform group-hover:scale-110">
                <Moon className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-primary">أذكار المساء</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                سكينة المساء وتحصين النفس والبيت بذكر الله.
              </p>
            </Link>

            <Link
              to="/azkar"
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold transition-transform group-hover:scale-110">
                <Sparkles className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-primary">أذكار بعد الصلاة</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                التهليل والتسبيح والاستغفار دبر كل صلاة مكتوبة.
              </p>
            </Link>

            <Link
              to="/azkar"
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold transition-transform group-hover:scale-110">
                <HandHeart className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-primary">أذكار النوم</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                آيات وسور وأدعية النوم والاستيقاظ النبوية.
              </p>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="gold" size="lg" className="rounded-full">
              <Link to="/azkar">فتح الأذكار اليومية ومتابعة العد</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Tasbeeh */}
      <section
        id="tasbeeh-section"
        className="bg-secondary/40 scroll-mt-20 py-20 border-b border-border"
      >
        <div className="mx-auto max-w-4xl px-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
            <StarMark className="size-3.5 text-gold" />
            القسم الرابع
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">
            المسبحة الإلكترونية
          </h2>
          <Divider className="mt-4" />
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            سبّح واذكر الله في أي وقت، واجعل ثواب هذا التسبيح والذكر صدقة جارية ونوراً في ميزان
            حسنات جدنا العزيز {DECEASED_NAME}.
          </p>

          {/* Interactive Embedded Mini Tasbeeh */}
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
            <div className="flex flex-wrap justify-center gap-2">
              {MINI_TASBEEH_PRESETS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDhikr(d);
                    setCount(0);
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-all",
                    selectedDhikr === d
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-secondary text-foreground/80 hover:bg-gold/15 hover:text-gold-foreground",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <p className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                {selectedDhikr}
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={increment}
                className="group relative flex size-44 items-center justify-center rounded-full bg-forest text-gold shadow-gold transition-all duration-150 active:scale-95 sm:size-52"
                aria-label="اضغط للتسبيح"
              >
                <div className="text-center">
                  <span
                    key={pulse}
                    className="block text-5xl font-bold tabular-nums text-gold-gradient animate-pop sm:text-6xl"
                  >
                    {toArabicDigits(count)}
                  </span>
                  <span className="mt-1 block text-xs text-forest-foreground/70">اضغط للعد</span>
                </div>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex rounded-full bg-secondary p-1">
                {[33, 100, 1000].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTarget(t)}
                    className={cn(
                      "rounded-full px-4 py-1 text-xs font-semibold transition-all",
                      target === t
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    هدف {toArabicDigits(t)}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetCount}
                disabled={count === 0}
                className="gap-1.5 text-xs text-muted-foreground"
              >
                <RotateCcw className="size-3.5" />
                إعادة ضبط
              </Button>
            </div>

            {count >= target && (
              <p className="mt-4 font-serif text-sm font-semibold text-primary animate-fade-up">
                تقبل الله منك! أتممت هدف {toArabicDigits(target)} تسبيحة مباركة.
              </p>
            )}

            <div className="mt-8 border-t border-border pt-6">
              <Button asChild variant="gold" size="lg" className="rounded-full">
                <Link to="/tasbeeh">فتح المسبحة الكاملة الموسّعة</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Prayers - Separate from the removed memorial section */}
      <section
        id="visitor-prayers"
        className="pattern-islamic scroll-mt-20 py-16"
      >
        <div className="mx-auto max-w-6xl px-5">
          {latest.length > 0 && (
            <div>
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                  من دعوات الزوار والأحباب
                </h2>
                <Divider className="mt-4" />
                <p className="mt-3 text-sm text-muted-foreground">
                  دعوات طيبة من قلوب محبة في ذكرى الجد رحمه الله
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {latest.map((p) => (
                  <figure
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft"
                  >
                    <blockquote className="dua-text text-lg text-foreground">
                      {p.message}
                    </blockquote>
                    <figcaption className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">
                        — {p.author_name || "فاعل خير"}
                      </span>
                      {p.created_at && (
                        <time dateTime={p.created_at} suppressHydrationWarning>
                          {formatArabicDate(p.created_at)}
                        </time>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button asChild variant="default" size="lg" className="rounded-full">
                  <Link to="/prayers">
                    عرض كل الدعوات ({toArabicDigits(prayers.length)})
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
