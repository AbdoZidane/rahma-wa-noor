import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "دخول الإدارة | رحمة ونور" },
      { name: "description", content: "بوابة إدارة الموقع التذكاري." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("بيانات الدخول غير صحيحة أو غير مفعلة حالياً");
      } else {
        toast.success("تم تسجيل الدخول بنجاح");\n        await navigate({ to: "/admin" });
      }
    } catch {
      toast.error("تعذر تسجيل الدخول حالياً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="لوحة التحكم" title="دخول الإدارة">
        خاص بالقائمين على إدارة محتوى الموقع التذكاري
      </PageHeader>
      <section className="pattern-islamic py-16">
        <div className="mx-auto max-w-md px-5">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <div className="mb-6 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-forest text-gold">
                <Lock className="size-6" />
              </span>
            </div>
            <h2 className="text-center font-serif text-2xl font-bold text-primary">تسجيل الدخول</h2>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              يرجى إدخال البريد الإلكتروني وكلمة المرور
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                disabled={loading}
                className="w-full font-semibold"
              >
                {loading ? "جارٍ التحقق..." : "دخول"}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground"
              >
                <Link to="/">
                  <ArrowRight className="size-3.5" />
                  العودة للصفحة الرئيسية
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
