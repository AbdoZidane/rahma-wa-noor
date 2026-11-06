import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Heart, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approvedPrayersQuery, DECEASED_NAME } from "@/lib/queries";
import { submitPrayer } from "@/lib/site.functions";
import { formatArabicDate } from "@/lib/utils";

export const Route = createFileRoute("/prayers")({
  head: () => ({
    meta: [
      { title: `دعوات الزوار | رحمة ونور` },
      {
        name: "description",
        content: `شارك بدعوة طيبة للمرحوم ${DECEASED_NAME}، أو اقرأ دعوات الزوار.`,
      },
      { property: "og:title", content: `دعوات الزوار | رحمة ونور` },
      {
        property: "og:description",
        content: `شارك بدعوة طيبة أو كلمة صالحة في ذكرى ${DECEASED_NAME}.`,
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(approvedPrayersQuery),
  component: PrayersPage,
});

function PrayersPage() {
  const { data: prayers } = useSuspenseQuery(approvedPrayersQuery);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [startTime, setStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("يرجى كتابة نص الدعاء");
      return;
    }

    setIsSubmitting(true);
    try {
      const elapsedMs = startTime > 0 ? Date.now() - startTime : 5000;
      const res = await submitPrayer({
        data: {
          name: name.trim(),
          message: message.trim(),
          website,
          elapsedMs,
        },
      });

      if (res.ok) {
        toast.success("جزاك الله خيراً، تم إرسال دعائك بنجاح");
        setName("");
        setMessage("");
        await queryClient.invalidateQueries({ queryKey: ["approved-prayers"] });
        setSubmitted(true);
      } else {
        toast.error(res.error || "تعذر إرسال الدعاء، يرجى المحاولة لاحقاً");
      }
    } catch {
      toast.error("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="شاركنا بدعوة طيبة" title="دعوات الزوار">
        اللهم اجعل كل حرف وكل دعاء في ميزان حسنات {DECEASED_NAME}
      </PageHeader>

      <section className="pattern-islamic">
        <div className="mx-auto max-w-4xl px-5 py-16">
          {/* Submission Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest text-gold">
                <Heart className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-primary">اترك دعاءً للمتوفى</h2>
                <p className="text-sm text-muted-foreground">نسأل الله أن يتقبل منكم صالح الدعاء</p>
              </div>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-6 text-center">
                <Sparkles className="mx-auto size-8 text-gold" />
                <h3 className="mt-2 font-serif text-xl font-bold text-primary">
                  شكر الله سعيكم وتقبل دعاءكم
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  جزاكم الله خيراً وأثابكم على طيب دعائكم
                </p>
                <Button
                  variant="gold"
                  className="mt-4"
                  onClick={() => {
                    setSubmitted(false);
                    setStartTime(Date.now());
                  }}
                >
                  كتابة دعاء آخر
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Honeypot field for bot protection */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Label htmlFor="author-name">الاسم (اختياري)</Label>
                  <Input
                    id="author-name"
                    placeholder="مثال: فاعل خير / أحمد زيدان"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="prayer-message">الدعاء *</Label>
                  <Textarea
                    id="prayer-message"
                    required
                    rows={4}
                    placeholder="اللهم اغفر له وارحمه وعافه واعف عنه..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    className="mt-1 resize-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    بحد أقصى ١٠٠٠ حرف — يُرجى عدم وضع روابط
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                    className="gap-2 font-semibold"
                  >
                    <Send className="size-4" />
                    {isSubmitting ? "جارٍ الإرسال..." : "إرسال الدعاء"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* List of prayers */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">دعوات الأحباب والزوار</h2>
            <div className="mt-6 grid gap-4">
              {prayers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
                  كن أول من يترك دعاءً للمتوفى رحمه الله.
                </div>
              ) : (
                prayers.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all"
                  >
                    <p className="dua-text text-xl leading-relaxed text-foreground">{p.message}</p>
                    <footer className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">
                        {p.author_name || "فاعل خير"}
                      </span>
                      {p.created_at && (
                        <time dateTime={p.created_at} suppressHydrationWarning>
                          {formatArabicDate(p.created_at)}
                        </time>
                      )}
                    </footer>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
