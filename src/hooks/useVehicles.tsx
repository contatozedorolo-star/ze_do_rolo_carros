import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Database } from "@/integrations/supabase/types";

export type Vehicle = Tables<"vehicles">;
export type VehicleImage = Tables<"vehicle_images">;
export type VehicleType = Database["public"]["Enums"]["vehicle_type"];
export type TransmissionType = Database["public"]["Enums"]["transmission_type"];
export type FuelType = Database["public"]["Enums"]["fuel_type"];

export interface VehicleWithImages extends Vehicle {
  vehicle_images: VehicleImage[];
  primary_image?: string;
}

export interface VehicleFilters {
  category?: VehicleType;
  brand?: string[];
  state?: string;
  city?: string;
  searchTerm?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMax?: number;
  transmission?: TransmissionType[];
  fuel?: FuelType[];
  acceptsTrade?: boolean;
  ipvaPaid?: boolean;
  singleOwner?: boolean;
}

export interface UseVehiclesOptions {
  filters?: VehicleFilters;
  sortBy?: "created_at" | "price" | "year_model" | "km";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export const useVehicles = (options: UseVehiclesOptions = {}) => {
  const {
    filters = {},
    sortBy = "created_at",
    sortOrder = "desc",
    limit = 50,
  } = options;

  return useQuery({
    queryKey: ["vehicles", filters, sortBy, sortOrder, limit],
    queryFn: async (): Promise<VehicleWithImages[]> => {
      let query = supabase
        .from("vehicles")
        .select(`
          *,
          vehicle_images (*)
        `)
        .eq("is_active", true)
        .eq("is_sold", false)
        .order(sortBy, { ascending: sortOrder === "asc" })
        .limit(limit);

      // Apply filters
      if (filters.category) {
        query = query.eq("vehicle_type", filters.category);
      }

      if (filters.brand && filters.brand.length > 0) {
        query = query.in("brand", filters.brand);
      }

      if (filters.state) {
        query = query.eq("state", filters.state);
      }

      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }

      if (filters.searchTerm) {
        query = query.or(
          `title.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%,model.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.priceMin !== undefined) {
        query = query.gte("price", filters.priceMin);
      }

      if (filters.priceMax !== undefined) {
        query = query.lte("price", filters.priceMax);
      }

      if (filters.yearMin !== undefined) {
        query = query.gte("year_model", filters.yearMin);
      }

      if (filters.yearMax !== undefined) {
        query = query.lte("year_model", filters.yearMax);
      }

      if (filters.kmMax !== undefined) {
        query = query.lte("km", filters.kmMax);
      }

      if (filters.transmission && filters.transmission.length > 0) {
        query = query.in("transmission", filters.transmission);
      }

      if (filters.fuel && filters.fuel.length > 0) {
        query = query.in("fuel", filters.fuel);
      }

      if (filters.acceptsTrade) {
        query = query.eq("accepts_trade", true);
      }

      if (filters.ipvaPaid) {
        query = query.eq("ipva_paid", true);
      }

      if (filters.singleOwner) {
        query = query.eq("is_single_owner", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching vehicles:", error);
        throw error;
      }

      // Process to add primary_image
      return (data || []).map((vehicle) => {
        const images = vehicle.vehicle_images || [];
        const primaryImage = images.find((img: VehicleImage) => img.is_primary)?.image_url 
          || images[0]?.image_url 
          || "/placeholder.svg";
        
        return {
          ...vehicle,
          primary_image: primaryImage,
        };
      });
    },
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
};

export const useVehicleById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async (): Promise<VehicleWithImages | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          vehicle_images (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching vehicle:", error);
        return null;
      }

      if (!data) return null;

      const images = data.vehicle_images || [];
      const primaryImage = images.find((img: VehicleImage) => img.is_primary)?.image_url 
        || images[0]?.image_url 
        || "/placeholder.svg";

      return {
        ...data,
        primary_image: primaryImage,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook to get unique brands for filters
export const useVehicleBrands = (vehicleType?: VehicleType) => {
  return useQuery({
    queryKey: ["vehicle-brands", vehicleType],
    queryFn: async (): Promise<string[]> => {
      let query = supabase
        .from("vehicles")
        .select("brand")
        .eq("is_active", true)
        .eq("is_sold", false);

      if (vehicleType) {
        query = query.eq("vehicle_type", vehicleType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching brands:", error);
        return [];
      }

      const brands = [...new Set((data || []).map(v => v.brand))].filter(Boolean).sort();
      return brands;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};

// Hook to get vehicle count
export const useVehicleCount = (filters?: VehicleFilters) => {
  return useQuery({
    queryKey: ["vehicle-count", filters],
    queryFn: async (): Promise<number> => {
      let query = supabase
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("is_sold", false);

      if (filters?.category) {
        query = query.eq("vehicle_type", filters.category);
      }

      if (filters?.state) {
        query = query.eq("state", filters.state);
      }

      if (filters?.searchTerm) {
        query = query.or(
          `title.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%,model.ilike.%${filters.searchTerm}%`
        );
      }

      const { count, error } = await query;

      if (error) {
        console.error("Error fetching count:", error);
        return 0;
      }

      return count || 0;
    },
    staleTime: 1000 * 60 * 2,
  });
};
