import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

type Category = Tables<"categories">;

const empty = { name_ar: "", name_en: "", sort_order: 0, image_url: "" };

function AdminCategories() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
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
      toast.success("Uploaded");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  }

  async function add() {
    if (!form.name_ar || !form.name_en) return toast.error("Both names required");
    const payload = {
      name_ar: form.name_ar, name_en: form.name_en,
      sort_order: Number(form.sort_order) || 0,
      image_url: form.image_url || null,
    };
    const { error } = editing
      ? await supabase.from("categories").update(payload).eq("id", editing)
      : await supabase.from("categories").insert(payload);
    if (error) return toast.error(error.message);
    setForm({ ...empty }); setEditing(null); refresh();
    toast.success("Saved");
  }
  function edit(c: Category) {
    setEditing(c.id);
    setForm({ name_ar: c.name_ar, name_en: c.name_en, sort_order: c.sort_order, image_url: c.image_url ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function del(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }
  async function toggle(id: string, active: boolean) {
    await supabase.from("categories").update({ active: !active }).eq("id", id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex gap-2">
          <input placeholder="Arabic name" value={form.name_ar} onChange={(e) => setForm({...form, name_ar: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="English name" value={form.name_en} onChange={(e) => setForm({...form, name_en: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input type="number" placeholder="Sort" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: Number(e.target.value)})} className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer">
            <Upload className="h-4 w-4"/> {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          </label>
          {form.image_url && <img src={form.image_url} alt="" className="h-12 w-12 rounded object-cover" />}
          <input placeholder="or paste image URL" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <button onClick={add} className="gold-gradient rounded-lg px-4 py-2 text-sm font-bold text-gold-foreground"><Plus className="h-4 w-4 inline"/> {editing ? "Update" : "Add"}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({...empty}); }} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase text-muted-foreground">
            <tr><th className="px-4 py-2 text-start">Image</th><th className="px-4 py-2 text-start">Arabic</th><th className="px-4 py-2 text-start">English</th><th className="px-4 py-2">Sort</th><th className="px-4 py-2">Active</th><th></th></tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2">{c.image_url ? <img src={c.image_url} alt="" className="h-8 w-8 rounded object-cover"/> : <div className="h-8 w-8 rounded bg-surface" />}</td>
                <td className="px-4 py-2">{c.name_ar}</td>
                <td className="px-4 py-2">{c.name_en}</td>
                <td className="px-4 py-2 text-center">{c.sort_order}</td>
                <td className="px-4 py-2 text-center"><button onClick={() => toggle(c.id, c.active)} className="text-xs">{c.active ? "✓" : "✗"}</button></td>
                <td className="px-4 py-2 text-end space-x-2">
                  <button onClick={() => edit(c)} className="text-xs text-gold hover:underline">Edit</button>
                  <button onClick={() => del(c.id)} className="text-destructive"><Trash2 className="h-4 w-4 inline"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}