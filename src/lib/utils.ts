import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_MONTH_NAMES = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function formatArabicDate(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "";
    const day = String(d.getUTCDate()).replace(/[0-9]/g, (n) => "٠١٢٣٤٥٦٧٨٩"[Number(n)] ?? n);
    const month = ARABIC_MONTH_NAMES[d.getUTCMonth()] ?? "";
    const year = String(d.getUTCFullYear()).replace(/[0-9]/g, (n) => "٠١٢٣٤٥٦٧٨٩"[Number(n)] ?? n);
    return `${day} ${month} ${year}`;
  } catch {
    return "";
  }
}
