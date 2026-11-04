import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, HandHeart, Heart, Moon, Sparkles, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/site/Portrait";
import { Divider } from "@/components/site/Ornament";
import { approvedPrayersQuery, DECEASED_NAME, portraitSrc, siteContentQuery } from "@/lib/queries";
import { DUA_BENEFIT_HADITH } from "@/lib/content/duas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رحمة ونور | ذكرى عبدالرازق محمود زيدان" },
      {
        name: "description",
        content:
          "رحمك الله يا جدي — موقع تذكاري لعبدالرازق محمود زيدان للدعاء له وقراءة الأذكار والقرآن الكريم.",
      },
      { property: "og:title", content: "رحمة ونور | ذكرى عبدالرازق محمود زيدان" },
      {
        property: "og:description",
        content:
          "مكان هادئ للدعاء لعبدالرازق محمود زيدان، مع الأذكار والآيات والمسبحة الإلكترونية.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery),
      context.queryClient.ensureQueryData(approvedPrayersQuery),
    ]),
  component: Index,
});

const SECTIONS = [
  {
    to: "/duas",
    title: "الدعاء للمتوفى",
    desc: "أدعية صحيحة من الكتاب والسنة مع إمكانية النسخ",
    icon: HandHeart,
  },
  {
    to: "/azkar",
    title: "الأذكار اليومية",
    desc: "أذكار الصباح والمساء بمصادرها الموثوقة",
    icon: Sun,
  },
  {
    to: "/tasbeeh",
    title: "المسبحة الإلكترونية",
    desc: "عدّاد تسبيح بسيط وأنيق بأذكار متعددة",
    icon: Sparkles,
  },
  {
    to: "/quran",
    title: "آيات من القرآن الكريم",
    desc: "آيات مختارة بالرسم العثماني مع أرقامها",
    icon: BookOpen,
  },
  { to: "/prayers", title: "اترك دعاءً", desc: "شاركنا دعاءً أو ذكرى طيبة له", icon: Heart },
  {
    to: "/about",
    title: "عن عبدالرازق",
    desc: "صفحة تذكارية بسيرته وذكريات العائلة",
    icon: UserRound,
  },
] as const;

function Index() {
  const { data: content } = useSuspenseQuery(siteContentQuery);
  const { data: prayers } = useSuspenseQuery(approvedPrayersQuery);
  const latest = prayers.slice(0, 3);

  return (
    <>
      {/* Hero */}
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
              ستظل ذكراك الطيبة في قلوبنا، نسأل الله أن يغفر لك ويرحمك
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start animate-fade-up [animation-delay:450ms]">
              <Button asChild variant="gold" size="xl">
                <a href="#sections">استكشف الموقع</a>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/prayers">اترك دعاءً</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:200ms]">
            <Portrait
              src={portraitSrc(content.portraitPath)}
              name={DECEASED_NAME}
              className="sm:w-72"
            />
          </div>
        </div>
      </section>

      {/* Hadith */}
      <section className="bg-parchment-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="dua-text text-2xl text-primary sm:text-3xl">«{DUA_BENEFIT_HADITH.text}»</p>
          <p className="mt-4 text-sm text-muted-foreground">{DUA_BENEFIT_HADITH.source}</p>
        </div>
      </section>

      {/* Sections */}
      <section id="sections" className="pattern-islamic scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">أقسام الموقع</h2>
            <Divider className="mt-5" />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map(({ to, title, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-gold"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-primary">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest prayers */}
      {latest.length > 0 && (
        <section className="bg-secondary/50">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">من دعوات الزوار</h2>
              <Divider className="mt-5" />
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {latest.map((p) => (
                <figure
                  key={p.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <blockquote className="dua-text text-lg text-foreground">{p.message}</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    — {p.author_name || "زائر"}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="default" size="lg" className="rounded-full">
                <Link to="/prayers">عرض كل الدعوات</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
