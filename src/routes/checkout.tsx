import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n";
import { useCart, calcLineTotal, formatMoney } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  head: () => ({ meta: [{ title: "Checkout | Abu Naji Seafood" }] }),
  component: Checkout,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

const schema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(500).optional(),
});

function Checkout() {
  const { t } = useI18n();
  const { items, subtotal, clear } = useCart();
  const { data: s } = useSuspenseQuery(settingsQuery);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "", notes: "" });
  const cur = t("currency");
  const deliveryFee = Number(s?.delivery_fee ?? 0);
  const total = subtotal + deliveryFee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    if (!items.length) { toast.error(t("cart_empty")); return; }
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        customer_name: parsed.data.customer_name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        notes: parsed.data.notes ?? null,
        subtotal, delivery_fee: deliveryFee, total,
      }).select("id").single();
      if (error) throw error;
      const lineItems = items.map((i) => ({
        order_id: order.id, product_id: i.productId,
        name_snapshot: `${i.nameAr} / ${i.nameEn}`,
        quantity: i.quantity, weight_kg: i.weightKg,
        cooking_method: i.cookingMethod, extras: i.extras,
        unit_price: i.unitPrice, line_total: calcLineTotal(i),
      }));
      const { error: iErr } = await supabase.from("order_items").insert(lineItems);
      if (iErr) throw iErr;
      clear();
      toast.success(t("order_success"));
      navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold">{t("checkout")}</h1>
          {(["customer_name", "phone", "address"] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-sm font-medium">{t(k === "customer_name" ? "name" : k)}</label>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">{t("notes")}</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </div>
          <button disabled={submitting} className="w-full gold-gradient rounded-full py-3 text-sm font-bold text-gold-foreground disabled:opacity-50">
            {submitting ? "..." : t("place_order")}
          </button>
        </form>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 space-y-3">
          <div className="flex justify-between text-sm"><span>{t("subtotal")}</span><span>{formatMoney(subtotal, cur)}</span></div>
          <div className="flex justify-between text-sm"><span>{t("delivery_fee")}</span><span>{formatMoney(deliveryFee, cur)}</span></div>
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold"><span>{t("total")}</span><span className="text-gold">{formatMoney(total, cur)}</span></div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}