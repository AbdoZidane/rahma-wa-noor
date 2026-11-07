import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, LoaderCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { completeQuranKhatmaPart } from "@/lib/site.functions";
import { toArabicDigits } from "@/lib/content/quran";
import { toast } from "sonner";

export const Route = createFileRoute("/quran/khatma/read/$part")({
  head: () => ({
    meta: [
      { title: "قراءة الجزء | ختمة القرآن | رحمة ونور" },
      { name: "description", content: "اقرأ الجزء الذي حجزته من القرآن الكريم ثم سجّل إتمامه." },
    ],
  }),
  component: KhatmaPartReader,
});

type JuzAyah = {
  text: string;
  numberInSurah: number;
  surah: { number: number; name: string };
};

const TOKEN_KEY = "rahma_quran_khatma_claims";

function KhatmaPartReader() {
  const { part: partParam } = Route.useParams();
  const part = Number(partParam);
  const navigate = useNavigate();
  const [ayahs, setAyahs] = useState<JuzAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!Number.isInteger(part) || part < 1 || part > 30) {
      setError(true);
      setLoading(false);
      return;
    }
    fetch(`https://api.alquran.cloud/v1/juz/${part}/quran-uthmani`)
      .then(async (response) => {
        if (!response.ok) throw new Error("تعذر تحميل الجزء");
        const json = await response.json();
        if (json.code !== 200 || !Array.isArray(json.data?.ayahs) || !json.data.ayahs.length) {
          throw new Error("بيانات الجزء غير متاحة");
        }
        if (!cancelled) setAyahs(json.data.ayahs as JuzAyah[]);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [part]);

  const markCompleted = async () => {
    let token: string | undefined;
    try {
      const claims = JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}") as Record<string, string>;
      token = claims[String(part)];
    } catch {
      token = undefined;
    }
    if (!token) {
      toast.error("بيانات حجز الجزء غير موجودة على هذا الجهاز. ارجع للختمة وتأكد من الحجز.");
      return;
    }
    setBusy(true);
    const result = await completeQuranKhatmaPart({ data: { part, token } });
    setBusy(false);
    if (!result.ok) {
      toast.error("تعذر تسجيل إتمام الجزء. تأكد أن الحجز ما زال باسمك وحاول مرة أخرى.");
      return;
    }
    try {
      const claims = JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}") as Record<string, string>;
      delete claims[String(part)];
      localStorage.setItem(TOKEN_KEY, JSON.stringify(claims));
    } catch {
      // Completion is already saved on the server.
    }
    toast.success("تقبل الله منك، تم تسجيل إتمام الجزء.");
    await navigate({ to: "/quran/khatma" });
  };

  let previousSurah = 0;

  return (
    <>
      <PageHeader eyebrow="ختمة القرآن الجماعية" title={`قراءة الجزء ${toArabicDigits(part)}`}>
        اقرأ الجزء كاملًا على مهل، وعند الانتهاء سجّل إتمامه لتحديث تقدم الختمة.
      </PageHeader>
      <section className="pattern-islamic min-h-[65vh] py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/quran/khatma"><ArrowRight className="ms-1 size-4" /> العودة للختمة</Link>
            </Button>
            <span className="text-sm text-muted-foreground">الجزء {toArabicDigits(part)} من ٣٠</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-muted-foreground"><LoaderCircle className="size-8 animate-spin" /></div>
          ) : error ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">تعذر تحميل آيات الجزء الآن. تحقق من اتصال الإنترنت وحاول مرة أخرى.</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
            </div>
          ) : (
            <>
              <article className="rounded-2xl border border-border bg-card px-5 py-7 shadow-soft sm:px-9 sm:py-10">
                <div className="mb-6 flex items-center justify-center gap-2 text-primary">
                  <BookOpen className="size-5 text-gold" />
                  <h2 className="font-serif text-xl font-bold">الجزء {toArabicDigits(part)}</h2>
                </div>
                <div className="quran-text text-center text-2xl leading-[2.5] text-foreground sm:text-3xl sm:leading-[2.7]">
                  {ayahs.map((ayah, index) => {
                    const showSurah = ayah.surah.number !== previousSurah;
                    previousSurah = ayah.surah.number;
                    return (
                      <span key={`${ayah.surah.number}-${ayah.numberInSurah}-${index}`}>
                        {showSurah && (
                          <span className="my-7 block rounded-xl border border-gold/30 bg-gold/5 px-3 py-3 font-serif text-xl font-bold text-primary">
                            سورة {ayah.surah.name}
                          </span>
                        )}
                        {ayah.text}{" "}
                        <span className="inline-block text-base text-gold">﴿{toArabicDigits(ayah.numberInSurah)}﴾</span>{" "}
                      </span>
                    );
                  })}
                </div>
              </article>
              <div className="mt-5 rounded-2xl border border-gold/30 bg-card p-5 text-center">
                <p className="mb-4 text-sm text-muted-foreground">بعد ما تخلص قراءة الجزء كاملًا، اضغط هنا لتسجيل إتمامك.</p>
                <Button size="lg" className="w-full sm:w-auto" onClick={() => void markCompleted()} disabled={busy}>
                  {busy ? <LoaderCircle className="ms-2 size-4 animate-spin" /> : <CheckCircle2 className="ms-2 size-4" />}
                  أتممت قراءة الجزء
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
