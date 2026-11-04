export interface Ayah {
  number: number;
  text: string;
  cleanText: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

const memoryCache = new Map<number, SurahDetail>();

const BASMALA_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

function cleanAyahText(
  rawText: string,
  surahNumber: number,
  ayahNumberInSurah: number,
): { text: string; cleanText: string } {
  // Strip BOM or zero-width chars if present
  const text = rawText.replace(/^[\uFEFF\u200B]+/, "").trim();

  // For Surahs 2-114 (except At-Tawbah 9), Ayah 1 in the Uthmani edition begins with the Basmala string.
  // We keep the original text, but also provide cleanText without the Basmala for when the decorative Basmala banner is shown.
  let cleanText = text;
  if (surahNumber !== 1 && ayahNumberInSurah === 1 && surahNumber !== 9) {
    if (text.startsWith(BASMALA_TEXT)) {
      cleanText = text.slice(BASMALA_TEXT.length).trim();
    }
  }

  return { text, cleanText };
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`رقم السورة غير صالح: ${surahNumber}. يجب أن يكون بين 1 و 114.`);
  }

  // 1. Check in-memory cache
  if (memoryCache.has(surahNumber)) {
    return memoryCache.get(surahNumber)!;
  }

  // 2. Check localStorage cache if in browser
  const storageKey = `quran_uthmani_v1_surah_${surahNumber}`;
  if (typeof window !== "undefined") {
    try {
      const cachedJson = localStorage.getItem(storageKey);
      if (cachedJson) {
        const parsed = JSON.parse(cachedJson) as SurahDetail;
        if (parsed && Array.isArray(parsed.ayahs) && parsed.ayahs.length > 0) {
          memoryCache.set(surahNumber, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage errors (private browsing / quota)
    }
  }

  // 3. Fetch from verified source: Al-Quran Cloud (Tanzil Uthmani Edition)
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "خطأ غير متوقع في الشبكة";
    throw new Error(
      `تعذر الاتصال بمصدر المصحف الكريم الموثّق (${errorMsg}). يرجى التحقق من اتصال الإنترنت.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `تعذر تحميل السورة رقم ${surahNumber} من الخادم الموثق (رمز الحالة: ${response.status}).`,
    );
  }

  const json = await response.json();
  if (json.code !== 200 || !json.data || !json.data[0] || !Array.isArray(json.data[0].ayahs)) {
    throw new Error(`استجابة غير صالحة من المصدر الموثق للسورة رقم ${surahNumber}.`);
  }

  const rawData = json.data[0];
  const processedAyahs: Ayah[] = rawData.ayahs.map(
    (rawAyah: {
      number: number;
      text: string;
      numberInSurah: number;
      juz: number;
      manzil: number;
      page: number;
      ruku: number;
      hizbQuarter: number;
      sajda: boolean | object;
    }) => {
      const { text, cleanText } = cleanAyahText(rawAyah.text, surahNumber, rawAyah.numberInSurah);
      return {
        number: rawAyah.number,
        text,
        cleanText,
        numberInSurah: rawAyah.numberInSurah,
        juz: rawAyah.juz,
        manzil: rawAyah.manzil,
        page: rawAyah.page,
        ruku: rawAyah.ruku,
        hizbQuarter: rawAyah.hizbQuarter,
        sajda: rawAyah.sajda,
      };
    },
  );

  const detail: SurahDetail = {
    number: rawData.number,
    name: rawData.name,
    englishName: rawData.englishName,
    englishNameTranslation: rawData.englishNameTranslation,
    revelationType: rawData.revelationType,
    numberOfAyahs: rawData.numberOfAyahs,
    ayahs: processedAyahs,
  };

  // Cache in memory
  memoryCache.set(surahNumber, detail);

  // Cache in localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, JSON.stringify(detail));
    } catch {
      // Ignore quota exceeded
    }
  }

  return detail;
}
