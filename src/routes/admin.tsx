import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Eye, LogOut, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type DailyStat = { date: string; visitors: number; page_views: number };
type VisitorStats = {
  total_page_views: number;
  total_visitors: number;
  today_visitors: number;
  daily: DailyStat[];
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | رحمة ونور" },
      { name: "description", content: "إحصائيات زوار موقع رحمة ونور." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!active) return;

      if (userError || !userData.user) {
        setMessage("سجّل الدخول بحساب الإدارة أولًا.");
        setLoading(false);
        return;
      }

      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });

      if (!active) return;
      if (roleError || !isAdmin) {
        setMessage("هذا الحساب ليس لديه صلاحية إدارة الموقع.");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      const { data, error } = await supabase.rpc("get_admin_visitor_stats");
      if (!active) return;
      if (error) {
        setMessage("لم يتم إعداد قاعدة إحصائيات الزوار بعد. يلزم تنفيذ ملف إعداد الإحصائيات في Supabase.");
      } else {
        setStats(data as unknown as VisitorStats);
      }
      setLoading(false);
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/auth" });
  };

  const maxVisitors = Math.max(1, ...(stats?.daily.map((day) => day.visitors) ?? []));

  return (
    <main className="min-h-[70vh] bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gold">رحمة ونور</p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-foreground">لوحة الإدارة</h1>
            <p className="mt-2 text-sm text-muted-foreground">إحصائيات الزيارات — خاصة بإدارة الموقع</p>
          </div>
          {authorized && (
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="size-4" /> تسجيل الخروج
            </Button>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">جارٍ تحميل لوحة الإدارة...</div>
        ) : !authorized ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-gold" />
            <p className="mt-4 text-foreground">{message}</p>
            <Button asChild className="mt-5">
              <Link to="/auth">الذهاب لتسجيل الدخول</Link>
            </Button>
          </div>
        ) : !stats ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-foreground">
            {message || "تعذر تحميل الإحصائيات."}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={<Users className="size-5" />} label="إجمالي الزوار" value={stats.total_visitors} />
              <StatCard icon={<CalendarDays className="size-5" />} label="زوار اليوم" value={stats.today_visitors} />
              <StatCard icon={<Eye className="size-5" />} label="إجمالي مشاهدات الصفحات" value={stats.total_page_views} />
            </div>

            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold text-foreground">آخر 7 أيام</h2>
              <div className="mt-6 space-y-4">
                {stats.daily.map((day) => (
                  <div key={day.date} className="grid grid-cols-[92px_1fr_42px] items-center gap-3 text-sm">
                    <span className="text-muted-foreground" dir="ltr">{day.date.slice(5)}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${(day.visitors / maxVisitors) * 100}%` }}
                      />
                    </div>
                    <strong className="text-foreground">{day.visitors}</strong>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">الأرقام تمثل زوارًا مميزين حسب متصفحهم، ومشاهدات الصفحات تُحسب بشكل منفصل.</p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-gold">{icon}<span className="text-sm text-muted-foreground">{label}</span></div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value.toLocaleString("ar-EG")}</p>
    </div>
  );
}
