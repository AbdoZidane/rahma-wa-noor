import { AYAT } from "./quran-data";

export type VerseGroup = {
  id: string;
  surah: string;
  from: number;
  to: number;
  theme: string;
  verses: { n: number; text: string }[];
};

function group(
  id: string,
  surah: string,
  surahNo: number,
  from: number,
  to: number,
  theme: string,
): VerseGroup {
  const verses = [];
  for (let n = from; n <= to; n++) verses.push({ n, text: AYAT[`${surahNo}:${n}`] });
  return { id, surah, from, to, theme, verses };
}

export const VERSE_GROUPS: VerseGroup[] = [
  group("baqarah-155", "البقرة", 2, 155, 157, "البشرى للصابرين"),
  group("fajr-27", "الفجر", 89, 27, 30, "النفس المطمئنة"),
  group("imran-185", "آل عمران", 3, 185, 185, "كل نفس ذائقة الموت"),
  group("rahman-26", "الرحمن", 55, 26, 27, "البقاء لله وحده"),
  group("zumar-53", "الزمر", 39, 53, 53, "سعة رحمة الله"),
  group("yasin-58", "يس", 36, 58, 58, "سلام من رب رحيم"),
  group("baqarah-286", "البقرة", 2, 286, 286, "دعاء خواتيم البقرة"),
];

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const toArabicDigits = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
