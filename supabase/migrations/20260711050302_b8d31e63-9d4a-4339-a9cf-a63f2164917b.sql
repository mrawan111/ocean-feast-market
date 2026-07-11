
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL, name_en TEXT NOT NULL,
  image_url TEXT, sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL, name_en TEXT NOT NULL,
  description_ar TEXT, description_en TEXT,
  price NUMERIC(10,2), price_per_kg NUMERIC(10,2),
  is_market_price BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.order_status AS ENUM ('pending','preparing','out_for_delivery','completed','cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, notes TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name_snapshot TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  weight_kg NUMERIC(10,2), cooking_method TEXT,
  extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  phone TEXT NOT NULL DEFAULT '0103460744',
  whatsapp TEXT NOT NULL DEFAULT '0103460744',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/KUxZWNB76kJHnjHw9',
  address_ar TEXT NOT NULL DEFAULT 'مدينة الشروق المتميز - خلف مستشفى نور الشروق',
  address_en TEXT NOT NULL DEFAULT 'El-Shorouk City, behind Nour El-Shorouk Hospital',
  opening_hours JSONB NOT NULL DEFAULT '{"ar":"يومياً من 12 ظهراً حتى 2 صباحاً","en":"Daily 12 PM - 2 AM"}'::jsonb,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 30,
  hero_title_ar TEXT NOT NULL DEFAULT 'أسماك أبو ناجي',
  hero_title_en TEXT NOT NULL DEFAULT 'Abu Naji Seafood',
  hero_subtitle_ar TEXT NOT NULL DEFAULT 'طازج من البحر إلى مائدتك',
  hero_subtitle_en TEXT NOT NULL DEFAULT 'Fresh from the sea to your table',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.site_settings (id) VALUES (1);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, rating INT NOT NULL DEFAULT 5,
  comment_ar TEXT, comment_en TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin read order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "User read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.categories (name_ar, name_en, sort_order) VALUES
  ('الأسماك','Fish',1),
  ('الجمبري والقشريات','Shrimp & Crustaceans',2),
  ('الطواجن','Tagines',3),
  ('المكرونات','Pasta',4),
  ('الوجبات','Meals',5),
  ('وجبات فردية','Individual Meals',6),
  ('الصواني','Trays',7),
  ('الشوربة','Soups',8),
  ('السلطات','Salads',9),
  ('السندوتشات','Sandwiches',10),
  ('المعجنات','Rice & Pastries',11);

WITH c AS (SELECT id, name_en FROM public.categories)
INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, featured, sort_order)
SELECT (SELECT id FROM c WHERE name_en='Fish'), 'بلطي مشوي','Grilled Tilapia','بلطي طازج مشوي على الفحم','Fresh charcoal-grilled tilapia', NULL::numeric, 220::numeric, true, true, 1
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Fish'), 'دنيس','Denis','سمك دنيس طازج','Fresh Denis fish', NULL::numeric, 350::numeric, true, true, 2
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Shrimp & Crustaceans'),'جمبري جامبو','Jumbo Shrimp','جمبري جامبو طازج','Fresh jumbo shrimp', NULL::numeric, 600::numeric, true, true, 3
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Tagines'),'طاجن جمبري','Shrimp Tagine','طاجن جمبري بالصلصة','Shrimp tagine in tomato sauce', 220::numeric, NULL::numeric, false, true, 4
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Tagines'),'طاجن أبو ناجي المميز','Abu Naji Special Tagine','مأكولات بحرية مشكلة','Mixed seafood tagine', 500::numeric, NULL::numeric, false, true, 5
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Meals'),'وجبة 3 أفراد','Family Meal (3)','3 سمك مشوي + 3 أرز + سلطة + طحينة + جمبري','3 fish + rice + salad + tahini + shrimp', 690::numeric, NULL::numeric, false, true, 6
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Soups'),'شوربة جمبري','Shrimp Soup','شوربة جمبري بالكريمة','Creamy shrimp soup', 135::numeric, NULL::numeric, false, false, 7
UNION ALL SELECT (SELECT id FROM c WHERE name_en='Sandwiches'),'سندوتش جمبري','Shrimp Sandwich','سندوتش جمبري مقلي','Fried shrimp sandwich', 90::numeric, NULL::numeric, false, false, 8;

INSERT INTO public.reviews (name, rating, comment_ar, comment_en, approved) VALUES
  ('أحمد م.', 5, 'أطيب سمك في الشروق، طازج جداً!', 'Best seafood in Shorouk, super fresh!', true),
  ('Sara K.', 5, 'الجمبري المشوي رائع والخدمة ممتازة', 'The grilled shrimp is amazing and service is great', true),
  ('محمد ع.', 5, 'صينية أبو ناجي عائلية وشبعانة', 'The Abu Naji tray is family-sized and filling', true);
