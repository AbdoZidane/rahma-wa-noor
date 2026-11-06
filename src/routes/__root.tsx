import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VisitorTracker } from "@/components/site/VisitorTracker";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold">٤٠٤</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">تعذّر تحميل الصفحة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ غير متوقع. يمكنك إعادة المحاولة أو العودة للرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#13301f" },
      { title: "رحمة ونور | ذكرى عبدالرازق محمود زيدان" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow, max-image-preview:large" },
      {
        name: "keywords",
        content: "رحمة ونور، عبدالرازق محمود زيدان، دعاء للمتوفى، القرآن الكريم، أذكار الصباح والمساء، صدقة جارية",
      },
      {
        name: "description",
        content:
          "موقع تذكاري لعبدالرازق محمود زيدان: أدعية للمتوفى، أذكار الصباح والمساء، آيات من القرآن الكريم، ومسبحة إلكترونية.",
      },
      { property: "og:site_name", content: "رحمة ونور" },
      { property: "og:locale", content: "ar_AR" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rahma-wa-noor.abaozidan.workers.dev/" },
      {
        property: "og:image",
        content: "https://rahma-wa-noor.abaozidan.workers.dev/grandfather.jpeg",
      },
      { property: "og:image:alt", content: "صورة الجد عبدالرازق محمود زيدان" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "رحمة ونور | ذكرى عبدالرازق محمود زيدان" },
      {
        name: "twitter:description",
        content: "موقع تذكاري وصدقة جارية: القرآن الكريم والأذكار والأدعية والمسبحة الإلكترونية.",
      },
      {
        name: "twitter:image",
        content: "https://rahma-wa-noor.abaozidan.workers.dev/grandfather.jpeg",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Amiri+Quran&family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);
  const [rainMuted, setRainMuted] = useState(false);
  const rainMutedRef = useRef(rainMuted);
  const rainHasInteractedRef = useRef(false);
  const quranIsPlayingRef = useRef(false);
  rainMutedRef.current = rainMuted;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    }
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  useEffect(() => {
    const rainAudio = rainAudioRef.current;
    if (!rainAudio) return;
    rainAudio.volume = 0.02;

    const syncRain = () => {
      if (!rainHasInteractedRef.current) return;
      if (quranIsPlayingRef.current || rainMutedRef.current) {
        rainAudio.pause();
      } else if (rainAudio.paused) {
        void rainAudio.play().catch((error) => {
          console.warn("Rain ambience could not start:", error);
        });
      }
    };
    const onFirstInteraction = () => {
      rainHasInteractedRef.current = true;
      syncRain();
    };
    const onQuranPlaybackChange = (event: Event) => {
      const playbackEvent = event as CustomEvent<{ playing: boolean }>;
      quranIsPlayingRef.current = Boolean(playbackEvent.detail?.playing);
      syncRain();
    };
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);
    window.addEventListener("quran-playback-change", onQuranPlaybackChange);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("quran-playback-change", onQuranPlaybackChange);
      rainAudio.pause();
    };
  }, []);

  // Apply mute/unmute immediately without resetting the first-interaction or Quran state.
  useEffect(() => {
    const rainAudio = rainAudioRef.current;
    if (!rainAudio || !rainHasInteractedRef.current) return;

    if (rainMuted || quranIsPlayingRef.current) {
      rainAudio.pause();
    } else {
      void rainAudio.play().catch((error) => {
        console.warn("Rain ambience could not start:", error);
      });
    }
  }, [rainMuted]);

  return (
    <QueryClientProvider client={queryClient}>
      <VisitorTracker />
      <audio
        ref={rainAudioRef}
        src="https://sfxmint.com/dl/ambience-rain-62.mp3"
        loop
        preload="auto"
        aria-hidden="true"
        onEnded={(event) => {
          const audio = event.currentTarget;
          if (rainHasInteractedRef.current && !rainMutedRef.current && !quranIsPlayingRef.current) {
            audio.currentTime = 0;
            void audio.play().catch((error) => {
              console.warn("Rain ambience could not restart:", error);
            });
          }
        }}
      />
      <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
        <SiteHeader rainMuted={rainMuted} onToggleRain={() => setRainMuted((muted) => !muted)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" dir="rtl" />
    </QueryClientProvider>
  );
}
