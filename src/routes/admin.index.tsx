import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [orders, products, pending] = await Promise.all([
        supabase.from("orders").select("id, total, status, created_at").order("created_at", { ascending: false }),
        supabase.from("products").select("id"),
        supabase.from("orders").select("id").eq("status", "pending"),
      ]);
      const rows = orders.data ?? [];
      const revenue = rows.filter(r => r.status !== "cancelled").reduce((s, r) => s + Number(r.total), 0);
      return {
        totalOrders: rows.length,
        pendingOrders: pending.data?.length ?? 0,
        totalProducts: products.data?.length ?? 0,
        revenue,
        recent: rows.slice(0, 8),
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Orders", data?.totalOrders ?? 0],
          ["Pending", data?.pendingOrders ?? 0],
          ["Products", data?.totalProducts ?? 0],
          ["Revenue (EGP)", data?.revenue.toLocaleString() ?? 0],
        ].map(([label, val]) => (
          <div key={label as string} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs uppercase text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gold">{val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
        <div className="space-y-2 text-sm">
          {data?.recent.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
              <span className="font-mono text-xs">{o.id.slice(0, 8)}</span>
              <span className="uppercase text-xs">{o.status}</span>
              <span className="font-bold text-gold">{Number(o.total).toLocaleString()} EGP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}