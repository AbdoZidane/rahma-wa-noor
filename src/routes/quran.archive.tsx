import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Headphones, Play, Search, Sparkles, ChevronDown, ChevronUp, Star } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DECEASED_NAME } from "@/lib/queries";

export const Route = createFileRoute("/quran/archive")({
  head: () => ({
    meta: [
      { title: "نبرات مميزة | رحمة ونور" },
      { name: "description", content: "مختارات صوتية من تلاوات كبار قراء القرآن الكريم." },
    ],
  }),
  component: QuranArchivePage,
});

type ArchiveRecording = {
  id: string;
  reciter: string;
  title: string;
  surah: string;
  details: string;
  place?: string;
  year?: string;
  url: string;
};

const RECORDINGS: ArchiveRecording[] = [
  {
    id: "naina-south-africa-qiyama",
    surah: "القيامة وقصار السور",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة القيامة وقصار السور",
    details: "سهرة قرآنية مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/8026dced-446e-42a8-9571-3525e3d460bd",
  },
  {
    id: "naina-south-africa-yusuf",
    surah: "يوسف",
    reciter: "الشيخ أحمد نعينع",
    title: "سهرة قرآنية من سورة يوسف",
    details: "تلاوة مسجلة من جنوب أفريقيا",
    place: "جنوب أفريقيا",
    year: "1994",
    url: "https://misrquran.gov.eg/episodedetails/f4405619-1646-45b2-977b-5da6bd05da6b",
  },
  {
    id: "mustafa-al-imam",
    surah: "البقرة وقصار السور",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سورة البقرة وقصار السور",
    details: "سهرة قرآنية مسجلة من المسجد الأقصى",
    place: "المسجد الأقصى",
    url: "https://misrquran.gov.eg/episodedetails/6c0d7fea-d594-4166-adf1-cf6c240672e6",
  },
  {
    id: "mustafa-ali-imran",
    surah: "آل عمران وقصار السور",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من آل عمران وقصار السور",
    details: "تلاوة إذاعية مع تعليق للشيخ محمد الغزالي",
    url: "https://misrquran.gov.eg/episodedetails/8661c5ea-a3a8-4059-9f55-ed5d2dc65022",
  },
  {
    id: "mustafa-ibrahim",
    surah: "إبراهيم",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة من سورة إبراهيم",
    details: "تلاوة مسجلة من مسجد السيدة زينب",
    place: "مسجد السيدة زينب",
    url: "https://misrquran.gov.eg/episodedetails/dce4c5b9-d923-4594-902f-b68017890a10",
  },
  {
    id: "minshawi-sajda-alaq",
    surah: "السجدة والعلق",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورتي السجدة والعلق",
    details: "من أول سورة السجدة حتى الآية 19، ومن أول سورة العلق حتى الآية 8",
    url: "https://misrquran.gov.eg/episodedetails/aa3063a2-8e00-4e87-a689-ea3235715e2e",
  },
  {
    id: "minshawi-tauba",
    surah: "التوبة",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة التوبة",
    details: "من الآية 36 حتى الآية 40",
    url: "https://misrquran.gov.eg/episodedetails/6612ebf1-c032-450d-9773-000d2619cbd9",
  },
  {
    id: "banna-anbiya",
    surah: "الأنبياء",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الأنبياء",
    details: "تلاوة قرآنية مع تعليق للدكتور محمد الطيب النجار",
    url: "https://misrquran.gov.eg/episodedetails/4708f529-b08f-4c90-be26-6c612aff57e6",
  },
  {
    id: "banna-baqara",
    surah: "البقرة",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة ضمن احتفال محافظة الإسكندرية بالمولد النبوي الشريف",
    place: "الإسكندرية",
    url: "https://misrquran.gov.eg/episodedetails/a254dedd-c929-461f-a970-01b417cd1d17",
  },
  {
    id: "bahtimi-baqara",
    surah: "البقرة",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "تلاوة قرآنية من سورة البقرة",
    details: "تلاوة مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    url: "https://misrquran.gov.eg/episodedetails/ae0d5187-b5f6-4238-9ccf-eace3416e6f4",
  },
  {
    id: "bahtimi-maryam",
    surah: "مريم",
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "سهرة قرآنية من سورة مريم",
    details: "سهرة قرآنية مسجلة من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين",
    year: "1963",
    url: "https://misrquran.gov.eg/episodedetails/28543119-1cf6-4ee3-af49-ba767bb16902",
  },
  {
    id: "naina-ali-imran-late",
    surah: "آل عمران",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من سورة آل عمران",
    details: "من الآية 93 حتى الآية 161",
    
    url: "https://misrquran.gov.eg/recorddetails/ccc329a4-315f-4b12-90f0-0618c43e17f9",
  },
  {
    id: "minshawi-luqman",
    surah: "لقمان",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة قرآنية من سورة لقمان",
    details: "تسجيل من مسجد سلامة الراضي بحي بولاق الدكرور",
    url: "https://misrquran.gov.eg/episodedetails/98b6c686-c560-4fa4-9332-295b134a8fa9",
  },
  {
    id: "banna-naml",
    surah: "النمل",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/423c7293-bb08-4415-b281-79302b9e65f9",
  },
  {
    id: "mustafa-qamar-rahman",
    surah: "القمر والرحمن والبلد والشمس",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سور متعددة",
    details: "سهرة قرآنية من أرشيف إذاعة القرآن الكريم",
    url: "https://misrquran.gov.eg/episodedetails/f8ead001-050c-4d2c-aefb-16df20b85120",
  },
  {
    id: "mustafa-baqara-murattal",
    surah: "البقرة",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "مقطع من المصحف المرتل",
    details: "من الآية 113 حتى الآية 218",
    url: "https://misrquran.gov.eg/recorddetails/a810891b-cab6-4c2f-a8d4-13d1d958fe56",
  },
  {
    id: "minshawi-isra-murattal",
    surah: "الإسراء",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "مقطع من المصحف المرتل",
    details: "من الآية 1 حتى الآية 81",
    url: "https://misrquran.gov.eg/recorddetails/51271eef-2643-4302-915b-b329dcbbabfc",
  },

  {
    id: "naina-muminun-noor",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع من المصحف المرتل",
    surah: "المؤمنون إلى النور",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/9635b6e1-2cdb-4689-98af-6c80e0e0a15a",
  },
  {
    id: "naina-ali-imran-radio",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "آل عمران",
    details: "من الآية 21 إلى الآية 92",
    url: "https://misrquran.gov.eg/recorddetails/c601be3e-2e58-4290-a88e-4035cb0e0937",
  },
  {
    id: "naina-mumtahana-tahrim",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "الممتحنة والتحريم",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/bf7c677f-96c2-4c2d-be1e-783f5c43b1f5",
  },
  {
    id: "naina-tur-rahman",
    reciter: "الشيخ أحمد نعينع",
    title: "مقطع إذاعي من المصحف المرتل",
    surah: "الطور والرحمن",
    details: "من سورة الطور الآية 29 إلى سورة الرحمن الآية 45",
    url: "https://misrquran.gov.eg/recorddetails/efb95c50-d111-4063-8057-48e6e89ba4db",
  },
  {
    id: "mustafa-hujurat-qaf",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة قرآنية من سورتي الحجرات وق",
    surah: "الحجرات وق",
    details: "تلاوة إذاعية مع تعليق للشيخ إسماعيل صادق العدوي",
    url: "https://misrquran.gov.eg/episodedetails/4923968c-66fb-4162-a217-2c9038d85755",
  },
  {
    id: "mustafa-ali-imran-evening",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سورة آل عمران",
    surah: "آل عمران",
    details: "تسجيل من المسجد الأقصى الشريف",
    place: "المسجد الأقصى",
    url: "https://misrquran.gov.eg/episodedetails/56d3e1bb-2478-4f3e-8adb-0ae5cd3cf3d3",
  },
  
  {
    id: "mustafa-ali-imran-balad-shams",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "تلاوة نادرة من آل عمران والبلد والشمس",
    surah: "آل عمران والبلد والشمس",
    details: "من آل عمران الآيات 95 إلى 110، ومعها سورتي البلد والشمس - أرشيف إذاعة القرآن الكريم",
    url: "https://misrquran.gov.eg/episodedetails/511480f7-53be-4390-a00e-b497fcb27e5d",
  },
  {
    id: "mustafa-ibrahim-radio-rare",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "إبراهيم - تسجيل إذاعي آخر",
    surah: "إبراهيم",
    details: "تلاوة أرشيفية مع تعليق الشيخ محمد ابن فتح الله بدران",
    url: "https://misrquran.gov.eg/episodedetails/b15fe3cd-e17e-475d-b4f9-ff53aae85357",
  },
  {
    id: "minshawi-shuara",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الشعراء",
    surah: "الشعراء",
    details: "من الآية 52 حتى الآية 109",
    url: "https://misrquran.gov.eg/episodedetails/c54d54ac-6b7b-4a3a-8cc2-ba43751940c4",
  },
  {
    id: "minshawi-ibrahim",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة إبراهيم",
    surah: "إبراهيم",
    details: "من الآية 23 حتى الآية 52",
    url: "https://misrquran.gov.eg/episodedetails/250011b2-08d9-46af-b91f-3a0005286338",
  },
  {
    id: "minshawi-anam",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "تلاوة نادرة من سورة الأنعام",
    surah: "الأنعام",
    details: "من الآية 73 حتى الآية 103",
    url: "https://misrquran.gov.eg/episodedetails/68393f70-dedc-463c-9d0c-dfcfb2290ba6",
  },
  {
    id: "banna-rad",
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الرعد وقصار السور",
    surah: "الرعد وقصار السور",
    details: "تلاوة إذاعية مع تعليق للدكتور علي عبد اللطيف منصور",
    url: "https://misrquran.gov.eg/episodedetails/6a0fb111-e68e-402d-8134-abeb9d061e0b",
  },
  {
    id: "banna-yusuf",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "يوسف",
    details: "من الآية 53 حتى الآية 111",
    url: "https://misrquran.gov.eg/recorddetails/0b71e37e-7f85-4bce-bbc2-2bbfd76c2a15",
  },
  {
    id: "banna-hud",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "هود",
    details: "من الآية 61 حتى الآية 123",
    url: "https://misrquran.gov.eg/recorddetails/c4bf798a-a2ae-4460-ab30-1d18c03620ce",
  },
  {
    id: "banna-furqan",
    reciter: "الشيخ محمود علي البنا",
    title: "مقطع من المصحف المرتل",
    surah: "الفرقان",
    details: "تسجيل إذاعي برواية حفص",
    url: "https://misrquran.gov.eg/recorddetails/e899f990-bef5-45f4-9be6-ce94a95aac4f",
  },
  
  
  
  
  

  // نوادر زيارة المنشاوي للعراق وبغداد 1965
  {
    id: "minshawi-baghdad-ibrahim",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "إبراهيم من جامع 14 آذار ببغداد",
    surah: "إبراهيم",
    details: "تسجيل من زيارته للعراق سنة 1965",
    place: "بغداد - جامع 14 آذار",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsh_Ibraheem_1965.mp3",
  },
  {
    id: "minshawi-baghdad-shuara",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "الشعراء من تسجيلات بغداد",
    surah: "الشعراء",
    details: "تسجيل من لقاء بغداد سنة 1965",
    place: "بغداد",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsha_Shou3araa-1965-Iraq.mp3",
  },
  {
    id: "minshawi-baghdad-furqan-shuara",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "الفرقان والشعراء من القصر الجمهوري",
    surah: "الفرقان والشعراء",
    details: "من تسجيلات القصر الجمهوري ببغداد سنة 1965",
    place: "القصر الجمهوري - بغداد",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsh_Furqan_Shou3araa-1965-Iraq.mp3",
  },
  {
    id: "minshawi-baghdad-qasas",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "القصص من القصر الجمهوري",
    surah: "القصص",
    details: "من الآية 76 إلى 88 - بغداد 1965",
    place: "القصر الجمهوري - بغداد",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Qassas_76-88%3D%3D22-01-1965-Iraq.mp3",
  },
  {
    id: "minshawi-baghdad-qamar-rahman",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "القمر والرحمن من جلسة عراقية",
    surah: "القمر والرحمن",
    details: "من تسجيلات زيارته للعراق سنة 1965",
    place: "العراق",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsh_Qamar-Rahman.mp3",
  },
  {
    id: "minshawi-baghdad-muminun",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "المؤمنون من القصر الجمهوري",
    surah: "المؤمنون",
    details: "من الآية 1 إلى 29 - بغداد 1965",
    place: "القصر الجمهوري - بغداد",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Moenoon-1-29%3D%3D20-01-1965-Iraq.mp3",
  },
  {
    id: "minshawi-baghdad-naml",
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "النمل من القصر الجمهوري",
    surah: "النمل",
    details: "من الآية 1 إلى 29 - بغداد 1965",
    place: "القصر الجمهوري - بغداد",
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsh_Naml_1-29--Iraq.mp3",
  },
  
  

  // مختارات الشيخ عبد الباسط عبد الصمد
  {
    id: "basit-ibrahim-haram",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "إبراهيم وقصار السور من المسجد الحرام",
    surah: "إبراهيم وقصار السور",
    details: "تسجيل مكة سنة 1951",
    place: "المسجد الحرام - مكة",
    year: "1951",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/1951%20%20%D8%A7%D8%A8%D8%B1%D8%A7%D9%87%D9%8A%D9%85%20%D9%88%D9%82%D8%B5%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B3%D9%88%D8%B1%20%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B1%D8%A7%D9%85.mp3",
  },
  {
    id: "basit-ibrahim-aqsa",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "إبراهيم من المسجد الأقصى",
    surah: "إبراهيم",
    details: "تسجيل من المسجد الأقصى سنة 1965",
    place: "المسجد الأقصى",
    year: "1965",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/%D8%A5%D8%A8%D8%B1%D8%A7%D9%87%D9%8A%D9%85%20-%201965%20-%20%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF%20%D8%A7%D9%84%D8%A3%D9%82%D8%B5%D9%89.mp3",
  },
  {
    id: "basit-ibrahim-iraq",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "إبراهيم مع الأذان من العراق",
    surah: "إبراهيم",
    details: "تسجيل من العراق سنة 1986",
    place: "العراق",
    year: "1986",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/%D8%A5%D8%A8%D8%B1%D8%A7%D9%87%D9%8A%D9%85%20%D9%85%D8%B9%20%D8%A7%D9%84%D8%A2%D8%B0%D8%A7%D9%86%20-%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%201986.mp3",
  },
  {
    id: "basit-imran-baghdad",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "آل عمران من بغداد",
    surah: "آل عمران",
    details: "تسجيل من بغداد سنة 1986",
    place: "بغداد",
    year: "1986",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/%D8%A2%D9%84%20%D8%B9%D9%85%D8%B1%D8%A7%D9%86%20-%20%D8%A8%D8%BA%D8%AF%D8%A7%D8%AF%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%201986.mp3",
  },
  {
    id: "basit-kahf-last",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "آخر ما قرأ من سورة الكهف",
    surah: "الكهف",
    details: "تسجيل نادر من أرشيف التلاوات الخارجية",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/%D8%A7%D8%AE%D8%B1%20%D9%85%D8%A7%20%D9%82%D8%B1%D8%A7%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%A7%D9%84%D9%83%D9%87%D9%81.mp3",
  },
  {
    id: "basit-ahzab-aqsa",
    reciter: "الشيخ عبد الباسط عبد الصمد",
    title: "الأحزاب من المسجد الأقصى",
    surah: "الأحزاب",
    details: "تسجيل من المسجد الأقصى سنة 1964",
    place: "المسجد الأقصى",
    year: "1964",
    url: "https://archive.org/download/AbdelBasit_InPublic_qr/%D8%A7%D9%84%D8%A3%D8%AD%D8%B2%D8%A7%D8%A8%20-%20%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF%20%D8%A7%D9%84%D8%A7%D9%82%D8%B5%D9%89%201964.mp3",
  },
  
  

  // مختارات الشيخ أبي العينين شعيشع
  {
    id: "shisha-ibrahim-1",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "إبراهيم من تسجيلات الإذاعة السعودية",
    surah: "إبراهيم",
    details: "من الآية 1 إلى 20",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/sho3isha3-Ibraheem_1-20_st.mp3",
  },
  {
    id: "shisha-ibrahim-2",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "إبراهيم والنصر",
    surah: "إبراهيم والنصر",
    details: "من الآية 31 إلى آخر السورة مع سورة النصر",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/sho3isha3-Ibraheem_31-End_Nasr_st.mp3",
  },
  {
    id: "shisha-shams-alaq-qadr",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "الشمس والعلق والقدر",
    surah: "الشمس والعلق والقدر",
    details: "تسجيل منقول مباشرة من أسطوانة",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/Sho3ayshe3_Shams_Alaq_Qadr.mp3",
  },
  {
    id: "shisha-baqara",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "ما تيسر من سورة البقرة",
    surah: "البقرة",
    details: "تسجيل إذاعي من أرشيف مزامير",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/baqarh_sh3ish3.mp3",
  },
  {
    id: "shisha-kahf",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "ما تيسر من سورة الكهف",
    surah: "الكهف",
    details: "من تسجيلات الإذاعة السعودية",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/sho3isha3-Kahf-st.mp3",
  },
  {
    id: "shisha-muhammad",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "تلاوة من سورة محمد",
    surah: "محمد",
    details: "من تسجيلات الإذاعة السعودية",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/sho3isha3-Mohammad-st.mp3",
  },
  
  

  // مختارات الشيخ محمد رفعت
  {
    id: "rifaat-01",
    reciter: "الشيخ محمد رفعت",
    title: "الفاتحة وما تيسر من البقرة والنساء",
    surah: "الفاتحة والبقرة والنساء",
    details: "من أرشيف التسجيلات الصوتية المحفوظة",
    url: "https://archive.org/download/M.Refat_01/01a_M.Refat.mp3",
  },
  {
    id: "rifaat-02",
    reciter: "الشيخ محمد رفعت",
    title: "ما تيسر من النساء والأعراف والتوبة",
    surah: "النساء والأعراف والتوبة",
    details: "تسجيل أرشيفي من التراث الصوتي للشيخ",
    url: "https://archive.org/download/M.Refat_01/01b_M.Refat.mp3",
  },
  {
    id: "rifaat-03",
    reciter: "الشيخ محمد رفعت",
    title: "البقرة من الآية 44 إلى 73",
    surah: "البقرة",
    details: "تسجيل أرشيفي",
    url: "https://archive.org/download/M.Refat_01/02a_M.Refat.mp3",
  },
  {
    id: "rifaat-04",
    reciter: "الشيخ محمد رفعت",
    title: "النساء من الآية 58 إلى 79",
    surah: "النساء",
    details: "تسجيل أرشيفي",
    url: "https://archive.org/download/M.Refat_01/02b_M.Refat.mp3",
  },
  {
    id: "rifaat-05",
    reciter: "الشيخ محمد رفعت",
    title: "آل عمران من الآية 6 إلى 20 ومن 28 إلى 32",
    surah: "آل عمران",
    details: "تسجيل أرشيفي",
    url: "https://archive.org/download/M.Refat_01/03a_M.Refat.mp3",
  },
  {
    id: "rifaat-06",
    reciter: "الشيخ محمد رفعت",
    title: "الإسراء من الآية 1 إلى 19",
    surah: "الإسراء",
    details: "تسجيل أرشيفي",
    url: "https://archive.org/download/M.Refat_01/03b_M.Refat.mp3",
  },


  {
    id: "naina-duha-mujawwad",
    reciter: "الشيخ أحمد نعينع",
    title: "سورة الضحى - من المصحف المجوّد",
    surah: "الضحى",
    details: "تلاوة مجوّدة كاملة - المدة 2:02 - مصدر يعرض التسجيل داخل الصفحة",
    url: "https://www.assajda.com/ar/ahmed-nuinaa-75/ad-dhuha-6869",
  },
  {
    id: "naina-hussein-evening",
    reciter: "الشيخ أحمد نعينع",
    title: "تلاوة من أمسية مسجد الإمام الحسين",
    surah: "ما تيسر من القرآن الكريم",
    details: "أمسية إذاعية من مسجد الإمام الحسين بالقاهرة - تسجيل أرشيفي",
    place: "مسجد الإمام الحسين - القاهرة",
    url: "https://misrquran.gov.eg/episodedetails/88cef29a-7539-4a78-8e45-cb3286a74c4e",
  },
  {
    id: "naina-hosary-evening",
    reciter: "الشيخ أحمد نعينع",
    title: "تلاوة من أمسية مسجد الحصري",
    surah: "ما تيسر من القرآن الكريم",
    details: "أمسية دينية إذاعية تضمنت تلاوة للشيخ أحمد نعينع",
    place: "مسجد الحصري - مدينة 6 أكتوبر",
    url: "https://misrquran.gov.eg/episodedetails/80b333d7-91e6-41a7-a8f9-fde5d515badc",
  },

];

function QuranArchivePage() {
  const [query, setQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedReciter, setExpandedReciter] = useState<string | null>(null);
  const [active, setActive] = useState<ArchiveRecording | null>(null);
  const [audioFailed, setAudioFailed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("rahma-noor-archive-favorites");
      return saved ? JSON.parse(saved) as string[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setAudioFailed(false);
  }, [active?.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem("rahma-noor-archive-favorites", JSON.stringify(favorites));
    } catch {
      // Favorites remain available for the current page session if storage is unavailable.
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    );
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar");
    return RECORDINGS.filter((item) => {
      const haystack = [item.reciter, item.title, item.surah, item.details, item.place ?? ""].join(" ").toLocaleLowerCase("ar");
      const matchesQuery = !term || haystack.includes(term);
      const matchesFavoriteFilter = !showFavoritesOnly || favorites.includes(item.id);
      return matchesQuery && matchesFavoriteFilter;
    });
  }, [query, showFavoritesOnly, favorites]);
  const grouped = useMemo(() => {
    const groups = new Map<string, ArchiveRecording[]>();
    for (const item of filtered) {
      const current = groups.get(item.reciter) ?? [];
      current.push(item);
      groups.set(item.reciter, current);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <>
      <PageHeader eyebrow="مختارات صوتية" title="نبرات مميزة">
        مختارات من أصوات كبار القراء… كل قارئ له بصمته التي لا تتكرر.
      </PageHeader>

      <section className="pattern-islamic py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="soft" size="sm" className="gap-2">
              <Link to="/quran/listen"><ArrowRight className="size-4" />العودة للاستماع</Link>
            </Button>
            <span className="rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {filtered.length} تلاوة
            </span>
          </div>

          <div className="mb-6 rounded-3xl border border-gold/30 bg-gradient-to-br from-forest via-primary to-forest p-5 text-primary-foreground sm:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-soft">
              <Sparkles className="size-4" /> مختارات تستحق الاستماع
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">لكل صوت حكاية</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-foreground/80">
              اسمع واكتشف اللون الذي يميز كل قارئ؛ وابحث باسم الشيخ أو السورة للوصول بسرعة.
            </p>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم الشيخ أو السورة..." className="h-11 pr-9" />
            </div>
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((current) => !current)}
              aria-pressed={showFavoritesOnly}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${showFavoritesOnly ? "border-gold bg-gold/15 text-gold" : "border-border bg-card text-muted-foreground hover:border-gold hover:text-gold"}`}
            >
              <Star className={`size-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
              {showFavoritesOnly ? "عرض كل التسجيلات" : `المفضّلة (${favorites.length})`}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map(([reciter, recordings]) => {
              const expanded = expandedReciter === reciter;
              return (
                <section key={reciter} className={expanded ? "sm:col-span-2 lg:col-span-3" : ""}>
                  <button
                    type="button"
                    onClick={() => setExpandedReciter(expanded ? null : reciter)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gold/30 bg-card p-4 text-right shadow-soft transition-colors hover:border-gold hover:bg-gold/5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-primary">
                      <Headphones className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-base font-bold text-foreground">{reciter}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{recordings.length} تسجيلات مختارة</span>
                    </span>
                    {expanded ? <ChevronUp className="size-5 text-gold" /> : <ChevronDown className="size-5 text-gold" />}
                  </button>
                  {expanded && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {recordings.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                          <div className="flex items-start gap-3">
                            <h3 className="min-w-0 flex-1 font-serif text-base font-bold leading-relaxed text-foreground">{item.title}</h3>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(item.id)}
                              aria-label={favorites.includes(item.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                              aria-pressed={favorites.includes(item.id)}
                              title={favorites.includes(item.id) ? "إزالة من المفضلة" : "علّم التسجيل كمفضّل"}
                              className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${favorites.includes(item.id) ? "border-gold bg-gold/15 text-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"}`}
                            >
                              <Star className={`size-5 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                            </button>
                          </div>
                          <p className="mt-2 inline-flex rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">السورة: {item.surah}</p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.details}</p>
                          <Button onClick={() => setActive(item)} variant="gold" className="mt-3 w-full gap-2">
                            <Play className="size-4" />استمع داخل الموقع
                          </Button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {showFavoritesOnly && favorites.length === 0 ? "لسه مفيش تسجيلات في المفضّلة. اضغط على النجمة بجوار أي تسجيل لإضافته." : "مفيش نتائج مطابقة. جرّب اسم قارئ أو سورة تانية."}
            </div>
          )}

          {active && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-2 sm:p-6" role="dialog" aria-modal="true" aria-label="مشغل التلاوة">
              <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-border p-4">
                  <div>
                    <p className="text-xs font-semibold text-gold">{active.reciter}</p>
                    <h2 className="mt-1 font-serif font-bold text-primary">{active.title}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActive(null)}>إغلاق</Button>
                </div>
                <div className="bg-secondary/30 p-2 sm:p-4">
                  {active.url.toLowerCase().includes(".mp3") ? (
                    <div className="rounded-xl border border-border bg-background p-4">
                      <audio
                        key={active.id}
                        controls
                        preload="none"
                        src={active.url}
                        className="w-full"
                        aria-label={`تشغيل ${active.title}`}
                        onError={() => setAudioFailed(true)}
                      />
                      {audioFailed && (
                        <div className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm leading-6 text-foreground">
                          تعذر تشغيل الملف داخل الصفحة. جرّب فتح التسجيل مباشرة من المصدر.
                          <a href={active.url} target="_blank" rel="noreferrer" className="mr-1 font-semibold text-primary underline underline-offset-4">فتح التسجيل</a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <iframe
                      key={active.id}
                      src={active.url}
                      title={active.title}
                      className="h-[65vh] min-h-[360px] w-full rounded-xl border border-border bg-background"
                      allow="autoplay; encrypted-media"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  )}
                </div>
                <p className="px-4 pb-4 text-xs leading-6 text-muted-foreground">
                  مصدر التسجيل يظهر داخل المشغل؛ وقد يتوقف تشغيل بعض المصادر مؤقتًا إذا كانت الخدمة الأصلية غير متاحة.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
