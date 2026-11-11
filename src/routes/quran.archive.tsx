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
  audio?: boolean;
  featured?: boolean;
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
    id: "mustafa-yusuf-sidi-gaber",
    featured: true,
    reciter: "الشيخ مصطفى إسماعيل",
    title: "يوسف والحاقة من سيدي جابر بالإسكندرية",
    surah: "يوسف والحاقة",
    details: "محفل سيدي جابر بالإسكندرية سنة 1958 - تلاوة كاملة",
    place: "سيدي جابر - الإسكندرية",
    year: "1958",
    url: "https://www.youtube.com/embed/ANsIwz6Z_VQ?start=2225",
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
    id: "mustafa-qamar-rahman",
    surah: "القمر والرحمن والبلد والشمس",
    reciter: "الشيخ مصطفى إسماعيل",
    title: "سهرة قرآنية من سور متعددة",
    details: "سهرة قرآنية من أرشيف إذاعة القرآن الكريم",
    url: "https://misrquran.gov.eg/episodedetails/f8ead001-050c-4d2c-aefb-16df20b85120",
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
    featured: true,
    reciter: "الشيخ محمود علي البنا",
    title: "تلاوة قرآنية من سورة الرعد وقصار السور",
    surah: "الرعد وقصار السور",
    details: "تلاوة إذاعية مع تعليق للدكتور علي عبد اللطيف منصور",
    url: "https://misrquran.gov.eg/episodedetails/6a0fb111-e68e-402d-8134-abeb9d061e0b",
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
    url: "https://www.mazameer.com/upload/sounds/mensh/Live/Iraq/Minsha_Shou3ara.mp3",
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
    reciter: "الشيخ أبو العينين شعيشع",
    title: "إبراهيم من تسجيلات الإذاعة السعودية",
    surah: "إبراهيم",
    details: "من الآية 1 إلى 20",
    url: "https://www.mazameer.com/upload/sounds/sho3esh3/st/sho3isha3-Ibraheem_1-20_st.mp3",
  },
  {
    id: "shisha-ibrahim-2",
    reciter: "الشيخ أبو العينين شعيشع",
    title: "إبراهيم والحاقة – المسجد الحسيني",
    surah: "إبراهيم والحاقة",
    details: "تسجيل من المسجد الحسيني سنة 1957 - نسخة معدلة لتحسين وضوح الصوت",
    url: "https://www.youtube.com/embed/kAYyyBE5Xw0",
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
    id: "naina-kahf-sahib-nahawand",
    featured: true,
    reciter: "الشيخ أحمد نعينع",
    title: "قال له صاحبه وهو يحاوره – تلاوة كاملة",
    surah: "الكهف",
    details: "من التلاوة الكاملة للشيخ أحمد نعينع - يبدأ المشغّل عند الآية المطلوبة (حوالي 45:00)",
    url: "https://www.youtube.com/embed/uuFhPj3RbAY?start=2700",
  },

  {
    id: "naina-tur-verse-tilawah",
    featured: true,
    reciter: "الشيخ أحمد نعينع",
    title: "وناديناه من جانب الطور الأيمن",
    surah: "مريم",
    details: "تلاوة نادرة - نسخة صوتية مباشرة - 5:16",
    url: "https://tilawah.net/audios/ahmd-ahmd-naaynaa-ondynh-mn-ganb-ltor-laymn-okrbnh-ngya-42147/download?original=1",
    audio: true,
  },
  {
    id: "minshawi-ghafir-tilawah",
    featured: true,
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "يا قوم إنما هذه الحياة الدنيا متاع",
    surah: "غافر",
    details: "تلاوة نادرة - نسخة صوتية مباشرة - 11:38",
    url: "https://tilawah.net/audios/mhmd-sdyk-almnshaoy-ya-kom-anma-hthh-alhya-aldnya-mtaaa-oan-alakhr-hy-dar-alkra-42123/download?original=1",
    audio: true,
  },
  {
    id: "minshawi-zukhruf-hamim-kitab",
    featured: true,
    reciter: "الشيخ محمد صديق المنشاوي",
    title: "الزخرف والدخان والقدر – تسجيل مسجد الحسين 1961",
    surah: "الزخرف",
    details: "تسجيل نادر بنسخة أصلية من مسجد الحسين بمصر سنة 1961، ويضم سور الزخرف والدخان والقدر",
    url: "https://archive.org/download/minshawymahfalyaorignal/253--%D9%84%D8%A3%D9%88%D9%84%20%D9%85%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B2%D8%AE%D8%B1%D9%81%20%D9%88%D8%A7%D9%84%D8%AF%D8%AE%D8%A7%D9%86%20%D9%88%D8%A7%D9%84%D9%82%D8%AF%D8%B1%20%D9%85%D8%B3%D8%AC%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B3%D9%8A%D9%86%20%D8%B9%D8%A7%D9%85%201961%D9%85%20%D9%86%D8%B3%D8%AE%D8%A9%20%D8%A3%D8%B5%D9%84%D9%8A%D8%A9.mp3",
    audio: true,
  },
  {
    id: "mustafa-ibrahim-bushra-tilawah",
    featured: true,
    reciter: "الشيخ مصطفى إسماعيل",
    title: "ولقد جاءت رسلنا إبراهيم بالبشرى",
    surah: "هود",
    details: "من المقاطع النادرة المميزة - نسخة أصلية - 7:22",
    url: "https://tilawah.net/audios/mstf-asmaaayl-olkd-gaaat-rslna-abrahym-balbshr-42146/download?original=1",
    audio: true,
  },
  {
    id: "banna-imran-185-200-tilawah",
    reciter: "الشيخ محمود علي البنا",
    title: "خواتيم آل عمران – الآيات 185 إلى 200",
    surah: "آل عمران",
    details: "مصنفة كتلاوة نادرة - نسخة أصلية - 23:08",
    url: "https://tilawah.net/audios/mhmod-aaly-albna-al-aamran-185-200-10761/download?original=1",
    audio: true,
  },
  {
    id: "bahtimi-musa-tilawah",
    featured: true,
    reciter: "الشيخ كامل يوسف البهتيمي",
    title: "وما تلك بيمينك يا موسى",
    surah: "طه",
    details: "من أشهر مقاطعه النادرة - نسخة أصلية - 3:53",
    url: "https://tilawah.net/audios/kaml-yosf-albhtymy-oma-tlk-bymynk-ya-mos-42134/download?original=1",
    audio: true,
  },
  {
    id: "shisha-kahf-tilawah",
    featured: true,
    reciter: "الشيخ أبو العينين شعيشع",
    title: "الكهف 75–86 – التلاوة المشهورة الإعجازية",
    surah: "الكهف",
    details: "تلاوة نادرة - نسخة أصلية - 13:54",
    url: "https://tilawah.net/audios/abo-alaaynyn-shaayshaa-alkhf-75-86-altlao-almshhor-alaaagazy-6583/download?original=1",
    audio: true,
  },
  {
    id: "rifaat-noor-tilawah",
    featured: true,
    reciter: "الشيخ محمد رفعت",
    title: "الله نور السماوات والأرض",
    surah: "النور",
    details: "تلاوة نادرة - نسخة أصلية - 5:50",
    url: "https://tilawah.net/audios/mhmd-rfaat-allh-nor-alsmoat-oalard-42132/download?original=1",
    audio: true,
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


  // مختارات الشيخ محمد أحمد شبيب
  {
    id: "shebib-naml-kitab-karim",
    featured: true,
    reciter: "الشيخ محمد أحمد شبيب",
    title: "يا أيها الملأ إني أُلقي إلي كتاب كريم",
    surah: "النمل",
    details: "المقطع الذي رشحته — تلاوة خاشعة من سورة النمل",
    url: "https://www.youtube.com/embed/zMU85m2B6Hs",
  },
  {
    id: "shebib-fajr-october-1973",
    featured: true,
    reciter: "الشيخ محمد أحمد شبيب",
    title: "قرآن الفجر — فجر النصر 6 أكتوبر 1973",
    surah: "آل عمران",
    details: "التلاوة التاريخية من فجر العاشر من رمضان 1393هـ، من مسجد الإمام الحسين",
    place: "مسجد الإمام الحسين — القاهرة",
    year: "1973",
    url: "https://www.youtube.com/embed/yGdVH6NvPIg",
  },
  {
    id: "shebib-yusuf-kafr-bahida-1983",
    featured: true,
    reciter: "الشيخ محمد أحمد شبيب",
    title: "سورة يوسف — أمسية كفر بهيدة",
    surah: "يوسف",
    details: "تلاوة نادرة من تسجيلات قرية كفر بهيدة — ميت غمر",
    place: "كفر بهيدة — ميت غمر",
    year: "1983",
    url: "https://www.youtube.com/embed/2EfPyGMbvP4",
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
    return Array.from(groups.entries())
      .map(([reciter, items]) => [
        reciter,
        [...items].sort((a, b) => {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.surah.localeCompare(b.surah, "ar") || a.title.localeCompare(b.title, "ar");
        }),
      ] as [string, ArchiveRecording[]])
      .sort(([a], [b]) => a.localeCompare(b, "ar"));
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

          <div className="mx-auto mb-5 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
          <article className="flex min-w-0 items-center gap-2 rounded-2xl border border-gold/40 bg-card/90 p-2 shadow-soft">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Play className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-gold">تلاوة مختارة من تراث الكبار</p>
              <h2 className="mt-0.5 line-clamp-2 font-serif text-sm font-bold leading-6 text-foreground">فدعا ربه أنى مغلوب فانتصر</h2>
              <p className="text-xs text-muted-foreground">الشيخ محمد رفعت · تراث الشيخ محمد رفعت</p>
            </div>
            <Button
              size="sm"
              variant="gold"
              className="shrink-0 gap-1.5 px-3"
              onClick={() => setActive({
                id: "rifaat-maghloob-fantasir",
                reciter: "الشيخ محمد رفعت",
                title: "فدعا ربه أنى مغلوب فانتصر",
                surah: "القمر",
                details: "من قناة تراث الشيخ محمد رفعت",
                url: "https://www.youtube.com/embed/guSQ5lPOHN8",
              })}
            >
              <Play className="size-3.5" />استمع
            </Button>
          </article>

          <article className="flex min-w-0 items-center gap-2 rounded-2xl border border-gold/40 bg-card/90 p-2 shadow-soft">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Play className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-gold">مختارات بمقام النهاوند</p>
              <h2 className="mt-0.5 line-clamp-2 font-serif text-sm font-bold leading-6 text-foreground">تلاوات بمقام النهاوند 🔥 كأن الجمال بلغ منتهاه</h2>
              <p className="text-xs text-muted-foreground">مختارات قرآنية بمقام النهاوند</p>
            </div>
            <Button
              size="sm"
              variant="gold"
              className="shrink-0 gap-1 px-2"
              onClick={() => setActive({
                id: "nawand-beautiful-recitations",
                reciter: "مختارات بمقام النهاوند",
                title: "تلاوات بمقام النهاوند 🔥 كأن الجمال بلغ منتهاه",
                surah: "مختارات قرآنية",
                details: "تلاوات بمقام النهاوند",
                url: "https://www.youtube.com/embed/z0RSRbdT2jY",
              })}
            >
              <Play className="size-3.5" />استمع
            </Button>
          </article>
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
              const expanded = showFavoritesOnly || expandedReciter === reciter;
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
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{recordings.length} تسجيلات</span>
                      </span>
                    </span>
                    {expanded ? <ChevronUp className="size-5 text-gold" /> : <ChevronDown className="size-5 text-gold" />}
                  </button>
                  {expanded && (
                    <div className="mt-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                      {recordings.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                          <div className="flex items-start gap-3">
                            <h3 className="flex min-w-0 flex-1 items-start gap-2 font-serif text-base font-bold leading-relaxed text-foreground"><span>{item.title}</span>{item.featured && <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold/50 bg-gold/20 px-2.5 py-1.5 text-xs font-sans font-extrabold text-gold shadow-sm" title="تسجيل مميز مختار">⭐ نادرة مميزة</span>}</h3>
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
                  {active.audio || active.url.toLowerCase().includes(".mp3") ? (
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
