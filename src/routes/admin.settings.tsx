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
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setForm({
      phone: data.phone, whatsapp: data.whatsapp, maps_url: data.maps_url,
      address_ar: data.address_ar,
      hours_ar: (data.opening_hours as { ar?: string })?.ar ?? "",
      hero_title_ar: data.hero_title_ar,
      hero_subtitle_ar: data.hero_subtitle_ar,
    });
  }, [data]);

  async function save() {
    const { error } = await supabase.from("site_settings").update({
      phone: form.phone, whatsapp: form.whatsapp, maps_url: form.maps_url,
      address_ar: form.address_ar,
      address_en: form.address_ar,
      opening_hours: { ar: form.hours_ar, en: form.hours_ar },
      hero_title_ar: form.hero_title_ar,
      hero_title_en: form.hero_title_ar,
      hero_subtitle_ar: form.hero_subtitle_ar,
      hero_subtitle_en: form.hero_subtitle_ar,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["settings"] });
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    toast.success("تم الحفظ");
  }

  const fields: [string, string][] = [
    ["phone", "رقم الهاتف"],
    ["whatsapp", "رقم واتساب"],
    ["maps_url", "رابط خرائط جوجل"],
    ["address_ar", "العنوان"],
    ["hours_ar", "مواعيد العمل"],
    ["hero_title_ar", "عنوان الصفحة الرئيسية"],
    ["hero_subtitle_ar", "الوصف الرئيسي"],
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">الإعدادات</h1>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        {fields.map(([k, label]) => (
          <div key={k}>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
            <input value={form[k] ?? ""} onChange={(e) => setForm({...form, [k]: e.target.value})}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
        ))}
        <button onClick={save} className="gold-gradient rounded-full px-6 py-2 text-sm font-bold text-gold-foreground">حفظ</button>
      </div>
    </div>
  );
}