import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"] || "https://placeholder-project.supabase.co";
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || "placeholder-publishable-key";
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type SiteContent = {
  biography: string;
  portraitPath: string | null;
  memories: { id: string; title: string | null; body: string; author: string | null }[];
};

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_PUBLISHABLE_KEY"]) {
      return {
        biography:
          "عبدالرازق محمود زيدان — رحمه الله وأسكنه فسيح جناته، وجعل ما قدّم في ميزان حسناته.",
        portraitPath: null,
        memories: [],
      };
    }
    try {
      const sb = publicClient();
      const [{ data: settings }, { data: memories }] = await Promise.all([
        sb.from("site_settings").select("biography, portrait_url").eq("id", 1).maybeSingle(),
        sb
          .from("memories")
          .select("id, title, body, author")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      let portraitPath: string | null = null;
      if (settings?.portrait_url) {
        const { data } = await sb.storage
          .from("portraits")
          .createSignedUrl(settings.portrait_url, 60 * 60 * 24);
        if (data?.signedUrl) {
          const idx = data.signedUrl.indexOf("/storage/v1/");
          portraitPath = idx >= 0 ? data.signedUrl.slice(idx) : null;
        }
      }

      return {
        biography: settings?.biography ?? "",
        portraitPath,
        memories: memories ?? [],
      };
    } catch (err) {
      console.warn("getSiteContent error fallback:", err);
      return {
        biography: "عبدالرازق محمود زيدان — رحمه الله وأسكنه فسيح جناته.",
        portraitPath: null,
        memories: [],
      };
    }
  },
);

export type PublicPrayer = {
  id: string;
  author_name: string | null;
  message: string;
  created_at: string;
};

export const getApprovedPrayers = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPrayer[]> => {
    if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_PUBLISHABLE_KEY"]) {
      return [
        {
          id: "1",
          author_name: "محب للخير",
          message:
            "اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله ووسّع مدخله، واغسله بالماء والثلج والبرد.",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          author_name: "زائر",
          message: "اللهم اجعل قبره روضة من رياض الجنة ولا تجعله حفرة من حفر النار.",
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          author_name: "العائلة",
          message: "نسأل الله العظيم رب العرش العظيم أن يجمعنا به في الفردوس الأعلى من الجنة.",
          created_at: new Date().toISOString(),
        },
      ];
    }
    try {
      const sb = publicClient();
      const { data, error } = await sb
        .from("prayers")
        .select("id, author_name, message, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) {
        console.error("getApprovedPrayers", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.warn("getApprovedPrayers error fallback:", err);
      return [];
    }
  },
);

const submitSchema = z.object({
  name: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(5).max(1000),
  website: z.string().max(200).optional().default(""), // honeypot
  elapsedMs: z.number().int().nonnegative(),
});

export type SubmitResult = { ok: true } | { ok: false; error: string };

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitPrayer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    // Bots: hidden field filled, or form submitted unrealistically fast.
    if (data.website.length > 0 || data.elapsedMs < 3000) {
      return { ok: true }; // silently drop
    }
    const text = `${data.name} ${data.message}`;
    if (/(https?:\/\/|www\.|\.com\b|\.net\b|<[^>]+>)/i.test(text)) {
      return { ok: false, error: "يُرجى عدم إضافة روابط أو رموز برمجية في الرسالة." };
    }
    if (/(.)\1{9,}/.test(data.message)) {
      return { ok: false, error: "يبدو أن الرسالة غير صالحة، يُرجى مراجعتها." };
    }

    const ip =
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    // Only a one-way hash of the address is kept, briefly, for rate limiting.
    const ipHash = await sha256(`rahma-nour:${ip}`);

    if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      return { ok: true };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      await supabaseAdmin.from("submission_log").delete().lt("created_at", dayAgo);

      const { count } = await supabaseAdmin
        .from("submission_log")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", hourAgo);
      if ((count ?? 0) >= 3) {
        return {
          ok: false,
          error: "شكرًا لك، لقد أرسلت عدة أدعية مؤخرًا. يُرجى المحاولة بعد قليل.",
        };
      }

      const { error } = await supabaseAdmin.from("prayers").insert({
        author_name: data.name || null,
        message: data.message,
      });
      if (error) {
        console.error("submitPrayer", error.message);
        return { ok: false, error: "تعذّر إرسال الدعاء الآن، يُرجى المحاولة لاحقًا." };
      }
      await supabaseAdmin.from("submission_log").insert({ ip_hash: ipHash });
      return { ok: true };
    } catch (err) {
      console.warn("submitPrayer error fallback:", err);
      return { ok: true };
    }
  });
