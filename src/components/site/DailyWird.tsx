import { Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/site/CopyButton";
import { DUAS } from "@/lib/content/duas";

const VERSES = [
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "سورة الرعد — الآية ٢٨" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح — الآية ٥" },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", ref: "سورة طه — الآية ١١٤" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: "سورة البقرة — الآية ١٥٣" },
  { text: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", ref: "سورة الحديد — الآية ٤" },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", ref: "سورة البقرة — الآية ١٨٦" },
];

const DHIKR = [
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
];

export function DailyWird() {
  // Use Cairo's calendar date so the daily wird changes at local midnight.
  // An explicit time zone keeps the server and browser in sync during hydration.
  const dateParts = new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const year = Number(dateParts.find((part) => part.type === "year")?.value);
  const month = Number(dateParts.find((part) => part.type === "month")?.value);
  const day = Number(dateParts.find((part) => part.type === "day")?.value);
  const dayIndex = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(2025, 0, 1)) / 86400000,
  );
  const index = (n: number) => ((dayIndex % n) + n) % n;
  const verse = VERSES[index(VERSES.length)];
  const dhikr = DHIKR[index(DHIKR.length)];
  const dua = DUAS[index(DUAS.length)];
  const shareText =
    "ورد اليوم من رحمة ونور\n\nآية اليوم: " + verse.text + "\n" + verse.ref +
    "\n\nذكر اليوم: " + dhikr +
    "\n\nدعاء اليوم: " + dua.text + "\n" + dua.source +
    "\n\nرحمة ونور — صدقة جارية عن عبدالرازق محمود زيدان";

  return (
    <section className="border-y border-border bg-card py-16">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-gold" /> زاد اليوم
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">وردك اليومي</h2>
          <p className="mt-3 text-muted-foreground">آية وذكر ودعاء يتجددون كل يوم، ويمكنك نسخهم ومشاركتهم.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-background p-6 shadow-soft">
            <p className="text-xs font-semibold text-gold">آية اليوم</p>
            <p className="quran-text mt-4 text-2xl leading-loose text-primary">{verse.text}</p>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{verse.ref}</p>
          </article>
          <article className="rounded-2xl border border-border bg-background p-6 shadow-soft">
            <p className="text-xs font-semibold text-gold">ذكر اليوم</p>
            <p className="dua-text mt-4 text-2xl leading-loose text-primary">{dhikr}</p>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">اجعل لسانك رطبًا بذكر الله</p>
          </article>
          <article className="rounded-2xl border border-border bg-background p-6 shadow-soft">
            <p className="text-xs font-semibold text-gold">دعاء اليوم لجدك رحمه الله</p>
            <h3 className="mt-3 font-serif text-lg font-bold text-primary">{dua.title}</h3>
            <p className="dua-text mt-3 text-lg leading-loose text-foreground">{dua.text}</p>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{dua.source}</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <CopyButton text={shareText} label="نسخ الورد كاملًا" />
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                void navigator.share({ title: "وردك اليومي | رحمة ونور", text: shareText }).catch(() => {});
              } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                void navigator.clipboard.writeText(shareText);
              }
            }}
          >
            <Share2 className="size-4" /> مشاركة الورد
          </Button>
        </div>
      </div>
    </section>
  );
}
