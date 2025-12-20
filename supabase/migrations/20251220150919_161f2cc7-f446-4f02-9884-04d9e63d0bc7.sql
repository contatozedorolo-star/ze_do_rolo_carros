
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for vehicle types
CREATE TYPE public.vehicle_type AS ENUM ('carro', 'caminhao', 'moto', 'camionete', 'van');

-- Create enum for transmission types
CREATE TYPE public.transmission_type AS ENUM ('manual', 'automatico', 'cvt', 'semi-automatico');

-- Create enum for fuel types
CREATE TYPE public.fuel_type AS ENUM ('gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido', 'gnv');

-- Create enum for proposal status
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'counter', 'cancelled');

-- Create enum for kyc status
CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  cpf TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- =====================
-- USER ROLES TABLE
-- =====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- VEHICLES TABLE
-- =====================
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  vehicle_type vehicle_type NOT NULL DEFAULT 'carro',
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year_manufacture INTEGER NOT NULL,
  year_model INTEGER NOT NULL,
  
  -- Technical info
  plate TEXT,
  plate_end TEXT,
  km INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL,
  transmission transmission_type NOT NULL DEFAULT 'manual',
  fuel fuel_type NOT NULL DEFAULT 'flex',
  doors INTEGER,
  engine TEXT,
  
  -- Pricing
  price DECIMAL(12,2) NOT NULL,
  accepts_trade BOOLEAN NOT NULL DEFAULT false,
  trade_description TEXT,
  
  -- Diagnostic ratings (1-5)
  rating_motor INTEGER CHECK (rating_motor >= 1 AND rating_motor <= 5),
  rating_lataria INTEGER CHECK (rating_lataria >= 1 AND rating_lataria <= 5),
  rating_pneus INTEGER CHECK (rating_pneus >= 1 AND rating_pneus <= 5),
  rating_interior INTEGER CHECK (rating_interior >= 1 AND rating_interior <= 5),
  rating_documentacao INTEGER CHECK (rating_documentacao >= 1 AND rating_documentacao <= 5),
  diagnostic_notes TEXT,
  
  -- Optionals (stored as JSON array)
  optionals TEXT[],
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_sold BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  has_ze_seal BOOLEAN NOT NULL DEFAULT false,
  
  -- Location
  city TEXT,
  state TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vehicles"
  ON public.vehicles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert their own vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all vehicles"
  ON public.vehicles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- VEHICLE IMAGES TABLE
-- =====================
CREATE TABLE public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL, -- frente, traseira, lateral_esquerda, lateral_direita, interior, painel
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle images"
  ON public.vehicle_images FOR SELECT
  USING (true);

CREATE POLICY "Vehicle owners can manage images"
  ON public.vehicle_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = vehicle_images.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- =====================
-- PROPOSALS TABLE
-- =====================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Proposal details
  offer_amount DECIMAL(12,2),
  trade_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  trade_plus_amount DECIMAL(12,2),
  message TEXT,
  
  -- Status
  status proposal_status NOT NULL DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their proposals"
  ON public.proposals FOR SELECT
  TO authenticated
  USING (auth.uid() = proposer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create proposals"
  ON public.proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Involved users can update proposals"
  ON public.proposals FOR UPDATE
  TO authenticated
  USING (auth.uid() = proposer_id OR auth.uid() = seller_id);

-- =====================
-- MESSAGES TABLE
-- =====================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Proposal participants can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals
      WHERE proposals.id = messages.proposal_id
      AND (proposals.proposer_id = auth.uid() OR proposals.seller_id = auth.uid())
    )
  );

CREATE POLICY "Proposal participants can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.proposals
      WHERE proposals.id = proposal_id
      AND (proposals.proposer_id = auth.uid() OR proposals.seller_id = auth.uid())
    )
  );

-- =====================
-- KYC VERIFICATIONS TABLE
-- =====================
CREATE TABLE public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Documents
  document_type TEXT NOT NULL, -- cpf, cnpj
  document_number TEXT NOT NULL,
  document_front_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  
  -- Status
  status kyc_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own kyc"
  ON public.kyc_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit kyc"
  ON public.kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending kyc"
  ON public.kyc_verifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all kyc"
  ON public.kyc_verifications FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- FAVORITES TABLE
-- =====================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, vehicle_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites"
  ON public.favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================
-- TRIGGERS FOR UPDATED_AT
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX idx_vehicles_model ON public.vehicles(model);
CREATE INDEX idx_vehicles_year ON public.vehicles(year_model);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);
CREATE INDEX idx_vehicles_type ON public.vehicles(vehicle_type);
CREATE INDEX idx_vehicles_active ON public.vehicles(is_active);
CREATE INDEX idx_proposals_vehicle ON public.proposals(vehicle_id);
CREATE INDEX idx_proposals_proposer ON public.proposals(proposer_id);
CREATE INDEX idx_proposals_seller ON public.proposals(seller_id);
CREATE INDEX idx_messages_proposal ON public.messages(proposal_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
