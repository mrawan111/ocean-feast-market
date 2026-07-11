import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

function AdminCategories() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const [form, setForm] = useState({ name_ar: "", name_en: "", sort_order: 0 });

  async function add() {
    if (!form.name_ar || !form.name_en) return toast.error("Both names required");
    const { error } = await supabase.from("categories").insert(form);
    if (error) return toast.error(error.message);
    setForm({ name_ar: "", name_en: "", sort_order: 0 });
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }
  async function del(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }
  async function toggle(id: string, active: boolean) {
    await supabase.from("categories").update({ active: !active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="flex gap-2 rounded-2xl border border-border bg-card p-4">
        <input placeholder="Arabic name" value={form.name_ar} onChange={(e) => setForm({...form, name_ar: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input placeholder="English name" value={form.name_en} onChange={(e) => setForm({...form, name_en: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input type="number" placeholder="Sort" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: Number(e.target.value)})} className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button onClick={add} className="gold-gradient rounded-lg px-4 text-sm font-bold text-gold-foreground"><Plus className="h-4 w-4 inline" /></button>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase text-muted-foreground">
            <tr><th className="px-4 py-2 text-start">Arabic</th><th className="px-4 py-2 text-start">English</th><th className="px-4 py-2">Sort</th><th className="px-4 py-2">Active</th><th></th></tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2">{c.name_ar}</td>
                <td className="px-4 py-2">{c.name_en}</td>
                <td className="px-4 py-2 text-center">{c.sort_order}</td>
                <td className="px-4 py-2 text-center"><button onClick={() => toggle(c.id, c.active)} className="text-xs">{c.active ? "✓" : "✗"}</button></td>
                <td className="px-4 py-2 text-end"><button onClick={() => del(c.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}