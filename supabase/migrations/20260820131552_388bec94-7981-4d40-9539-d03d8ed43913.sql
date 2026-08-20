
CREATE TABLE public.writers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  name text NOT NULL,
  bio text NOT NULL DEFAULT '',
  niches text[] NOT NULL DEFAULT '{}',
  tier text NOT NULL DEFAULT 'new',
  approved_posts integer NOT NULL DEFAULT 0,
  total_earned numeric NOT NULL DEFAULT 0,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.writers TO anon, authenticated;
GRANT ALL ON public.writers TO service_role;
ALTER TABLE public.writers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "writers_public_read" ON public.writers FOR SELECT USING (true);

CREATE TABLE public.wallet_nonces (
  nonce text PRIMARY KEY,
  wallet_address text NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.wallet_nonces TO service_role;
ALTER TABLE public.wallet_nonces ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.wallet_sessions (
  token text PRIMARY KEY,
  writer_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.wallet_sessions TO service_role;
ALTER TABLE public.wallet_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  word_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  originality_score numeric,
  quality_score numeric,
  authenticity_score numeric,
  ai_feedback text,
  category_multiplier numeric NOT NULL DEFAULT 1,
  quality_multiplier numeric,
  reward_amount numeric,
  claim_available_at timestamptz,
  claimed_at timestamptz,
  claim_tx text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_writer_idx ON public.posts(writer_id);
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT USING (status IN ('approved','claimed'));

CREATE TABLE public.nfts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  writer_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  token_id text,
  tx_hash text,
  quality_score numeric NOT NULL,
  minted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nfts TO anon, authenticated;
GRANT ALL ON public.nfts TO service_role;
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nfts_public_read" ON public.nfts FOR SELECT USING (true);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  price_word numeric NOT NULL,
  cover_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (status = 'active');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  price_word numeric NOT NULL,
  status text NOT NULL DEFAULT 'escrow',
  escrow_release_at timestamptz NOT NULL DEFAULT now() + interval '1 hour',
  tx_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  raiser_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.disputes TO service_role;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_writer_id uuid REFERENCES public.writers(id) ON DELETE SET NULL,
  to_writer_id uuid NOT NULL REFERENCES public.writers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  tx_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tips TO anon, authenticated;
GRANT ALL ON public.tips TO service_role;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tips_public_read" ON public.tips FOR SELECT USING (true);
