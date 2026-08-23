ALTER TABLE public.products ADD COLUMN IF NOT EXISTS chain_product_id BIGINT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chain_purchase_id BIGINT;