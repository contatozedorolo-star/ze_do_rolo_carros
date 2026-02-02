-- Create enum for user trust levels
CREATE TYPE public.user_level AS ENUM ('bronze', 'prata', 'ouro', 'diamante');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for urgency levels
CREATE TYPE public.urgency_level AS ENUM ('baixa', 'media', 'alta', 'emergencial');

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('veiculos', 'eletronicos', 'moveis', 'eletrodomesticos', 'moda', 'esportes', 'outros');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  user_level user_level DEFAULT 'bronze',
  pix_key TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table (for admin access - security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category product_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_estimate NUMERIC NOT NULL,
  min_price_accepted NUMERIC,
  is_for_sale BOOLEAN DEFAULT TRUE,
  accepts_trade BOOLEAN DEFAULT TRUE,
  urgency_level urgency_level DEFAULT 'baixa',
  rating_motor INTEGER CHECK (rating_motor >= 0 AND rating_motor <= 5),
  rating_exterior INTEGER CHECK (rating_exterior >= 0 AND rating_exterior <= 5),
  rating_function INTEGER CHECK (rating_function >= 0 AND rating_function <= 5),
  rating_interior INTEGER CHECK (rating_interior >= 0 AND rating_interior <= 5),
  rating_documents INTEGER CHECK (rating_documents >= 0 AND rating_documents <= 5),
  declared_defects TEXT,
  location TEXT,
  is_certified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL,
  is_video BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
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

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles RLS policies (only admins can manage roles)
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products RLS policies
CREATE POLICY "Anyone can view products for sale" ON public.products
  FOR SELECT USING (is_for_sale = TRUE OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Product images RLS policies
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own product images" ON public.product_images
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.products WHERE id = product_id)
  );

CREATE POLICY "Users can delete own product images" ON public.product_images
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.products WHERE id = product_id)
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_whatsapp, cpf)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone_whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'cpf', '')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);