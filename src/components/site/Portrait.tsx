import { cn } from "@/lib/utils";
import { StarMark } from "./Ornament";

/** Arch-framed portrait; shows a respectful placeholder until the family uploads a photo. */
export function Portrait({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  return (
    <div className={cn("portrait-living relative mx-auto aspect-[3/4] w-56 sm:w-64", className)}>
      <div className="portrait-halo absolute -inset-3 rounded-t-full border border-gold/40" aria-hidden="true" />
      <div
        className="absolute -inset-1.5 rounded-t-full border border-gold/70"
        aria-hidden="true"
      />
      <div className="relative h-full w-full overflow-hidden rounded-t-full bg-forest-deep shadow-gold">
        {src ? (
          <img src={src} alt={`صورة ${name}`} className="portrait-photo h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        ) : (
          <div className="pattern-islamic-strong flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-forest-foreground/70">
            <StarMark className="size-12 text-gold" />
            <p className="text-sm leading-relaxed">مكان صورة العائلة</p>
          </div>
        )}
      </div>
    </div>
  );
}
