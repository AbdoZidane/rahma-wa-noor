export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  style: string;
  description: string;
  country: string;
  cdnPath: string;
}

export const RECITERS_LIST: Reciter[] = [
  {
    id: "abdulbasit",
    name: "الشيخ عبد الباسط عبد الصمد",
    englishName: "Abdul Basit Abdus Samad",
    style: "المصحف المجود — رواية حفص عن عاصم",
    description: "صوت مكة وسفير القرآن الكريم، صاحب الحنجرة الذهبية والتلاوات الخاشعة الخالدة.",
    country: "مصر",
    cdnPath: "abdulbasit-abdulsamad/r3",
  },
  {
    id: "husary",
    name: "الشيخ محمود خليل الحصري",
    englishName: "Mahmoud Khalil Al-Husary",
    style: "المصحف المرتل — رواية حفص عن عاصم",
    description: "شيخ عموم المقارئ المصرية، وأيقونة الإتقان وأحكام التجويد والترتيل الدقيق.",
    country: "مصر",
    cdnPath: "mahmoud-husary/r1",
  },
  {
    id: "alafasy",
    name: "الشيخ مشاري راشد العفاسي",
    englishName: "Mishary Rashid Alafasy",
    style: "المصحف المرتل — رواية حفص عن عاصم",
    description: "صوت شجي ومؤثر يأسر القلوب، وقارئ وإمام المسجد الكبير بالكويت.",
    country: "الكويت",
    cdnPath: "mishary-alafasy/r1",
  },
  {
    id: "minshawi",
    name: "الشيخ محمد صديق المنشاوي",
    englishName: "Muhammad Siddiq Al-Minshawi",
    style: "المصحف المرتل — رواية حفص عن عاصم",
    description: "الصوت الباكي ذو النبرة الشجية الفريدة التي تبث الخشوع والسكينة في النفوس.",
    country: "مصر",
    cdnPath: "muhammad-minshawi/r1",
  },
  {
    id: "muaiqly",
    name: "الشيخ ماهر المعيقلي",
    englishName: "Maher Al-Muaiqly",
    style: "المصحف المرتل — تلاوات الحرم المكي",
    description: "إمام وخطيب المسجد الحرام بمكة المكرمة، صوت عذب يتميز بالوقار والترتيل المتقن.",
    country: "السعودية",
    cdnPath: "maher-muaiqly/r1",
  },
  {
    id: "sudais",
    name: "الشيخ عبد الرحمن السديس",
    englishName: "Abdul Rahman Al-Sudais",
    style: "المصحف المرتل — تلاوات الحرم المكي",
    description:
      "إمام وخطيب المسجد الحرام ورئيس الشؤون الدينية للحرمين، صاحب النبرة الرخيمة الشهيرة.",
    country: "السعودية",
    cdnPath: "abdulrahman-sudais/r1",
  },
];

export function getReciterAudioUrl(reciterCdnPath: string, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, "0");
  return `https://cdn.mp3quran.net/audio/${reciterCdnPath}/${padded}.mp3`;
}
