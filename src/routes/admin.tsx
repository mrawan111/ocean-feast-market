import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Package, Layers, Settings, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAdminAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم | أبو ناجي" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isAdmin, userId } = useAdminAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (path === "/admin/login") return;
    if (!userId) nav({ to: "/admin/login" });
    else if (isAdmin && (path === "/admin" || path === "/admin/")) nav({ to: "/admin/products" });
  }, [loading, userId, isAdmin, path, nav]);

  if (path === "/admin/login") return <Outlet />;

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">…</div>;
  if (!userId) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold">غير مصرح</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            تم تسجيل الدخول لكن الحساب ليس أدمن. شغّل هذا الأمر مرة واحدة في Supabase مع معرّف المستخدم:
            <span className="font-mono text-gold"> {userId}</span>
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-card p-4 text-start text-xs" dir="ltr">{`INSERT INTO public.user_roles (user_id, role)\nVALUES ('${userId}', 'admin');`}</pre>
          <button onClick={() => supabase.auth.signOut()} className="mt-4 text-sm text-gold hover:underline">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  const items = [
    { to: "/admin/products", label: "المنتجات", icon: Package },
    { to: "/admin/categories", label: "الأقسام", icon: Layers },
    { to: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="border-s border-border bg-sidebar p-4">
          <div className="mb-6 px-2 text-lg font-bold text-gold-gradient">لوحة أبو ناجي</div>
          <nav className="space-y-1">
            {items.map((i) => {
              const active = path.startsWith(i.to);
              return (
                <Link key={i.to} to={i.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "bg-gold text-gold-foreground" : "hover:bg-surface"}`}>
                  <i.icon className="h-4 w-4"/> {i.label}
                </Link>
              );
            })}
            <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/admin/login" }); }}
              className="mt-6 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-surface">
              <LogOut className="h-4 w-4"/> تسجيل الخروج
            </button>
          </nav>
        </aside>
        <main className="p-6">
          <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-semibold text-gold">
            هذه الصفحة مخصصة للادمن
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
