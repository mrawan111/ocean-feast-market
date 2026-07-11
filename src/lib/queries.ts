import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories").select("*").eq("active", true).order("sort_order");
    if (error) throw error; return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) throw error; return data ?? [];
  },
});

export const featuredProductsQuery = queryOptions({
  queryKey: ["products", "featured"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products").select("*").eq("featured", true).eq("available", true).order("sort_order");
    if (error) throw error; return data ?? [];
  },
});

export const todaysCatchQuery = queryOptions({
  queryKey: ["products", "market"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products").select("*").eq("is_market_price", true).eq("available", true).order("sort_order");
    if (error) throw error; return data ?? [];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error; return data;
  },
});

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6);
    if (error) throw error; return data ?? [];
  },
});

export const productByIdQuery = (id: string) => queryOptions({
  queryKey: ["product", id],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error; return data;
  },
});