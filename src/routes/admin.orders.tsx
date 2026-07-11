import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const STATUSES = ["pending", "preparing", "out_for_delivery", "completed", "cancelled"] as const;

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

function AdminOrders() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  async function setStatus(id: string, status: typeof STATUSES[number]) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    toast.success("Updated");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      {data.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
              <h3 className="text-lg font-bold">{o.customer_name}</h3>
              <p className="text-sm">{o.phone} · {o.address}</p>
              {o.notes && <p className="mt-1 text-xs text-muted-foreground italic">"{o.notes}"</p>}
              <p className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <div className="text-end">
              <p className="text-xl font-bold text-gold">{Number(o.total).toLocaleString()} EGP</p>
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as typeof STATUSES[number])}
                className="mt-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            {(o.order_items ?? []).map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>{i.name_snapshot} × {i.quantity}{i.weight_kg ? ` (${i.weight_kg}kg)` : ""} {i.cooking_method ? `· ${i.cooking_method}` : ""}</span>
                <span className="text-muted-foreground">{Number(i.line_total).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!data.length && <p className="text-muted-foreground">No orders yet.</p>}
    </div>
  );
}