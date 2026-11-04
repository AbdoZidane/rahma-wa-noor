import { Link } from "@tanstack/react-router";
import { Divider } from "./Ornament";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep pattern-islamic text-forest-foreground">
      <div className="mx-auto max-w-6xl px-5 py-12 text-center">
        <p className="font-serif text-2xl text-gold-gradient">اللهم اغفر له وارحمه</p>
        <Divider className="my-6" />
        <nav
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"
          aria-label="روابط التذييل"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-forest-foreground/70 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs text-forest-foreground/50">
          صدقة جارية في ذكرى عبدالرازق محمود زيدان — لا نجمع أي بيانات شخصية عن الزوار.
        </p>
        <Link
          to="/auth"
          className="mt-3 inline-block text-xs text-forest-foreground/35 hover:text-gold"
        >
          دخول الإدارة
        </Link>
      </div>
    </footer>
  );
}
