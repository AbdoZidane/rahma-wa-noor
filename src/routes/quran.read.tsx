import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ArrowRight,
  Bookmark,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Headphones,
  RotateCcw,
  Check,
  Share2,
  Copy,
  AlertCircle,
  SlidersHorizontal,
  BookmarkCheck,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SURAHS_LIST, type SurahMeta } from "@/lib/content/quran-surahs";
import { fetchSurahDetail, type SurahDetail } from "@/lib/content/quran-fetcher";
import { toArabicDigits } from "@/lib/content/quran";
import { DECEASED_NAME } from "@/lib/queries";
import { toast } from "sonner";

export const Route = createFileRoute("/quran/read")({
  head: () => ({
    meta: [
      { title: "المصحف الكريم للقراءة | رحمة ونور" },
      {
        name: "description",
        content: `تصفح وقراءة المصحف الكريم بالكامل (١١٤ سورة) بالرسم العثماني الموثّق، صدقة جارية في ذكرى ${DECEASED_NAME}.`,
      },
      { property: "og:title", content: "المصحف الكريم للقراءة | رحمة ونور" },
      {
        property: "og:description",
        content:
          "المصحف الكريم للقراءة بجميع سوره الـ ١١٤ بالرسم العثماني المعتمد وفق مجمع الملك فهد.",
      },
    ],
  }),
  component: QuranReadPage,
});

type FontSize = "sm" | "md" | "lg" | "xl";
type ViewMode = "continuous" | "verses";

const FONT_CLASSES: Record<FontSize, { container: string; text: string }> = {
  sm: { container: "text-xl sm:text-2xl", text: "leading-[2.4]" },
  md: { container: "text-2xl sm:text-3xl", text: "leading-[2.6]" },
  lg: { container: "text-3xl sm:text-4xl", text: "leading-[2.8]" },
  xl: { container: "text-4xl sm:text-5xl", text: "leading-[3.0]" },
};

export function QuranReadPage() {
  // Determine initial Surah from URL search param if present, or localStorage, or default to 1 (Al-Fatihah)
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Reader Preferences
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [viewMode, setViewMode] = useState<ViewMode>("continuous");
  const [bookmarkedSurah, setBookmarkedSurah] = useState<number | null>(null);

  // Surah selector dialog
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">("all");

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Initialize from search param or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramSurah = Number(params.get("surah"));
      if (paramSurah >= 1 && paramSurah <= 114) {
        setSelectedSurah(paramSurah);
      } else {
        const saved = localStorage.getItem("quran_last_read_surah");
        if (saved) {
          const num = Number(saved);
          if (num >= 1 && num <= 114) setSelectedSurah(num);
        }
      }

      const savedBookmark = localStorage.getItem("quran_bookmark_surah");
      if (savedBookmark) {
        setBookmarkedSurah(Number(savedBookmark));
      }
    }
  }, []);

  // Fetch Surah text whenever selectedSurah changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetchSurahDetail(selectedSurah)
      .then((detail) => {
        if (!isCancelled) {
          setSurahData(detail);
          setLoading(false);
          // Persist last read surah
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("quran_last_read_surah", String(selectedSurah));
              // Update URL without full refresh
              const url = new URL(window.location.href);
              url.searchParams.set("surah", String(selectedSurah));
              window.history.replaceState({}, "", url.toString());
            } catch {
              // Ignore
            }
          }
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء تحميل السورة";
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedSurah]);

  const currentMeta: SurahMeta = useMemo(() => {
    return SURAHS_LIST.find((s) => s.number === selectedSurah) || SURAHS_LIST[0];
  }, [selectedSurah]);

  // Filtered surahs for selector modal
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SURAHS_LIST.filter((s) => {
      const matchType = filterType === "all" || s.revelationType === filterType;
      if (!matchType) return false;
      if (!q) return true;
      return (
        s.name.includes(q) ||
        s.nameSimple.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.number) === q
      );
    });
  }, [searchQuery, filterType]);

  const handleSelectSurah = (surahNum: number) => {
    setSelectedSurah(surahNum);
    setDialogOpen(false);
    readerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrevSurah = () => {
    if (selectedSurah > 1) {
      setSelectedSurah((prev) => prev - 1);
      readerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextSurah = () => {
    if (selectedSurah < 114) {
      setSelectedSurah((prev) => prev + 1);
      readerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleBookmark = () => {
    if (bookmarkedSurah === selectedSurah) {
      setBookmarkedSurah(null);
      localStorage.removeItem("quran_bookmark_surah");
      toast.info("تمت إزالة العلامة المرجعية");
    } else {
      setBookmarkedSurah(selectedSurah);
      localStorage.setItem("quran_bookmark_surah", String(selectedSurah));
      toast.success(`تم حفظ موضع قراءتك عند ${currentMeta.name}`);
    }
  };

  const handleCopyAyah = (ayahText: string, ayahNum: number) => {
    const formatted = `${ayahText} ﴿${toArabicDigits(ayahNum)}﴾ [${currentMeta.name}: ${toArabicDigits(ayahNum)}]`;
    navigator.clipboard.writeText(formatted);
    toast.success(`تم نسخ الآية (${toArabicDigits(ayahNum)})`);
  };

  const handleCopyFullSurah = () => {
    if (!surahData) return;
    const allText = surahData.ayahs
      .map((a) => `${a.text} ﴿${toArabicDigits(a.numberInSurah)}﴾`)
      .join(" ");
    const formatted = `بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\n${currentMeta.name}\n\n${allText}\n\n[صدقة جارية في ذكرى ${DECEASED_NAME}]`;
    navigator.clipboard.writeText(formatted);
    toast.success(`تم نسخ سورة ${currentMeta.nameSimple} كاملة`);
  };

  // Surah 9 (At-Tawbah) does not have Basmala
  const showBasmalaBanner = selectedSurah !== 9;

  return (
    <>
      <PageHeader eyebrow="القرآن الكريم" title="المصحف الكريم للقراءة">
        «اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعًا لأَصْحابِهِ»
        <span className="mt-2 block text-sm text-gold-soft">
          صدقة جارية في ذكرى {DECEASED_NAME} رحمه الله — تصفح كامل سور القرآن الـ ١١٤ بالرسم
          العثماني الموثّق
        </span>
      </PageHeader>

      <section className="pattern-islamic min-h-[70vh] py-8 sm:py-12" ref={readerContainerRef}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Top Bar: Navigation, Surah Selector & Reader Controls */}
          <div className="sticky top-20 z-30 mb-8 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-md backdrop-blur-md transition-all sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Surah Selector Button with Dialog */}
              <div className="flex items-center gap-2">
                <Button asChild variant="soft" size="sm" className="hidden sm:inline-flex gap-1.5">
                  <Link to="/quran">
                    <ArrowRight className="size-4" />
                    <span>البوابة</span>
                  </Link>
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="gold"
                      size="sm"
                      className="gap-2 font-bold shadow-soft transition-transform active:scale-95"
                    >
                      <BookOpen className="size-4" />
                      <span className="font-serif text-base">{currentMeta.name}</span>
                      <span className="hidden rounded-md bg-forest/20 px-2 py-0.5 text-xs font-normal text-forest sm:inline-block">
                        السورة رقم {toArabicDigits(currentMeta.number)}
                      </span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-h-[85vh] w-[95vw] max-w-2xl overflow-hidden p-0 sm:rounded-2xl">
                    <DialogHeader className="border-b border-border bg-secondary/50 p-5 text-start">
                      <DialogTitle className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
                        <Sparkles className="size-5 text-gold" />
                        فهرس سور القرآن الكريم (١١٤ سورة)
                      </DialogTitle>
                      <p className="text-xs text-muted-foreground">
                        ابحث باسم السورة أو رقمها (من الفاتحة إلى الناس) للانتقال المباشر
                      </p>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="ابحث باسم السورة أو رقمها..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-9"
                            autoFocus
                          />
                        </div>
                        <div className="flex rounded-lg border border-border bg-card p-1">
                          <button
                            type="button"
                            onClick={() => setFilterType("all")}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                              filterType === "all"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            الكل (١١٤)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFilterType("Meccan")}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                              filterType === "Meccan"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            مكية
                          </button>
                          <button
                            type="button"
                            onClick={() => setFilterType("Medinan")}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                              filterType === "Medinan"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            مدنية
                          </button>
                        </div>
                      </div>
                    </DialogHeader>

                    {/* Surah List Grid */}
                    <div className="max-h-[58vh] overflow-y-auto p-4">
                      {filteredSurahs.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                          <Search className="mx-auto size-8 opacity-40" />
                          <p className="mt-2 text-sm font-semibold">لا توجد سورة مطابقة للبحث</p>
                          <p className="text-xs">
                            جرّب كتابة جزء من الاسم مثل: البقرة، يوسف، الإخلاص
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {filteredSurahs.map((surah) => {
                            const isSelected = surah.number === selectedSurah;
                            const isBookmarked = surah.number === bookmarkedSurah;
                            return (
                              <button
                                key={surah.number}
                                type="button"
                                onClick={() => handleSelectSurah(surah.number)}
                                className={`flex items-center justify-between rounded-xl border p-3 text-start transition-all cursor-pointer ${
                                  isSelected
                                    ? "border-gold bg-gold/15 text-primary shadow-xs ring-1 ring-gold"
                                    : "border-border bg-card hover:border-gold/50 hover:bg-secondary/60"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <span
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                      isSelected
                                        ? "bg-forest text-gold"
                                        : "bg-secondary text-muted-foreground"
                                    }`}
                                  >
                                    {toArabicDigits(surah.number)}
                                  </span>
                                  <div className="truncate">
                                    <div className="truncate font-serif text-base font-bold text-foreground">
                                      {surah.nameSimple}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      {surah.revelationTypeArabic} ·{" "}
                                      {toArabicDigits(surah.numberOfAyahs)} آيات
                                    </div>
                                  </div>
                                </div>
                                {isBookmarked && (
                                  <Bookmark className="size-4 shrink-0 fill-gold text-gold" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Surah Navigation (Prev / Next) */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevSurah}
                  disabled={selectedSurah <= 1}
                  title="السورة السابقة"
                  className="gap-1 px-2.5"
                >
                  <ChevronRight className="size-4" />
                  <span className="hidden sm:inline text-xs">السابقة</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextSurah}
                  disabled={selectedSurah >= 114}
                  title="السورة التالية"
                  className="gap-1 px-2.5"
                >
                  <span className="hidden sm:inline text-xs">التالية</span>
                  <ChevronLeft className="size-4" />
                </Button>
              </div>

              {/* Controls: Audio link, font size, view mode, bookmark */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant="heroOutline"
                  size="sm"
                  className="gap-1.5 border-forest text-forest hover:bg-forest hover:text-forest-foreground"
                >
                  <Link to={`/quran/listen?surah=${selectedSurah}`}>
                    <Headphones className="size-3.5" />
                    <span className="hidden md:inline text-xs">استماع</span>
                  </Link>
                </Button>

                {/* Bookmark Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleBookmark}
                  className={`gap-1.5 px-2.5 ${
                    bookmarkedSurah === selectedSurah
                      ? "text-gold hover:text-gold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={bookmarkedSurah === selectedSurah ? "إزالة العلامة" : "حفظ موضع القراءة"}
                >
                  {bookmarkedSurah === selectedSurah ? (
                    <BookmarkCheck className="size-4 fill-gold text-gold" />
                  ) : (
                    <Bookmark className="size-4" />
                  )}
                  <span className="hidden lg:inline text-xs">
                    {bookmarkedSurah === selectedSurah ? "محفوظة" : "علامة"}
                  </span>
                </Button>

                {/* View Mode Switcher */}
                <div className="flex items-center rounded-lg border border-border bg-secondary/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("continuous")}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === "continuous"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="قراءة متصلة"
                  >
                    متصلة
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("verses")}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === "verses"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="آية آية"
                  >
                    آيات
                  </button>
                </div>

                {/* Font Size Adjuster */}
                <div className="flex items-center rounded-lg border border-border bg-secondary/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (fontSize === "xl") setFontSize("lg");
                      else if (fontSize === "lg") setFontSize("md");
                      else if (fontSize === "md") setFontSize("sm");
                    }}
                    disabled={fontSize === "sm"}
                    className="rounded-md px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="تصغير الخط"
                  >
                    A-
                  </button>
                  <span className="px-1.5 text-xs text-muted-foreground">
                    {fontSize === "sm"
                      ? "صغير"
                      : fontSize === "md"
                        ? "عادي"
                        : fontSize === "lg"
                          ? "كبير"
                          : "أكبر"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (fontSize === "sm") setFontSize("md");
                      else if (fontSize === "md") setFontSize("lg");
                      else if (fontSize === "lg") setFontSize("xl");
                    }}
                    disabled={fontSize === "xl"}
                    className="rounded-md px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="تكبير الخط"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Quran Reader Board */}
          <div className="rounded-3xl border-2 border-border/80 bg-card p-6 shadow-xl sm:p-12">
            {/* Traditional Symmetrical Ottoman Header Frame */}
            <div className="relative mb-10 overflow-hidden rounded-2xl border-2 border-gold/40 bg-gradient-to-b from-forest/10 via-secondary/30 to-background p-6 text-center shadow-soft sm:p-8">
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold/15 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full bg-forest/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/25 pb-3 text-xs text-muted-foreground sm:text-sm">
                <span className="font-semibold text-primary">
                  السورة رقم {toArabicDigits(currentMeta.number)} من ١١٤
                </span>
                <span className="rounded-full bg-forest/10 px-3 py-0.5 font-semibold text-primary">
                  {currentMeta.revelationTypeArabic} · عدد آياتها{" "}
                  {toArabicDigits(currentMeta.numberOfAyahs)}
                </span>
                {surahData?.ayahs[0] && (
                  <span className="text-muted-foreground">
                    الجزء {toArabicDigits(surahData.ayahs[0].juz)} · الحزب{" "}
                    {toArabicDigits(Math.ceil(surahData.ayahs[0].juz * 2))}
                  </span>
                )}
              </div>

              {/* Ornate Surah Title Banner */}
              <div className="py-6">
                <h2 className="font-serif text-4xl font-bold tracking-wide text-primary sm:text-5xl md:text-6xl drop-shadow-xs">
                  {currentMeta.name}
                </h2>
                <p className="mt-2 text-sm text-gold-soft font-serif">
                  {currentMeta.englishName} ({currentMeta.revelationType})
                </p>
              </div>

              {/* Action Buttons for the Surah */}
              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gold/25 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFullSurah}
                  disabled={!surahData}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="size-3.5" />
                  <span>نسخ السورة كاملة</span>
                </Button>
                <Button asChild variant="gold" size="sm" className="gap-1.5 text-xs shadow-soft">
                  <Link to={`/quran/listen?surah=${selectedSurah}`}>
                    <Headphones className="size-3.5" />
                    <span>الاستماع لتلاوة {currentMeta.nameSimple}</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="my-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
                <p className="font-serif text-lg font-semibold text-primary">
                  جاري تحميل سورة {currentMeta.nameSimple} بالرسم العثماني الموثّق...
                </p>
                <p className="text-xs text-muted-foreground">
                  مصدر النص: مجمع الملك فهد لطباعة المصحف الكريم (Tanzil Uthmani)
                </p>
              </div>
            )}

            {/* Error State with Transparent Explanation & Retry */}
            {error && !loading && (
              <div className="my-12 rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-8 text-center">
                <AlertCircle className="mx-auto size-12 text-destructive" />
                <h3 className="mt-4 font-serif text-2xl font-bold text-destructive">
                  تعذر عرض النص القرآني الموثق
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-foreground/80">
                  {error}
                </p>
                <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                  التزامًا بالأمانة الشرعية، لا نقوم بتوليد أو تأليف أي آيات قرآنية بديلة في حال
                  تعذر الاتصال بالمصدر الموثق. يمكنك إعادة المحاولة فور توفر الاتصال.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={() => {
                      setLoading(true);
                      setError(null);
                      fetchSurahDetail(selectedSurah)
                        .then((detail) => {
                          setSurahData(detail);
                          setLoading(false);
                        })
                        .catch((err) => {
                          setError(err instanceof Error ? err.message : "خطأ أثناء إعادة المحاولة");
                          setLoading(false);
                        });
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="size-4" />
                    إعادة المحاولة
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/quran">العودة لبوابة القرآن</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Quran Text Content */}
            {!loading && !error && surahData && (
              <div>
                {/* Dedicated Basmala Banner (All surahs except Surah 9 At-Tawbah) */}
                {showBasmalaBanner && (
                  <div className="my-8 text-center">
                    <p className="quran-text font-serif text-3xl font-bold text-primary sm:text-4xl">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </p>
                    <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
                  </div>
                )}

                {/* View Mode 1: Continuous Mushaf Flow */}
                {viewMode === "continuous" && (
                  <div
                    className={`quran-text text-justify ${FONT_CLASSES[fontSize].container} ${FONT_CLASSES[fontSize].text} text-foreground/90`}
                  >
                    {surahData.ayahs.map((ayah) => {
                      // In Surah 1, Ayah 1 is the Basmala itself.
                      // In Surahs 2-114 (except 9), Ayah 1's Basmala prefix is handled in the top banner.
                      const displayText =
                        selectedSurah === 1
                          ? ayah.text
                          : ayah.numberInSurah === 1 && selectedSurah !== 9
                            ? ayah.cleanText
                            : ayah.text;

                      return (
                        <span
                          key={ayah.number}
                          className="inline transition-colors hover:text-gold"
                        >
                          <span>{displayText}</span>{" "}
                          <span
                            className="inline-block font-quran text-gold select-none mx-1"
                            title={`آية ${ayah.numberInSurah}`}
                            aria-label={`الآية ${ayah.numberInSurah}`}
                          >
                            ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                          </span>{" "}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* View Mode 2: Verse-by-Verse List */}
                {viewMode === "verses" && (
                  <div className="grid gap-4">
                    {surahData.ayahs.map((ayah) => {
                      const displayText =
                        selectedSurah === 1
                          ? ayah.text
                          : ayah.numberInSurah === 1 && selectedSurah !== 9
                            ? ayah.cleanText
                            : ayah.text;

                      return (
                        <div
                          key={ayah.number}
                          className="group rounded-2xl border border-border/80 bg-secondary/30 p-5 transition-all hover:border-gold/60 hover:bg-card hover:shadow-soft"
                        >
                          <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-forest text-xs font-bold text-gold">
                              {toArabicDigits(ayah.numberInSurah)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                الجزء {toArabicDigits(ayah.juz)} · صفحة {toArabicDigits(ayah.page)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyAyah(displayText, ayah.numberInSurah)}
                                className="size-8 p-0 opacity-70 hover:opacity-100"
                                title="نسخ الآية"
                              >
                                <Copy className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p
                            className={`quran-text mt-4 text-start font-serif ${FONT_CLASSES[fontSize].container} leading-relaxed text-foreground`}
                          >
                            {displayText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* End of Surah Ornamental Seal */}
                <div className="mt-14 border-t border-border pt-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-forest text-gold shadow-gold">
                    <Sparkles className="size-6" />
                  </div>
                  <p className="mt-3 font-serif text-xl font-bold text-primary">
                    تمّت بحمد الله وتوفيقه سورة {currentMeta.nameSimple}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    صدقة جارية في ذكرى {DECEASED_NAME} رحمه الله وأسكنه فسيح جناته
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Prev / Next / Hub Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevSurah}
              disabled={selectedSurah <= 1}
              className="gap-2"
            >
              <ChevronRight className="size-5" />
              <span>السورة السابقة</span>
            </Button>

            <Button
              variant="soft"
              size="lg"
              onClick={() => {
                readerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="gap-2"
            >
              <SlidersHorizontal className="size-4" />
              <span>العودة لأعلى السورة</span>
            </Button>

            <Button
              variant="gold"
              size="lg"
              onClick={handleNextSurah}
              disabled={selectedSurah >= 114}
              className="gap-2 shadow-soft"
            >
              <span>السورة التالية</span>
              <ChevronLeft className="size-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
