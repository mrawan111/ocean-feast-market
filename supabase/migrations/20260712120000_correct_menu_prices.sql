-- Correct menu pricing and descriptions from the uploaded menu image.
-- This migration updates existing seed rows and adds missing size variants.

-- Casseroles
UPDATE public.products p
SET name_ar = 'طاجن جمبري صغير',
    name_en = 'Shrimp Casserole Small',
    description_ar = 'طاجن جمبري بالحجم الصغير',
    description_en = 'Small shrimp casserole',
    price = 185,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن جمبري';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'طاجن جمبري كبير', 'Shrimp Casserole Large', 'طاجن جمبري بالحجم الكبير', 'Large shrimp casserole', 220, NULL, FALSE, TRUE, FALSE, 2
FROM public.categories c
WHERE c.name_ar = 'الطواجن';

UPDATE public.products p
SET name_ar = 'طاجن سبيط صغير',
    name_en = 'Calamari Casserole Small',
    description_ar = 'طاجن سبيط بالحجم الصغير',
    description_en = 'Small calamari casserole',
    price = 185,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن بسيط';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'طاجن سبيط كبير', 'Calamari Casserole Large', 'طاجن سبيط بالحجم الكبير', 'Large calamari casserole', 220, NULL, FALSE, TRUE, FALSE, 4
FROM public.categories c
WHERE c.name_ar = 'الطواجن';

UPDATE public.products p
SET name_ar = 'طاجن مشكل (أحمر - أبيض)',
    name_en = 'Mixed Casserole (Red - White)',
    description_ar = 'طاجن مشكل بطبقتين: أحمر وأبيض',
    description_en = 'Mixed casserole with red and white sauces',
    price = 300,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 5
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن مشكل (أحمر - أبيض)';

UPDATE public.products p
SET name_ar = 'طاجن أبو ناجي المميز',
    name_en = 'Abu Naji Special Casserole',
    description_ar = 'طاجن مميز من اختيار الشيف مع خلطة بحرية غنية',
    description_en = 'Chef special seafood casserole',
    price = 500,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 6
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن أبو ناجي المميز';

UPDATE public.products p
SET name_ar = 'طاجن ثعبان',
    name_en = 'Eel Casserole',
    description_ar = 'طاجن ثعبان بالتتبيلة الخاصة',
    description_en = 'Eel casserole with special seasoning',
    price = 400,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 7
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن ثعبان';

UPDATE public.products p
SET name_ar = 'طاجن جمبري مبكبكة',
    name_en = 'Shrimp Mbackbaka Casserole',
    description_ar = 'جمبري مبكبكة بصوص البندورة والبهارات',
    description_en = 'Shrimp mbackbaka with tomato sauce',
    price = 250,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 8
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الطواجن'
  AND p.name_ar = 'طاجن جمبري مبكبكة';

-- Pasta
UPDATE public.products p
SET name_ar = 'مكرونة جمبري',
    name_en = 'Shrimp Pasta',
    description_ar = 'مكرونة مع جمبري وصوص بحري',
    description_en = 'Pasta with shrimp and seafood sauce',
    price = 200,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المكرونات'
  AND p.name_ar = 'مكرونة جمبري';

UPDATE public.products p
SET name_ar = 'مكرونة سبيط',
    name_en = 'Calamari Pasta',
    description_ar = 'مكرونة مع سبيط وصوص متبل',
    description_en = 'Pasta with calamari and seasoning',
    price = 200,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المكرونات'
  AND p.name_ar = 'مكرونة بسيط';

UPDATE public.products p
SET name_ar = 'مكرونة سي فود',
    name_en = 'Seafood Pasta',
    description_ar = 'مكرونة بالجمبري والسبيط والفيليه',
    description_en = 'Pasta with shrimp, calamari and fillet',
    price = 250,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المكرونات'
  AND p.name_ar = 'مكرونة سي فود';

-- Salads and pickles, split into small/large when the menu shows two prices.
UPDATE public.products p
SET name_ar = 'سلطة طحينة صغير',
    name_en = 'Tahini Salad Small',
    description_ar = 'سلطة طحينة بالحجم الصغير',
    description_en = 'Small tahini salad',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'سلطة طحينة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'سلطة طحينة كبير', 'Tahini Salad Large', 'سلطة طحينة بالحجم الكبير', 'Large tahini salad', 20, NULL, FALSE, TRUE, FALSE, 2
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

UPDATE public.products p
SET name_ar = 'سلطة خضراء صغير',
    name_en = 'Green Salad Small',
    description_ar = 'سلطة خضراء بالحجم الصغير',
    description_en = 'Small green salad',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'سلطة خضراء';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'سلطة خضراء كبير', 'Green Salad Large', 'سلطة خضراء بالحجم الكبير', 'Large green salad', 35, NULL, FALSE, TRUE, FALSE, 4
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

UPDATE public.products p
SET name_ar = 'سلطة باذنجان مخلل صغير',
    name_en = 'Pickled Eggplant Salad Small',
    description_ar = 'سلطة باذنجان مخلل بالحجم الصغير',
    description_en = 'Small pickled eggplant salad',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 5
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'سلطة باذنجان مخلل';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'سلطة باذنجان مخلل كبير', 'Pickled Eggplant Salad Large', 'سلطة باذنجان مخلل بالحجم الكبير', 'Large pickled eggplant salad', 20, NULL, FALSE, TRUE, FALSE, 6
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

UPDATE public.products p
SET name_ar = 'سلطة طماطم متبلة صغير',
    name_en = 'Marinated Tomato Salad Small',
    description_ar = 'سلطة طماطم متبلة بالحجم الصغير',
    description_en = 'Small marinated tomato salad',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 7
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'سلطة طماطم متبلة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'سلطة طماطم متبلة كبير', 'Marinated Tomato Salad Large', 'سلطة طماطم متبلة بالحجم الكبير', 'Large marinated tomato salad', 35, NULL, FALSE, TRUE, FALSE, 8
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

UPDATE public.products p
SET name_ar = 'مخلل مشكل صغير',
    name_en = 'Mixed Pickles Small',
    description_ar = 'مخلل مشكل بالحجم الصغير',
    description_en = 'Small mixed pickles',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 9
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'مخلل مشكل';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'مخلل مشكل كبير', 'Mixed Pickles Large', 'مخلل مشكل بالحجم الكبير', 'Large mixed pickles', 20, NULL, FALSE, TRUE, FALSE, 10
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

UPDATE public.products p
SET name_ar = 'ليمون معصفر صغير',
    name_en = 'Pickled Lemon Small',
    description_ar = 'ليمون معصفر بالحجم الصغير',
    description_en = 'Small pickled lemon',
    price = 10,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 11
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'سلطات ومخللات'
  AND p.name_ar = 'ليمون معصفر';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'ليمون معصفر كبير', 'Pickled Lemon Large', 'ليمون معصفر بالحجم الكبير', 'Large pickled lemon', 20, NULL, FALSE, TRUE, FALSE, 12
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'زيتون صغير', 'Olives Small', 'زيتون بالحجم الصغير', 'Small olives', 10, NULL, FALSE, TRUE, FALSE, 13
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'زيتون كبير', 'Olives Large', 'زيتون بالحجم الكبير', 'Large olives', 20, NULL, FALSE, TRUE, FALSE, 14
FROM public.categories c
WHERE c.name_ar = 'سلطات ومخللات';

-- Single meals
UPDATE public.products p
SET name_ar = 'بلطي مشوي أو مقلي',
    name_en = 'Grilled or Fried Tilapia',
    description_ar = 'بلطي مشوي أو مقلي',
    description_en = 'Grilled or fried tilapia',
    price = 120,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'وجبات فردية'
  AND p.name_ar = 'وجبة سمك مقلي';

UPDATE public.products p
SET name_ar = 'مكرل مشوي',
    name_en = 'Grilled Mackerel',
    description_ar = 'مكرل مشوي',
    description_en = 'Grilled mackerel',
    price = 200,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'وجبات فردية'
  AND p.name_ar = 'وجبة سمك مشوي';

UPDATE public.products p
SET name_ar = 'بوري مشوي',
    name_en = 'Grilled Mullet',
    description_ar = 'بوري مشوي',
    description_en = 'Grilled mullet',
    price = 185,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'وجبات فردية'
  AND p.name_ar = 'وجبة جمبري';

UPDATE public.products p
SET name_ar = 'فيليه مقلي',
    name_en = 'Fried Fillet',
    description_ar = 'فيليه مقلي',
    description_en = 'Fried fillet',
    price = 135,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 4
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'وجبات فردية'
  AND p.name_ar = 'فيليه مقلي';

UPDATE public.products p
SET name_ar = 'جمبري مشوي أو مقلي أو طاجن',
    name_en = 'Grilled, Fried or Baked Shrimp',
    description_ar = 'جمبري مشوي أو مقلي أو طاجن',
    description_en = 'Shrimp grilled, fried or baked',
    price = 250,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 5
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'وجبات فردية'
  AND p.name_ar = 'وجبة سي فود مشكل';

-- Meals
UPDATE public.products p
SET name_ar = 'وجبة بلطي مشوي أو مقلي',
    name_en = 'Tilapia Meal',
    description_ar = 'بلطي مشوي أو مقلي + طاجن جمبري + شوربة جمبري + أرز + سلطة + طحينة + عيش',
    description_en = 'Tilapia with shrimp casserole, shrimp soup, rice, salad, tahini and bread',
    price = 200,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الوجبات'
  AND p.name_ar = 'وجبة عائلية صغيرة';

UPDATE public.products p
SET name_ar = 'وجبة بلطي مشوي أو مقلي مع شوربة فواكه البحر',
    name_en = 'Tilapia Meal with Seafood Soup',
    description_ar = 'بلطي مشوي أو مقلي + طاجن جمبري + شوربة فواكه البحر + أرز + سلطة + طحينة + عيش',
    description_en = 'Tilapia with shrimp casserole, seafood soup, rice, salad, tahini and bread',
    price = 250,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الوجبات'
  AND p.name_ar = 'وجبة عائلية كبيرة';

UPDATE public.products p
SET name_ar = 'وجبة بوري مشوي أو مقلي أو سنجاري',
    name_en = 'Mullet Meal',
    description_ar = 'بوري مشوي أو مقلي أو سنجاري + طاجن جمبري + شوربة جمبري + أرز + سلطة + طحينة + عيش',
    description_en = 'Mullet with shrimp casserole, shrimp soup, rice, salad, tahini and bread',
    price = 260,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الوجبات'
  AND p.name_ar = 'وجبة أبو ناجي المميزة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'وجبة 3 أفراد', 'Family Meal for 3', '3 سمكات بلطي مشوي أو مقلي + طاجن جمبري + 3 شوربة جمبري + 3 أرز + 3 سلطة + 3 طحينة', 'Meal for three with fish, shrimp casserole, soups, rice, salad and tahini', 690, NULL, FALSE, TRUE, FALSE, 4
FROM public.categories c
WHERE c.name_ar = 'الوجبات';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'وجبة سي فود مكس مقلي', 'Mixed Seafood Meal', 'جمبري + سبيط + فيليه + أرز + سلطة + طحينة', 'Mixed seafood with rice, salad and tahini', 245, NULL, FALSE, TRUE, FALSE, 5
FROM public.categories c
WHERE c.name_ar = 'الوجبات';

-- Trays
UPDATE public.products p
SET name_ar = 'صينية جمبري',
    name_en = 'Shrimp Tray',
    description_ar = 'صينية جمبري متبلة',
    description_en = 'Seasoned shrimp tray',
    price = 550,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الصواني'
  AND p.name_ar = 'صينية جمبري';

UPDATE public.products p
SET name_ar = 'صينية سي فود',
    name_en = 'Seafood Tray',
    description_ar = 'جمبري + سبيط + فيليه داخل صينية واحدة',
    description_en = 'Shrimp, calamari and fillet tray',
    price = 650,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الصواني'
  AND p.name_ar = 'صينية سي فود';

UPDATE public.products p
SET name_ar = 'صينية مشكل',
    name_en = 'Mixed Tray',
    description_ar = 'صينية بحرية مشكلة',
    description_en = 'Mixed seafood tray',
    price = 500,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الصواني'
  AND p.name_ar = 'صينية مشكل';

-- Soups
UPDATE public.products p
SET name_ar = 'شوربة فواكه البحر',
    name_en = 'Seafood Soup',
    description_ar = 'شوربة فواكه البحر',
    description_en = 'Seafood soup',
    price = 170,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الشوربة'
  AND p.name_ar = 'شوربة جمبري';

UPDATE public.products p
SET name_ar = 'شوربة مخلية',
    name_en = 'Clear Seafood Soup',
    description_ar = 'شوربة مخلية',
    description_en = 'Clear seafood soup',
    price = 210,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الشوربة'
  AND p.name_ar = 'شوربة سي فود';

UPDATE public.products p
SET name_ar = 'شوربة جمبري',
    name_en = 'Shrimp Soup',
    description_ar = 'شوربة جمبري',
    description_en = 'Shrimp soup',
    price = 135,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'الشوربة'
  AND p.name_ar = 'شوربة سمك';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'شوربة جندوفلي', 'Clam Soup', 'شوربة جندوفلي', 'Clam soup', 135, NULL, FALSE, TRUE, FALSE, 4
FROM public.categories c
WHERE c.name_ar = 'الشوربة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'شوربة بطار', 'Special Soup', 'شوربة بطار', 'Special seafood soup', 250, NULL, FALSE, TRUE, FALSE, 5
FROM public.categories c
WHERE c.name_ar = 'الشوربة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'ملوخية بالجمبري', 'Molokhia with Shrimp', 'ملوخية بالجمبري', 'Molokhia with shrimp', 135, NULL, FALSE, TRUE, FALSE, 6
FROM public.categories c
WHERE c.name_ar = 'الشوربة';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'شوربة أبو ناجي', 'Abu Naji Soup', 'شوربة أبو ناجي', 'Abu Naji soup', 250, NULL, FALSE, TRUE, FALSE, 7
FROM public.categories c
WHERE c.name_ar = 'الشوربة';

-- Rice and sides
UPDATE public.products p
SET name_ar = 'أرز صيادية',
    name_en = 'Sayadia Rice',
    description_ar = 'أرز صيادية',
    description_en = 'Sayadia rice',
    price = 40,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المعجنات'
  AND p.name_ar = 'أرز صيادية';

UPDATE public.products p
SET name_ar = 'أرز بالجمبري',
    name_en = 'Rice with Shrimp',
    description_ar = 'أرز بالجمبري',
    description_en = 'Rice with shrimp',
    price = 65,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المعجنات'
  AND p.name_ar = 'أرز أبيض';

UPDATE public.products p
SET name_ar = 'أرز بالسبيط',
    name_en = 'Rice with Calamari',
    description_ar = 'أرز بالسبيط',
    description_en = 'Rice with calamari',
    price = 130,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المعجنات'
  AND p.name_ar = 'خبز بلدي';

UPDATE public.products p
SET name_ar = 'أرز بالفيليه',
    name_en = 'Rice with Fillet',
    description_ar = 'أرز بالفيليه',
    description_en = 'Rice with fillet',
    price = 135,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 4
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'المعجنات'
  AND p.name_ar = 'خبز شامي';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'أرز بالسي فود', 'Rice with Seafood', 'أرز بالسي فود', 'Rice with seafood', 250, NULL, FALSE, TRUE, FALSE, 5
FROM public.categories c
WHERE c.name_ar = 'المعجنات';

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, description_en, price, price_per_kg, is_market_price, available, featured, sort_order)
SELECT c.id, 'أرز بالخلطة', 'Mixed Rice', 'أرز بالخلطة', 'Mixed rice', 75, NULL, FALSE, TRUE, FALSE, 6
FROM public.categories c
WHERE c.name_ar = 'المعجنات';

-- Sandwiches
UPDATE public.products p
SET name_ar = 'سندوتش جمبري',
    name_en = 'Shrimp Sandwich',
    description_ar = 'سندوتش جمبري',
    description_en = 'Shrimp sandwich',
    price = 90,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 1
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'السندوتشات'
  AND p.name_ar = 'سندوتش جمبري';

UPDATE public.products p
SET name_ar = 'سندوتش سبيط',
    name_en = 'Calamari Sandwich',
    description_ar = 'سندوتش سبيط',
    description_en = 'Calamari sandwich',
    price = 90,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 2
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'السندوتشات'
  AND p.name_ar = 'سندوتش سبيط';

UPDATE public.products p
SET name_ar = 'سندوتش فيليه',
    name_en = 'Fillet Sandwich',
    description_ar = 'سندوتش فيليه',
    description_en = 'Fillet sandwich',
    price = 90,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 3
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'السندوتشات'
  AND p.name_ar = 'سندوتش فيليه';

UPDATE public.products p
SET name_ar = 'سندوتش مكس',
    name_en = 'Mix Seafood Sandwich',
    description_ar = 'جمبري + سبيط + فيليه',
    description_en = 'Shrimp, calamari and fillet',
    price = 120,
    price_per_kg = NULL,
    is_market_price = FALSE,
    sort_order = 4
FROM public.categories c
WHERE p.category_id = c.id
  AND c.name_ar = 'السندوتشات'
  AND p.name_ar = 'سندوتش مكس';
