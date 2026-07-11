DELETE FROM public.products;
DELETE FROM public.categories;

INSERT INTO public.categories (name_ar, name_en, image_url, sort_order, active) VALUES
  ('الأسماك', 'Fish', NULL, 1, true),
  ('الطواجن', 'Casseroles', NULL, 2, true),
  ('المكرونات', 'Pasta', NULL, 3, true),
  ('سلطات ومخللات', 'Salads & Pickles', NULL, 4, true),
  ('وجبات فردية', 'Single Meals', NULL, 5, true),
  ('الوجبات', 'Meals', NULL, 6, true),
  ('الصواني', 'Trays', NULL, 7, true),
  ('الشوربة', 'Soup', NULL, 8, true),
  ('المعجنات', 'Rice & Sides', NULL, 9, true),
  ('السندوتشات', 'Sandwiches', NULL, 10, true);

WITH product_rows (
  category_ar,
  name_ar,
  name_en,
  description_ar,
  description_en,
  price,
  price_per_kg,
  is_market_price,
  image_url,
  available,
  featured,
  sort_order
) AS (
  VALUES
    ('الأسماك', 'بلطي', 'Tilapia', NULL, NULL, NULL, NULL, false, NULL, true, false, 1),
    ('الأسماك', 'بوري', 'Mullet', NULL, NULL, NULL, NULL, false, NULL, true, false, 2),
    ('الأسماك', 'قاروص', 'Sea Bass', NULL, NULL, NULL, NULL, false, NULL, true, false, 3),
    ('الأسماك', 'دنيس', 'Sea Bream', NULL, NULL, NULL, NULL, false, NULL, true, false, 4),
    ('الأسماك', 'موسى', 'Sole Fish', NULL, NULL, NULL, NULL, false, NULL, true, false, 5),
    ('الأسماك', 'مرجان', 'Red Snapper', NULL, NULL, NULL, NULL, false, NULL, true, false, 6),
    ('الأسماك', 'سلمون', 'Salmon', NULL, NULL, NULL, NULL, false, NULL, true, false, 7),
    ('الأسماك', 'جمبري', 'Shrimp', NULL, NULL, NULL, NULL, false, NULL, true, false, 8),
    ('الأسماك', 'كابوريا', 'Crab', NULL, NULL, NULL, NULL, false, NULL, true, false, 9),
    ('الأسماك', 'استاكوزا', 'Lobster', NULL, NULL, NULL, NULL, false, NULL, true, false, 10),
    ('الطواجن', 'طاجن جمبري', 'Shrimp Casserole', NULL, NULL, NULL, NULL, false, NULL, true, false, 11),
    ('الطواجن', 'طاجن بسيط', 'Regular Casserole', NULL, NULL, NULL, NULL, false, NULL, true, false, 12),
    ('المكرونات', 'مكرونة جمبري', 'Shrimp Pasta', NULL, NULL, NULL, NULL, false, NULL, true, false, 13),
    ('المكرونات', 'مكرونة بسيط', 'Regular Pasta', NULL, NULL, NULL, NULL, false, NULL, true, false, 14),
    ('المكرونات', 'مكرونة سي فود', 'Seafood Pasta', NULL, NULL, NULL, NULL, false, NULL, true, false, 15),
    ('سلطات ومخللات', 'سلطة خضراء', 'Green Salad', NULL, NULL, NULL, NULL, false, NULL, true, false, 16),
    ('سلطات ومخللات', 'مخلل مشكل', 'Mixed Pickles', NULL, NULL, NULL, NULL, false, NULL, true, false, 17),
    ('وجبات فردية', 'بلطي مشوي أو مقلي', 'Grilled or Fried Tilapia', NULL, NULL, NULL, NULL, false, NULL, true, false, 18),
    ('وجبات فردية', 'جمبري مشوي أو مقلي', 'Grilled or Fried Shrimp', NULL, NULL, NULL, NULL, false, NULL, true, false, 19),
    ('الشوربة', 'شوربة جمبري', 'Shrimp Soup', NULL, NULL, NULL, NULL, false, NULL, true, false, 20),
    ('الشوربة', 'شوربة سي فود', 'Seafood Soup', NULL, NULL, NULL, NULL, false, NULL, true, false, 21),
    ('المعجنات', 'أرز صيادية', 'Sayadia Rice', NULL, NULL, NULL, NULL, false, NULL, true, false, 22),
    ('المعجنات', 'أرز بالخلطة', 'Mixed Rice', NULL, NULL, NULL, NULL, false, NULL, true, false, 23),
    ('السندوتشات', 'سندوتش جمبري', 'Shrimp Sandwich', NULL, NULL, NULL, NULL, false, NULL, true, false, 24),
    ('السندوتشات', 'سندوتش سي فود', 'Seafood Sandwich', NULL, NULL, NULL, NULL, false, NULL, true, false, 25)
)
INSERT INTO public.products (
  category_id,
  name_ar,
  name_en,
  description_ar,
  description_en,
  price,
  price_per_kg,
  is_market_price,
  image_url,
  available,
  featured,
  sort_order
)
SELECT
  c.id,
  p.name_ar,
  p.name_en,
  p.description_ar,
  p.description_en,
  p.price,
  p.price_per_kg,
  p.is_market_price,
  p.image_url,
  p.available,
  p.featured,
  p.sort_order
FROM product_rows p
JOIN public.categories c ON c.name_ar = p.category_ar
ORDER BY p.sort_order;
