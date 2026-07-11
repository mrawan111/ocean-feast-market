import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, Layers, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAdminAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Abu Naji" }] }),
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
  }, [loading, userId, path, nav]);

  if (path === "/admin/login") return <Outlet />;

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">…</div>;
  if (!userId) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your user is signed in but not an admin. Run this SQL in Supabase (once) with your user ID
            <span className="font-mono text-gold"> {userId}</span>:
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-card p-4 text-start text-xs">{`INSERT INTO public.user_roles (user_id, role)\nVALUES ('${userId}', 'admin');`}</pre>
          <button onClick={() => supabase.auth.signOut()} className="mt-4 text-sm text-gold hover:underline">Sign out</button>
        </div>
      </div>
    );
  }

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Layers },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background" dir="ltr">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="border-e border-border bg-sidebar p-4">
          <div className="mb-6 px-2 text-lg font-bold text-gold-gradient">Abu Naji Admin</div>
          <nav className="space-y-1">
            {items.map((i) => {
              const active = i.exact ? path === i.to : path.startsWith(i.to);
              return (
                <Link key={i.to} to={i.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? "bg-gold text-gold-foreground" : "hover:bg-surface"}`}>
                  <i.icon className="h-4 w-4"/> {i.label}
                </Link>
              );
            })}
            <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/admin/login" }); }}
              className="mt-6 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-surface">
              <LogOut className="h-4 w-4"/> Logout
            </button>
          </nav>
        </aside>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}