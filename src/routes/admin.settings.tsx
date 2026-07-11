import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*").eq("id", 1).single()).data,
  });
  const [form, setForm] = useState<Record<string, string | number>>({});
  useEffect(() => {
    if (data) setForm({
      phone: data.phone, whatsapp: data.whatsapp, maps_url: data.maps_url,
      address_ar: data.address_ar, address_en: data.address_en,
      hours_ar: (data.opening_hours as { ar?: string })?.ar ?? "",
      hours_en: (data.opening_hours as { en?: string })?.en ?? "",
      delivery_fee: Number(data.delivery_fee),
      hero_title_ar: data.hero_title_ar, hero_title_en: data.hero_title_en,
      hero_subtitle_ar: data.hero_subtitle_ar, hero_subtitle_en: data.hero_subtitle_en,
    });
  }, [data]);

  async function save() {
    const { error } = await supabase.from("site_settings").update({
      phone: String(form.phone), whatsapp: String(form.whatsapp), maps_url: String(form.maps_url),
      address_ar: String(form.address_ar), address_en: String(form.address_en),
      opening_hours: { ar: String(form.hours_ar), en: String(form.hours_en) },
      delivery_fee: Number(form.delivery_fee),
      hero_title_ar: String(form.hero_title_ar), hero_title_en: String(form.hero_title_en),
      hero_subtitle_ar: String(form.hero_subtitle_ar), hero_subtitle_en: String(form.hero_subtitle_en),
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["settings"] });
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    toast.success("Saved");
  }

  const fields: [string, string][] = [
    ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["maps_url", "Google Maps URL"],
    ["address_ar", "Address (AR)"], ["address_en", "Address (EN)"],
    ["hours_ar", "Hours (AR)"], ["hours_en", "Hours (EN)"],
    ["delivery_fee", "Delivery Fee"],
    ["hero_title_ar", "Hero Title (AR)"], ["hero_title_en", "Hero Title (EN)"],
    ["hero_subtitle_ar", "Hero Subtitle (AR)"], ["hero_subtitle_en", "Hero Subtitle (EN)"],
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        {fields.map(([k, label]) => (
          <div key={k}>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
            <input value={form[k] ?? ""} onChange={(e) => setForm({...form, [k]: e.target.value})}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
        ))}
        <button onClick={save} className="gold-gradient rounded-full px-6 py-2 text-sm font-bold text-gold-foreground">Save</button>
      </div>
    </div>
  );
}