import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Product = Tables<"products">;

const empty = {
  name_ar: "", description_ar: "",
  price: "", price_per_kg: "", is_market_price: false,
  category_id: "", available: true, sort_order: 0, image_url: "",
};

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "cats"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [],
  });
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
      toast.success("تم الرفع");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الرفع"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.name_ar) return toast.error("الاسم مطلوب");
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_ar,
      description_ar: form.description_ar || null,
      description_en: null,
      price: form.price ? Number(form.price) : null,
      price_per_kg: form.price_per_kg ? Number(form.price_per_kg) : null,
      is_market_price: form.is_market_price,
      category_id: form.category_id || null,
      available: form.available,
      featured: false,
      sort_order: Number(form.sort_order) || 0,
      image_url: form.image_url || null,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    setForm({ ...empty }); setEditing(null); refresh();
    toast.success("تم الحفظ");
  }

  async function del(id: string) {
    if (!confirm("حذف؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  function edit(p: Product) {
    setEditing(p.id);
    setForm({
      name_ar: p.name_ar,
      description_ar: p.description_ar ?? "",
      price: p.price?.toString() ?? "", price_per_kg: p.price_per_kg?.toString() ?? "",
      is_market_price: p.is_market_price,
      category_id: p.category_id ?? "",
      available: p.available,
      sort_order: p.sort_order, image_url: p.image_url ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">المنتجات</h1>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h2 className="font-semibold">{editing ? "تعديل منتج" : "منتج جديد"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="الاسم" value={form.name_ar} onChange={(e) => setForm({...form, name_ar: e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">— القسم —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
          </select>
          <textarea placeholder="الوصف (اختياري)" value={form.description_ar} onChange={(e) => setForm({...form, description_ar: e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
          <input placeholder="السعر (للحبة)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="السعر (للكيلو)" type="number" step="0.01" value={form.price_per_kg} onChange={(e) => setForm({...form, price_per_kg: e.target.value})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="الترتيب" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: Number(e.target.value)})} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.available} onChange={(e) => setForm({...form, available: e.target.checked})}/> متاح</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_market_price} onChange={(e) => setForm({...form, is_market_price: e.target.checked})}/> سعر اليوم</label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer">
            <Upload className="h-4 w-4"/> {uploading ? "جاري الرفع…" : "رفع صورة"}
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          </label>
          {form.image_url && <img src={form.image_url} alt="" className="h-12 w-12 rounded object-cover" />}
          <input placeholder="أو الصق رابط الصورة" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="gold-gradient rounded-full px-6 py-2 text-sm font-bold text-gold-foreground"><Plus className="h-4 w-4 inline"/> {editing ? "تحديث" : "إضافة"}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({...empty}); }} className="rounded-full border border-border px-6 py-2 text-sm">إلغاء</button>}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-2 text-start">الاسم</th><th className="px-4 py-2">السعر</th><th className="px-4 py-2">متاح</th><th></th>
          </tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  {p.image_url && <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover"/>}
                  <div className="font-medium">{p.name_ar}</div>
                </div>
              </td>
              <td className="px-4 py-2 text-center">{p.is_market_price ? "سعر اليوم" : p.price_per_kg ? `${p.price_per_kg}/كجم` : p.price}</td>
              <td className="px-4 py-2 text-center">{p.available ? "✓" : "✗"}</td>
              <td className="px-4 py-2 text-end space-x-2 space-x-reverse">
                <button onClick={() => edit(p)} className="text-xs text-gold hover:underline">تعديل</button>
                <button onClick={() => del(p.id)} className="text-destructive"><Trash2 className="h-4 w-4 inline"/></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}