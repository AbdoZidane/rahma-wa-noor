
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  BookOpen,
  Search,
  Check,
  Disc3,
  ListMusic,
  Radio,
  ExternalLink,
  AlertCircle,
  Share2,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RECITERS_LIST, getReciterAudioUrl, type Reciter } from "@/lib/content/quran-reciters";
import { SURAHS_LIST, type SurahMeta } from "@/lib/content/quran-surahs";
import { toArabicDigits } from "@/lib/content/quran";
import { DECEASED_NAME } from "@/lib/queries";
import { toast } from "sonner";

export const Route = createFileRoute("/quran/listen")({
  head: () => ({
    meta: [
      { title: "الاستماع إلى القرآن الكريم | رحمة ونور" },
      {
        name: "description",
        content: `استمع إلى تلاوات خاشعة للقرآن الكريم بأصوات أحد عشر قارئًا، صدقة جارية في ذكرى ${DECEASED_NAME}.`,
      },
      { property: "og:title", content: "الاستماع إلى القرآن الكريم | رحمة ونور" },
      {
        property: "og:description",
        content:
          "مشغل صوتي لتلاوات القرآن الكريم بأصوات أحد عشر قارئًا، من بينهم عبد الباسط والحصري والعفاسي والمنشاوي وعلي جابر ومصطفى إسماعيل ومحمود علي البنا وأحمد نعينع.",
      },
    ],
  }),
  component: QuranListenPage,
});

function notifyQuranPlayback(playing: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("quran-playback-change", { detail: { playing } }),
    );
  }
}

function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}:${String(remM).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function QuranListenPage() {
  // State: Reciter & Surah
  const [selectedReciterId, setSelectedReciterId] = useState<string>("abdulbasit");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Surah List Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">("all");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerCardRef = useRef<HTMLDivElement | null>(null);

  // Initialize from URL search params or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramSurah = Number(params.get("surah"));
      const paramReciter = params.get("reciter");

      if (paramSurah >= 1 && paramSurah <= 114) {
        setSelectedSurahNumber(paramSurah);
      } else {
        const savedSurah = localStorage.getItem("quran_audio_surah");
        if (savedSurah) {
          const num = Number(savedSurah);
          if (num >= 1 && num <= 114) setSelectedSurahNumber(num);
        }
      }

      if (paramReciter && RECITERS_LIST.some((r) => r.id === paramReciter)) {
        setSelectedReciterId(paramReciter);
      } else {
        const savedReciter = localStorage.getItem("quran_audio_reciter");
        if (savedReciter && RECITERS_LIST.some((r) => r.id === savedReciter)) {
          setSelectedReciterId(savedReciter);
        }
      }
    }
  }, []);

  const currentReciter: Reciter = useMemo(() => {
    return RECITERS_LIST.find((r) => r.id === selectedReciterId) || RECITERS_LIST[0];
  }, [selectedReciterId]);

  const currentSurah: SurahMeta = useMemo(() => {
    return SURAHS_LIST.find((s) => s.number === selectedSurahNumber) || SURAHS_LIST[0];
  }, [selectedSurahNumber]);

  // Taha Al-Nomani uses an embedded archive library rather than numbered MP3 URLs.
  const isArchiveReciter = currentReciter.id === "taha-nomani";
  const audioSrc = useMemo(() => {
    return isArchiveReciter ? "" : getReciterAudioUrl(currentReciter.cdnPath, currentSurah.number);
  }, [currentReciter, currentSurah, isArchiveReciter]);

  // Update audio element source when reciter or surah changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isArchiveReciter) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      setIsLoadingAudio(false);
      setAudioError(null);
      notifyQuranPlayback(false);
      return;
    }

    setAudioError(null);
    setCurrentTime(0);
    setDuration(0);

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("quran_audio_reciter", selectedReciterId);
        localStorage.setItem("quran_audio_surah", String(selectedSurahNumber));
        // Update URL query parameters
        const url = new URL(window.location.href);
        url.searchParams.set("reciter", selectedReciterId);
        url.searchParams.set("surah", String(selectedSurahNumber));
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Ignore
      }
    }

    audio.src = audioSrc;
    audio.load();

    if (isPlaying) {
      notifyQuranPlayback(true);
      setIsLoadingAudio(true);
      audio
        .play()
        .then(() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        })
        .catch((err: unknown) => {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          notifyQuranPlayback(false);
          const msg = err instanceof Error ? err.message : "تعذر تشغيل التلاوة";
          setAudioError(msg);
        });
    }
  }, [audioSrc, isPlaying, selectedReciterId, selectedSurahNumber, isArchiveReciter]);

  // Keep the site-wide rain ambience mutually exclusive with Quran playback.
  useEffect(() => {
    return () => notifyQuranPlayback(false);
  }, []);

  // Audio Event Handlers
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      notifyQuranPlayback(false);
    } else {
      notifyQuranPlayback(true);
      setIsLoadingAudio(true);
      setAudioError(null);
      audio
        .play()
        .then(() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        })
        .catch((err: unknown) => {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          notifyQuranPlayback(false);
          setAudioError(
            "تعذر تشغيل الملف الصوتي من المصدر الموثوق. يرجى التحقق من اتصال الإنترنت.",
          );
        });
    }
  };

  const handleSeek = (newVal: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const target = newVal[0];
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const handleSkipSeconds = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Math.min(Math.max(audio.currentTime + delta, 0), duration || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handlePrevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber((prev) => prev - 1);
    }
  };

  const handleNextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber((prev) => prev + 1);
    }
  };

  const handleVolumeChange = (newVal: number[]) => {
    const vol = newVal[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleTrackEnded = () => {
    if (isLooping) {
      notifyQuranPlayback(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (autoAdvance && selectedSurahNumber < 114) {
      notifyQuranPlayback(true);
      setSelectedSurahNumber((prev) => prev + 1);
      toast.info(`الانتقال التلقائي إلى تلاوة ${SURAHS_LIST[selectedSurahNumber].nameSimple}`);
    } else {
      setIsPlaying(false);
      notifyQuranPlayback(false);
      setCurrentTime(0);
    }
  };

  // Filtered Surahs for Playlist
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

  const handleSelectSurahAndPlay = (surahNum: number) => {
    notifyQuranPlayback(true);
    setSelectedSurahNumber(surahNum);
    setIsPlaying(true);
    playerCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Hidden Native Audio Element with Real Listeners */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoadingAudio(false);
          }
        }}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
          notifyQuranPlayback(true);
        }}
        onEnded={handleTrackEnded}
        onError={() => {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          notifyQuranPlayback(false);
          setAudioError("تعذر تحميل الملف الصوتي للتلاوة من المصدر الموثوق. يرجى إعادة المحاولة.");
        }}
      />

      <PageHeader eyebrow="القرآن الكريم" title="الاستماع إلى القرآن الكريم">
        «وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ»
        <span className="mt-2 block text-sm text-gold-soft">
          تلاوات خاشعة للقرآن الكريم بأصوات أحد عشر قارئًا — صدقة جارية في ذكرى{" "}
          {DECEASED_NAME}
        </span>
      </PageHeader>

      <section className="pattern-islamic py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Back to Quran Hub */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="soft" size="sm" className="gap-2">
              <Link to="/quran">
                <ArrowRight className="size-4" />
                <span>العودة لخيارات القرآن الكريم</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to={`/quran/read?surah=${selectedSurahNumber}`}>
                <BookOpen className="size-4 text-gold" />
                <span>قراءة {currentSurah.nameSimple} في المصحف الكريم</span>
              </Link>
            </Button>
          </div>

          {/* Section 1: The 10 Reciters Selection Grid */}
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gold">أصوات مباركة خاشعة</span>
                <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                  اختر القارئ (١١ قارئًا)
                </h2>
              </div>
              <span className="hidden rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-block">
                تلاوات قرآنية متاحة
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {RECITERS_LIST.map((reciter) => {
                const isSelected = reciter.id === selectedReciterId;
                return (
                  <button
                    key={reciter.id}
                    type="button"
                    onClick={() => {
                      setSelectedReciterId(reciter.id);
                      toast.success(`تم اختيار ${reciter.name}`);
                    }}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-5 text-start transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gradient-to-br from-card via-gold/10 to-card shadow-gold ring-1 ring-gold"
                        : "border-border bg-card hover:border-gold/50 hover:bg-secondary/40 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-11 items-center justify-center rounded-xl transition-all ${
                            isSelected
                              ? "bg-forest text-gold shadow-soft"
                              : "bg-secondary text-muted-foreground group-hover:bg-forest/20 group-hover:text-forest"
                          }`}
                        >
                          {isSelected && isPlaying ? (
                            <Disc3 className="size-6 animate-spin" />
                          ) : (
                            <Headphones className="size-5" />
                          )}
                        </span>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-foreground">
                            {reciter.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{reciter.country}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-forest text-gold">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {reciter.style}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                      <span>تلاوات قرآنية متاحة</span>
                      <span className={isSelected ? "font-semibold text-primary" : ""}>
                        {isSelected ? "القارئ الحالي" : "اختيار القارئ"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Section 2: Dedicated Master Audio Player Card */}
          <div
            ref={playerCardRef}
            className="mb-12 rounded-3xl border-2 border-gold/40 bg-gradient-to-b from-card via-card to-secondary/30 p-4 shadow-xl sm:p-10"
          >
            {/* Player Header Info */}
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
                <Radio className="size-3.5 text-gold" />
                مشغل التلاوات المباشر
              </span>

              <h3 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
                {isArchiveReciter ? "مكتبة تلاوات الشيخ طه النعماني" : currentSurah.name}
              </h3>
              <p className="mt-2 text-base font-medium text-foreground sm:text-lg">
                بصوت {currentReciter.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentSurah.revelationTypeArabic} · {toArabicDigits(currentSurah.numberOfAyahs)}{" "}
                آية · {currentReciter.style}
              </p>
            </div>

            {isArchiveReciter && (
              <div className="mx-auto mt-7 w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/40 bg-background">
                <div className="border-b border-border bg-gold/10 px-4 py-3 text-center">
                  <p className="font-semibold text-primary">مكتبة الشيخ طه النعماني</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    اختر السورة أو التلاوة من قائمة الشيخ داخل المشغّل
                  </p>
                </div>
                <iframe
                  title="مكتبة تلاوات الشيخ طه النعماني"
                  src="https://alkabbah.com/recitations/playlist/697612/162-tlaoat-khashaa-mshf-th-alnaamany-almshf-almgod-th-alnaamany"
                  width="100%"
                  height="480"
                  loading="lazy"
                  allow="autoplay; fullscreen"
                  className="block w-full"
                />
                <a
                  href="https://alkabbah.com/recitations/playlist/697612/162-tlaoat-khashaa-mshf-th-alnaamany-almshf-almgod-th-alnaamany"
                  target="_blank"
                  rel="noreferrer"
                  className="block px-3 py-3 text-center text-sm font-semibold text-primary underline underline-offset-4"
                >
                  لو المشغّل لم يظهر، افتح مكتبة الشيخ من هنا
                </a>
                <p className="px-3 py-2 text-center text-[11px] text-muted-foreground">
                  مكتبة الشيخ تضم ١٦٢ تسجيلًا، ويمكنك اختيار التلاوة من القائمة داخل المشغّل
                </p>
              </div>
            )}

            {!isArchiveReciter && (
              <>
            {/* Error Notification Banner if any */}
            {audioError && (
              <div className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
                <AlertCircle className="size-5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">تنبيه أثناء تشغيل التلاوة</p>
                  <p>{audioError}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setAudioError(null);
                    handleTogglePlay();
                  }}
                  className="shrink-0 text-xs"
                >
                  إعادة المحاولة
                </Button>
              </div>
            )}

            {/* Timeline Progress Slider */}
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>{formatAudioTime(currentTime)}</span>
                <span>{formatAudioTime(duration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="cursor-pointer"
                aria-label="شريط تقدم التلاوة"
              />
            </div>

            {/* Central Controls Bar */}
            <div className="mx-auto mt-8 grid max-w-xl grid-cols-4 items-center justify-items-center gap-3 sm:flex sm:flex-wrap sm:gap-6">
              {/* Auto Advance Toggle */}
              <button
                type="button"
                onClick={() => {
                  setAutoAdvance(!autoAdvance);
                  toast.info(
                    autoAdvance
                      ? "تم إيقاف التشغيل التلقائي للسور"
                      : "تم تفعيل الانتقال التلقائي للسورة التالية",
                  );
                }}
                className={`rounded-full p-2.5 transition-colors cursor-pointer ${
                  autoAdvance
                    ? "bg-forest/15 text-primary ring-1 ring-forest/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={
                  autoAdvance ? "الانتقال التلقائي للسورة التالية مفعّل" : "تفعيل الانتقال التلقائي"
                }
              >
                <ListMusic className="size-4" />
              </button>

              {/* Loop / Repeat Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsLooping(!isLooping);
                  toast.info(isLooping ? "تم إيقاف تكرار السورة" : "تم تفعيل تكرار السورة الحالية");
                }}
                className={`rounded-full p-2.5 transition-colors cursor-pointer ${
                  isLooping
                    ? "bg-gold/20 text-gold ring-1 ring-gold/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={isLooping ? "تكرار السورة مفعّل" : "تكرار السورة الحالية"}
              >
                <Repeat className="size-4" />
              </button>

              {/* Previous Surah Track */}
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevSurah}
                disabled={selectedSurahNumber <= 1}
                className="size-11 rounded-full cursor-pointer"
                title="السورة السابقة"
              >
                <SkipForward className="size-5" />
              </Button>

              {/* Skip 10s Backward */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSkipSeconds(-10)}
                className="size-10 rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
                title="تراجع ١٠ ثوانٍ"
              >
                <span className="text-xs font-bold font-mono">-10</span>
              </Button>

              {/* Main Play / Pause Button */}
              <Button
                variant="gold"
                size="icon"
                onClick={handleTogglePlay}
                disabled={isLoadingAudio}
                className="size-14 rounded-full shadow-gold transition-transform active:scale-95 cursor-pointer sm:size-16"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل التلاوة"}
              >
                {isLoadingAudio ? (
                  <div className="size-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                ) : isPlaying ? (
                  <Pause className="size-7 fill-forest text-forest" />
                ) : (
                  <Play className="size-7 fill-forest text-forest translate-x-[-1px]" />
                )}
              </Button>

              {/* Skip 10s Forward */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSkipSeconds(10)}
                className="size-10 rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
                title="تقديم ١٠ ثوانٍ"
              >
                <span className="text-xs font-bold font-mono">+10</span>
              </Button>

              {/* Next Surah Track */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextSurah}
                disabled={selectedSurahNumber >= 114}
                className="size-11 rounded-full cursor-pointer"
                title="السورة التالية"
              >
                <SkipBack className="size-5" />
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="size-4 text-destructive" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.05}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                    aria-label="مستوى الصوت"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Footer in Player */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border/80 pt-6">
              <Button asChild variant="soft" size="sm" className="gap-1.5 text-xs">
                <Link to={`/quran/read?surah=${selectedSurahNumber}`}>
                  <BookOpen className="size-3.5 text-gold" />
                  <span>فتح قراءة سورة {currentSurah.nameSimple} بالرسم العثماني</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("تم نسخ رابط التلاوة للمشاركة");
                  }
                }}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Share2 className="size-3.5" />
                <span>مشاركة التلاوة</span>
              </Button>
            </div>
            </>
            )}
          </div>

          {/* Section 3: Surahs Playlist & Filter Table (All 114 Surahs) */}
          {!isArchiveReciter && <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
              <div>
                <span className="text-xs font-semibold text-gold">فهرس السور</span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  قائمة سور القرآن الكريم (١١٤ سورة)
                </h3>
                <p className="text-xs text-muted-foreground">
                  انقر على أي سورة للاستماع الفوري بصوت {currentReciter.name}
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative min-w-[220px]">
                  <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ابحث باسم السورة أو رقمها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9 text-xs"
                  />
                </div>
                <div className="flex rounded-lg border border-border bg-secondary/50 p-1">
                  <button
                    type="button"
                    onClick={() => setFilterType("all")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
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
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
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
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      filterType === "Medinan"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    مدنية
                  </button>
                </div>
              </div>
            </div>

            {/* Surah List Table / Grid */}
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSurahs.map((surah) => {
                const isCurrent = surah.number === selectedSurahNumber;
                return (
                  <div
                    key={surah.number}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                      isCurrent
                        ? "border-gold bg-gold/10 ring-1 ring-gold shadow-xs"
                        : "border-border bg-card hover:border-gold/40 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isCurrent ? "bg-forest text-gold" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {toArabicDigits(surah.number)}
                      </span>
                      <div className="truncate">
                        <h4 className="font-serif text-base font-bold text-foreground">
                          {surah.nameSimple}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {surah.revelationTypeArabic} · {toArabicDigits(surah.numberOfAyahs)} آية
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        title="قراءة السورة"
                      >
                        <Link to={`/quran/read?surah=${surah.number}`}>
                          <BookOpen className="size-3.5 text-muted-foreground hover:text-gold" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant={isCurrent && isPlaying ? "gold" : "outline"}
                        onClick={() => handleSelectSurahAndPlay(surah.number)}
                        className="size-8 p-0 cursor-pointer"
                        title={isCurrent && isPlaying ? "إيقاف مؤقت" : "تشغيل التلاوة"}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}
        </div>
      </section>
    </>
  );
}
