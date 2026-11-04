import { cn } from "@/lib/utils";

export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-6", className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="11" y="11" width="26" height="26" />
        <rect x="11" y="11" width="26" height="26" transform="rotate(45 24 24)" />
        <circle cx="24" cy="24" r="4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 text-gold", className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-l from-gold to-transparent sm:w-24" />
      <StarMark className="size-5" />
      <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent sm:w-24" />
    </div>
  );
}
