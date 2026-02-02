export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verifications: {
        Row: {
          created_at: string
          document_back_url: string | null
          document_front_url: string | null
          document_number: string
          document_type: string
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_back_url?: string | null
          document_front_url?: string | null
          document_number: string
          document_type: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_back_url?: string | null
          document_front_url?: string | null
          document_number?: string
          document_type?: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          proposal_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          proposal_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          proposal_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          cpf: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          id: string
          message: string | null
          offer_amount: number | null
          proposer_id: string
          seller_id: string
          status: Database["public"]["Enums"]["proposal_status"]
          trade_plus_amount: number | null
          trade_vehicle_id: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          offer_amount?: number | null
          proposer_id: string
          seller_id: string
          status?: Database["public"]["Enums"]["proposal_status"]
          trade_plus_amount?: number | null
          trade_vehicle_id?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          offer_amount?: number | null
          proposer_id?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          trade_plus_amount?: number | null
          trade_vehicle_id?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_trade_vehicle_id_fkey"
            columns: ["trade_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          created_at: string
          id: string
          image_type: string
          image_url: string
          is_primary: boolean
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_type: string
          image_url: string
          is_primary?: boolean
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_type?: string
          image_url?: string
          is_primary?: boolean
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          vehicle_id: string
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          vehicle_id: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          vehicle_id?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          accepts_trade: boolean
          auction_reason: string | null
          body_type: string | null
          brake_type: string | null
          brand: string
          bus_optionals: string[] | null
          bus_subcategory: string | null
          city: string | null
          color: string
          created_at: string
          cylinders: number | null
          description: string | null
          diagnostic_notes: string | null
          doors: number | null
          engine: string | null
          engine_liters: number | null
          fuel: Database["public"]["Enums"]["fuel_type"]
          fuel_system: string | null
          has_service_history: boolean | null
          has_warranty: boolean | null
          has_ze_seal: boolean
          id: string
          ideal_trade_description: string | null
          insurance_coverage_percent: number | null
          insurance_covers_100: string | null
          ipva_paid: boolean | null
          is_active: boolean
          is_armored: boolean | null
          is_auction: boolean | null
          is_chassis_remarked: boolean | null
          is_featured: boolean
          is_financed: boolean | null
          is_single_owner: boolean | null
          is_sold: boolean
          km: number
          max_cash_return: number | null
          min_cash_return: number | null
          model: string
          moderation_status:
            | Database["public"]["Enums"]["vehicle_moderation_status"]
            | null
          moto_optionals: string[] | null
          moto_style: string | null
          motor_type: string | null
          need_type: string[] | null
          optionals: string[] | null
          ownership_time: string | null
          photo_checklist: Json | null
          plate: string | null
          plate_end: string | null
          price: number
          rating_cambio: number | null
          rating_documentacao: number | null
          rating_eletrica: number | null
          rating_estetica: number | null
          rating_freios: number | null
          rating_interior: number | null
          rating_lataria: number | null
          rating_mecanica_geral: number | null
          rating_motor: number | null
          rating_pneus: number | null
          rating_suspensao: number | null
          seats: number | null
          start_type: string | null
          state: string | null
          title: string
          trade_description: string | null
          trade_priority: string | null
          trade_restrictions: string[] | null
          trade_value_accepted: number | null
          transmission: Database["public"]["Enums"]["transmission_type"]
          truck_body: string | null
          truck_cabin: string | null
          truck_traction: string | null
          truck_type: string | null
          updated_at: string
          user_id: string
          van_subcategory: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          version: string | null
          year_manufacture: number
          year_model: number
        }
        Insert: {
          accepts_trade?: boolean
          auction_reason?: string | null
          body_type?: string | null
          brake_type?: string | null
          brand: string
          bus_optionals?: string[] | null
          bus_subcategory?: string | null
          city?: string | null
          color: string
          created_at?: string
          cylinders?: number | null
          description?: string | null
          diagnostic_notes?: string | null
          doors?: number | null
          engine?: string | null
          engine_liters?: number | null
          fuel?: Database["public"]["Enums"]["fuel_type"]
          fuel_system?: string | null
          has_service_history?: boolean | null
          has_warranty?: boolean | null
          has_ze_seal?: boolean
          id?: string
          ideal_trade_description?: string | null
          insurance_coverage_percent?: number | null
          insurance_covers_100?: string | null
          ipva_paid?: boolean | null
          is_active?: boolean
          is_armored?: boolean | null
          is_auction?: boolean | null
          is_chassis_remarked?: boolean | null
          is_featured?: boolean
          is_financed?: boolean | null
          is_single_owner?: boolean | null
          is_sold?: boolean
          km?: number
          max_cash_return?: number | null
          min_cash_return?: number | null
          model: string
          moderation_status?:
            | Database["public"]["Enums"]["vehicle_moderation_status"]
            | null
          moto_optionals?: string[] | null
          moto_style?: string | null
          motor_type?: string | null
          need_type?: string[] | null
          optionals?: string[] | null
          ownership_time?: string | null
          photo_checklist?: Json | null
          plate?: string | null
          plate_end?: string | null
          price: number
          rating_cambio?: number | null
          rating_documentacao?: number | null
          rating_eletrica?: number | null
          rating_estetica?: number | null
          rating_freios?: number | null
          rating_interior?: number | null
          rating_lataria?: number | null
          rating_mecanica_geral?: number | null
          rating_motor?: number | null
          rating_pneus?: number | null
          rating_suspensao?: number | null
          seats?: number | null
          start_type?: string | null
          state?: string | null
          title: string
          trade_description?: string | null
          trade_priority?: string | null
          trade_restrictions?: string[] | null
          trade_value_accepted?: number | null
          transmission?: Database["public"]["Enums"]["transmission_type"]
          truck_body?: string | null
          truck_cabin?: string | null
          truck_traction?: string | null
          truck_type?: string | null
          updated_at?: string
          user_id: string
          van_subcategory?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          version?: string | null
          year_manufacture: number
          year_model: number
        }
        Update: {
          accepts_trade?: boolean
          auction_reason?: string | null
          body_type?: string | null
          brake_type?: string | null
          brand?: string
          bus_optionals?: string[] | null
          bus_subcategory?: string | null
          city?: string | null
          color?: string
          created_at?: string
          cylinders?: number | null
          description?: string | null
          diagnostic_notes?: string | null
          doors?: number | null
          engine?: string | null
          engine_liters?: number | null
          fuel?: Database["public"]["Enums"]["fuel_type"]
          fuel_system?: string | null
          has_service_history?: boolean | null
          has_warranty?: boolean | null
          has_ze_seal?: boolean
          id?: string
          ideal_trade_description?: string | null
          insurance_coverage_percent?: number | null
          insurance_covers_100?: string | null
          ipva_paid?: boolean | null
          is_active?: boolean
          is_armored?: boolean | null
          is_auction?: boolean | null
          is_chassis_remarked?: boolean | null
          is_featured?: boolean
          is_financed?: boolean | null
          is_single_owner?: boolean | null
          is_sold?: boolean
          km?: number
          max_cash_return?: number | null
          min_cash_return?: number | null
          model?: string
          moderation_status?:
            | Database["public"]["Enums"]["vehicle_moderation_status"]
            | null
          moto_optionals?: string[] | null
          moto_style?: string | null
          motor_type?: string | null
          need_type?: string[] | null
          optionals?: string[] | null
          ownership_time?: string | null
          photo_checklist?: Json | null
          plate?: string | null
          plate_end?: string | null
          price?: number
          rating_cambio?: number | null
          rating_documentacao?: number | null
          rating_eletrica?: number | null
          rating_estetica?: number | null
          rating_freios?: number | null
          rating_interior?: number | null
          rating_lataria?: number | null
          rating_mecanica_geral?: number | null
          rating_motor?: number | null
          rating_pneus?: number | null
          rating_suspensao?: number | null
          seats?: number | null
          start_type?: string | null
          state?: string | null
          title?: string
          trade_description?: string | null
          trade_priority?: string | null
          trade_restrictions?: string[] | null
          trade_value_accepted?: number | null
          transmission?: Database["public"]["Enums"]["transmission_type"]
          truck_body?: string | null
          truck_cabin?: string | null
          truck_traction?: string | null
          truck_type?: string | null
          updated_at?: string
          user_id?: string
          van_subcategory?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          version?: string | null
          year_manufacture?: number
          year_model?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_approved_kyc: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      body_type_enum:
        | "suv"
        | "sedan"
        | "hatch"
        | "pickup"
        | "coupe"
        | "conversivel"
        | "wagon"
        | "minivan"
      fuel_type:
        | "gasolina"
        | "etanol"
        | "flex"
        | "diesel"
        | "eletrico"
        | "hibrido"
        | "gnv"
      kyc_status: "pending" | "approved" | "rejected" | "under_review"
      moto_style_enum:
        | "custom"
        | "esportiva"
        | "naked"
        | "scooter"
        | "trail"
        | "touring"
        | "street"
        | "cross"
        | "ciclomotor"
        | "eletrica"
        | "quadriciclo"
        | "supermotard"
        | "big_trail"
        | "trial"
        | "triciclo"
        | "utilitaria"
      proposal_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "counter"
        | "cancelled"
      transmission_type: "manual" | "automatico" | "cvt" | "semi-automatico"
      truck_type_enum:
        | "3_4"
        | "toco"
        | "truck"
        | "bitruck"
        | "cavalo_mecanico"
        | "vuc"
      vehicle_moderation_status: "pending" | "approved" | "rejected"
      vehicle_type:
        | "carro"
        | "caminhao"
        | "moto"
        | "camionete"
        | "van"
        | "onibus"
        | "trator"
        | "implemento"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      body_type_enum: [
        "suv",
        "sedan",
        "hatch",
        "pickup",
        "coupe",
        "conversivel",
        "wagon",
        "minivan",
      ],
      fuel_type: [
        "gasolina",
        "etanol",
        "flex",
        "diesel",
        "eletrico",
        "hibrido",
        "gnv",
      ],
      kyc_status: ["pending", "approved", "rejected", "under_review"],
      moto_style_enum: [
        "custom",
        "esportiva",
        "naked",
        "scooter",
        "trail",
        "touring",
        "street",
        "cross",
        "ciclomotor",
        "eletrica",
        "quadriciclo",
        "supermotard",
        "big_trail",
        "trial",
        "triciclo",
        "utilitaria",
      ],
      proposal_status: [
        "pending",
        "accepted",
        "rejected",
        "counter",
        "cancelled",
      ],
      transmission_type: ["manual", "automatico", "cvt", "semi-automatico"],
      truck_type_enum: [
        "3_4",
        "toco",
        "truck",
        "bitruck",
        "cavalo_mecanico",
        "vuc",
      ],
      vehicle_moderation_status: ["pending", "approved", "rejected"],
      vehicle_type: [
        "carro",
        "caminhao",
        "moto",
        "camionete",
        "van",
        "onibus",
        "trator",
        "implemento",
      ],
    },
  },
} as const
