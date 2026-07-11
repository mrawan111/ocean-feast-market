import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

const dict = {
  ar: {
    brand: "أسماك أبو ناجي",
    tagline: "من البحر إلى مائدتك",
    nav_home: "الرئيسية",
    nav_shop: "المتجر",
    nav_cart: "السلة",
    nav_admin: "الإدارة",
    hero_cta: "تسوق الآن",
    hero_secondary: "اتصل بنا",
    featured: "الأكثر مبيعاً",
    todays_catch: "طازج اليوم",
    categories: "الأقسام",
    reviews: "آراء عملائنا",
    location: "موقعنا",
    contact: "تواصل معنا",
    call_us: "اتصل بنا",
    whatsapp: "واتساب",
    open_map: "افتح الخريطة",
    search_products: "ابحث عن منتج...",
    all_categories: "كل الأقسام",
    market_price: "سعر اليوم",
    add_to_cart: "أضف للسلة",
    view_details: "التفاصيل",
    quantity: "الكمية",
    weight_kg: "الوزن (كجم)",
    cooking_method: "طريقة التحضير",
    cm_fried: "مقلي",
    cm_grilled: "مشوي",
    cm_oven: "فرن",
    cm_clean: "تنظيف فقط",
    extras: "إضافات",
    extra_rice: "أرز",
    extra_tahini: "طحينة",
    extra_salad: "سلطة",
    extra_bread: "عيش",
    cart_empty: "السلة فارغة",
    cart_continue: "تابع التسوق",
    subtotal: "المجموع",
    delivery_fee: "رسوم التوصيل",
    total: "الإجمالي",
    checkout: "إتمام الطلب",
    name: "الاسم",
    phone: "رقم الهاتف",
    address: "العنوان",
    notes: "ملاحظات",
    place_order: "تأكيد الطلب",
    order_success: "تم استلام طلبك",
    order_success_desc: "سنتواصل معك قريباً لتأكيد الطلب",
    order_number: "رقم الطلب",
    unavailable: "غير متاح",
    login: "دخول",
    logout: "خروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    dashboard: "لوحة التحكم",
    products: "المنتجات",
    orders: "الطلبات",
    settings: "الإعدادات",
    remove: "حذف",
    lang_switch: "English",
    currency: "جنيه",
    kg: "كجم",
    each: "للحبة",
    powered_by: "جميع الحقوق محفوظة",
  },
  en: {
    brand: "Abu Naji Seafood",
    tagline: "From the sea to your table",
    nav_home: "Home",
    nav_shop: "Shop",
    nav_cart: "Cart",
    nav_admin: "Admin",
    hero_cta: "Shop Now",
    hero_secondary: "Contact",
    featured: "Best Sellers",
    todays_catch: "Today's Fresh Catch",
    categories: "Categories",
    reviews: "Customer Reviews",
    location: "Our Location",
    contact: "Contact Us",
    call_us: "Call Us",
    whatsapp: "WhatsApp",
    open_map: "Open Map",
    search_products: "Search products...",
    all_categories: "All Categories",
    market_price: "Market Price",
    add_to_cart: "Add to Cart",
    view_details: "Details",
    quantity: "Quantity",
    weight_kg: "Weight (kg)",
    cooking_method: "Cooking Method",
    cm_fried: "Fried",
    cm_grilled: "Grilled",
    cm_oven: "Oven",
    cm_clean: "Clean Only",
    extras: "Extras",
    extra_rice: "Rice",
    extra_tahini: "Tahini",
    extra_salad: "Salad",
    extra_bread: "Bread",
    cart_empty: "Your cart is empty",
    cart_continue: "Continue shopping",
    subtotal: "Subtotal",
    delivery_fee: "Delivery",
    total: "Total",
    checkout: "Checkout",
    name: "Name",
    phone: "Phone",
    address: "Address",
    notes: "Notes",
    place_order: "Place Order",
    order_success: "Order received!",
    order_success_desc: "We'll contact you shortly to confirm.",
    order_number: "Order #",
    unavailable: "Unavailable",
    login: "Log in",
    logout: "Log out",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    settings: "Settings",
    remove: "Remove",
    lang_switch: "العربية",
    currency: "EGP",
    kg: "kg",
    each: "each",
    powered_by: "All rights reserved",
  },
} as const;

type Key = keyof (typeof dict)["ar"];

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  dir: "rtl" | "ltr";
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        try { localStorage.setItem("lang", l); } catch {}
      },
      t: (k) => dict[lang][k] ?? k,
      dir: lang === "ar" ? "rtl" : "ltr",
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be inside I18nProvider");
  return v;
}

export function pickLocalized<T extends Record<string, unknown>>(
  row: T,
  base: string,
  lang: Lang,
): string {
  const val = (row[`${base}_${lang}`] ?? row[`${base}_ar`] ?? row[`${base}_en`]) as string | null;
  return val ?? "";
}