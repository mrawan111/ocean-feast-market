-- Public storage bucket for product/category images (used by admin upload UI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Admin upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

-- Category images (curated stock photos)
UPDATE public.categories SET image_url = CASE name_en
  WHEN 'Fish' THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Casseroles' THEN 'https://images.unsplash.com/photo-1604908177526-68933885afb1?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Pasta' THEN 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Salads & Pickles' THEN 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Single Meals' THEN 'https://images.unsplash.com/photo-1580476268162-a68edaccae39?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Meals' THEN 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Trays' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Rice & Sides' THEN 'https://images.unsplash.com/photo-1586201375767-838750e491c5?auto=format&fit=crop&w=600&h=400&q=80'
  WHEN 'Sandwiches' THEN 'https://images.unsplash.com/photo-1528735602785-37db8e9b5c67?auto=format&fit=crop&w=600&h=400&q=80'
END,
updated_at = now()
WHERE image_url IS NULL;

-- Product images mapped by English name
UPDATE public.products SET image_url = CASE name_en
  -- Fish (raw seafood)
  WHEN 'Tilapia' THEN 'https://images.unsplash.com/photo-1534043464123-231ebfdb45f8?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mullet' THEN 'https://images.unsplash.com/photo-1544552866-4bb0b7654d29?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Sea Bass' THEN 'https://images.unsplash.com/photo-1534043464123-231ebfdb45f8?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Sea Bream' THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Grouper' THEN 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Hamour' THEN 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Najil' THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Emperor Fish' THEN 'https://images.unsplash.com/photo-1544552866-4bb0b7654d29?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Macaroni Fish' THEN 'https://images.unsplash.com/photo-1534043464123-231ebfdb45f8?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Shrimp' THEN 'https://images.unsplash.com/photo-1565680018434-b513d5e261b9?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Lobster' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Zalo' THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Crab' THEN 'https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Salmon' THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Clams' THEN 'https://images.unsplash.com/photo-1608741365100-a847ba93eea1?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mussels' THEN 'https://images.unsplash.com/photo-1599081263090-0af31c29ed4e?auto=format&fit=crop&w=600&h=600&q=80'
  -- Casseroles
  WHEN 'Shrimp Casserole' THEN 'https://images.unsplash.com/photo-1604908177526-68933885afb1?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Calamari Casserole' THEN 'https://images.unsplash.com/photo-1604908177526-68933885afb1?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mixed Casserole (Red - White)' THEN 'https://images.unsplash.com/photo-1604908177526-68933885afb1?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Abu Naji Special Casserole' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Eel Casserole' THEN 'https://images.unsplash.com/photo-1604908177526-68933885afb1?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Shrimp Mbackbaka Casserole' THEN 'https://images.unsplash.com/photo-1565680018434-b513d5e261b9?auto=format&fit=crop&w=600&h=600&q=80'
  -- Pasta
  WHEN 'Shrimp Pasta' THEN 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Calamari Pasta' THEN 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Seafood Pasta' THEN 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&h=600&q=80'
  -- Salads & Pickles
  WHEN 'Tahini Salad' THEN 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Green Salad' THEN 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Pickled Eggplant Salad' THEN 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Marinated Tomato Salad' THEN 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mixed Pickles' THEN 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Pickled Lemon with Safflower' THEN 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80'
  -- Single Meals
  WHEN 'Fried Fish Meal' THEN 'https://images.unsplash.com/photo-1580476268162-a68edaccae39?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Grilled Fish Meal' THEN 'https://images.unsplash.com/photo-1485921325833-a22f516b39de?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Shrimp Meal' THEN 'https://images.unsplash.com/photo-1565680018434-b513d5e261b9?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Calamari Meal' THEN 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mixed Seafood Meal' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  -- Family Meals
  WHEN 'Small Family Meal' THEN 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Large Family Meal' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Abu Naji Special Meal' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  -- Trays
  WHEN 'Shrimp Tray' THEN 'https://images.unsplash.com/photo-1565680018434-b513d5e261b9?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Seafood Tray' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mixed Tray' THEN 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&h=600&q=80'
  -- Soup
  WHEN 'Shrimp Soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Seafood Soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Fish Soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&h=600&q=80'
  -- Rice & Sides
  WHEN 'Fisherman Rice' THEN 'https://images.unsplash.com/photo-1586201375767-838750e491c5?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'White Rice' THEN 'https://images.unsplash.com/photo-1586201375767-838750e491c5?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Baladi Bread' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Shami Bread' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=600&q=80'
  -- Sandwiches
  WHEN 'Shrimp Sandwich' THEN 'https://images.unsplash.com/photo-1528735602785-37db8e9b5c67?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Calamari Sandwich' THEN 'https://images.unsplash.com/photo-1528735602785-37db8e9b5c67?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Fillet Sandwich' THEN 'https://images.unsplash.com/photo-1528735602785-37db8e9b5c67?auto=format&fit=crop&w=600&h=600&q=80'
  WHEN 'Mix Seafood Sandwich' THEN 'https://images.unsplash.com/photo-1528735602785-37db8e9b5c67?auto=format&fit=crop&w=600&h=600&q=80'
END,
updated_at = now()
WHERE image_url IS NULL;
