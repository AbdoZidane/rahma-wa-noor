
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
  {
    id: "ali-jaber",
    name: "الشيخ علي جابر",
    englishName: "Ali Jaber",
    style: "المصحف المرتل — رواية حفص عن عاصم",
    description: "إمام المسجد الحرام سابقًا، وصاحب الصوت الهادئ المميز.",
    country: "السعودية",
    cdnPath: "https://server11.mp3quran.net/a_jbr/",
  },
  {
    id: "mustafa-ismail",
    name: "الشيخ مصطفى إسماعيل",
    englishName: "Mustafa Ismail",
    style: "المصحف المجود — رواية حفص عن عاصم",
    description: "من أعلام التلاوة المصرية، وصاحب الأداء المتفرد في التجويد والمقامات.",
    country: "مصر",
    cdnPath: "https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/",
  },
  {
    id: "mahmoud-albanna",
    name: "الشيخ محمود علي البنا",
    englishName: "Mahmoud Ali Albanna",
    style: "المصحف المجود — رواية حفص عن عاصم",
    description: "من كبار قراء مصر، وصاحب صوت عذب وأداء قرآني مميز.",
    country: "مصر",
    cdnPath: "https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad/",
  },
  {
    id: "ahmed-naina",
    name: "الشيخ أحمد نعينع",
    englishName: "Ahmed Naina",
    style: "المصحف المرتل — رواية حفص عن عاصم",
    description: "قارئ مصري متميز، يتمتع بصوت قوي وأداء متقن.",
    country: "مصر",
    cdnPath: "https://server11.mp3quran.net/ahmad_nu/",
  },
  {
    id: "yasser-dosari",
    name: "الشيخ ياسر الدوسري",
    englishName: "Yasser Al-Dosari",
    style: "تلاوات الحرم المكي — المصحف المرتل",
    description: "إمام وخطيب المسجد الحرام، صاحب صوت قوي وخاشع وأداء مميز في تلاوات الحرم المكي.",
    country: "السعودية",
    cdnPath: "yasser-dosari/r1",
  },
];

export function getReciterAudioUrl(
  reciterCdnPath: string,
  surahNumber: number
): string {
  const padded = String(surahNumber).padStart(3, "0");

  const baseUrl = reciterCdnPath.startsWith("https://")
    ? reciterCdnPath
    : `https://cdn.mp3quran.net/audio/${reciterCdnPath}/`;

  return `${baseUrl}${padded}.mp3`;
}
