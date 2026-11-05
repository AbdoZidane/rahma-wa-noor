import { Link } from "@tanstack/react-router";
import { BookOpen, Home, Menu, Sparkles, Sun, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StarMark } from "./Ornament";

export const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/quran", label: "القرآن الكريم" },
  { to: "/duas", label: "الأدعية" },
  { to: "/azkar", label: "الأذكار" },
  { to: "/tasbeeh", label: "المسبحة" },
  { to: "/about", label: "سيرة جدي" },
  { to: "/prayers", label: "اترك دعاءً" },
] as const;

const linkCls =
  "rounded-full px-3 py-2 text-sm text-forest-foreground/80 transition-colors hover:text-gold data-[status=active]:text-gold";

export function SiteHeader({ rainMuted, onToggleRain }: { rainMuted: boolean; onToggleRain: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-forest-deep/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-forest-foreground">
            <StarMark className="size-7 text-gold" />
            <span className="font-serif text-xl font-bold">رحمة ونور</span>
          </Link>
          <button
            type="button"
            onClick={onToggleRain}
            aria-label={rainMuted ? "تشغيل صوت المطر" : "كتم صوت المطر"}
            aria-pressed={rainMuted}
            title={rainMuted ? "تشغيل صوت المطر" : "كتم صوت المطر"}
            className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/10"
          >
            {rainMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={linkCls} activeOptions={{ exact: true }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="rounded-full p-2 text-forest-foreground transition-colors hover:text-gold lg:hidden"
            aria-label="فتح القائمة"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-forest-deep border-gold/20 text-forest-foreground"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-serif text-xl text-forest-foreground">
                <StarMark className="size-6 text-gold" /> رحمة ونور
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4" aria-label="القائمة">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: true }}
                  className="rounded-lg px-4 py-3 text-base text-forest-foreground/85 transition-colors hover:bg-forest-foreground/5 hover:text-gold data-[status=active]:bg-forest-foreground/5 data-[status=active]:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gold/20 bg-forest-deep/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 text-forest-foreground shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur lg:hidden"
        aria-label="التنقل السريع"
      >
        {[
          { to: "/", label: "الرئيسية", icon: Home },
          { to: "/quran", label: "القرآن", icon: BookOpen },
          { to: "/azkar", label: "الأذكار", icon: Sun },
          { to: "/tasbeeh", label: "المسبحة", icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[11px] text-forest-foreground/75 transition-colors data-[status=active]:text-gold"
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
