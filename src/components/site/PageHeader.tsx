import type { ReactNode } from "react";
import { Divider } from "./Ornament";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-forest-gradient pattern-islamic-strong overflow-hidden text-forest-foreground">
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
        {eyebrow && (
          <p className="mb-3 text-sm tracking-wide text-gold-soft animate-fade-up">{eyebrow}</p>
        )}
        <h1 className="text-4xl font-bold leading-tight text-gold-gradient sm:text-5xl animate-fade-up">
          {title}
        </h1>
        <Divider className="mt-6" />
        {children && (
          <div className="mx-auto mt-6 max-w-2xl text-base leading-loose text-forest-foreground/80 sm:text-lg">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
