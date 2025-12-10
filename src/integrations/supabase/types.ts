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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          proposal_id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          proposal_id: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          proposal_id?: string
          receiver_id?: string
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
      product_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_type: string
          image_url: string
          is_video: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type: string
          image_url: string
          is_video?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type?: string
          image_url?: string
          is_video?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accepts_trade: boolean | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          declared_defects: string | null
          description: string | null
          id: string
          is_certified: boolean | null
          is_for_sale: boolean | null
          location: string | null
          min_price_accepted: number | null
          price_estimate: number
          rating_documents: number | null
          rating_exterior: number | null
          rating_function: number | null
          rating_interior: number | null
          rating_motor: number | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"] | null
          user_id: string
        }
        Insert: {
          accepts_trade?: boolean | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          declared_defects?: string | null
          description?: string | null
          id?: string
          is_certified?: boolean | null
          is_for_sale?: boolean | null
          location?: string | null
          min_price_accepted?: number | null
          price_estimate: number
          rating_documents?: number | null
          rating_exterior?: number | null
          rating_function?: number | null
          rating_interior?: number | null
          rating_motor?: number | null
          title: string
          updated_at?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          user_id: string
        }
        Update: {
          accepts_trade?: boolean | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          declared_defects?: string | null
          description?: string | null
          id?: string
          is_certified?: boolean | null
          is_for_sale?: boolean | null
          location?: string | null
          min_price_accepted?: number | null
          price_estimate?: number
          rating_documents?: number | null
          rating_exterior?: number | null
          rating_function?: number | null
          rating_interior?: number | null
          rating_motor?: number | null
          title?: string
          updated_at?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          name: string
          phone_whatsapp: string
          pix_key: string | null
          updated_at: string | null
          user_level: Database["public"]["Enums"]["user_level"] | null
        }
        Insert: {
          avatar_url?: string | null
          cpf: string
          created_at?: string | null
          email: string
          id: string
          is_verified?: boolean | null
          name: string
          phone_whatsapp: string
          pix_key?: string | null
          updated_at?: string | null
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          name?: string
          phone_whatsapp?: string
          pix_key?: string | null
          updated_at?: string | null
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          cash_amount: number
          created_at: string
          id: string
          include_trade: boolean | null
          message: string | null
          product_id: string
          proposer_id: string
          seller_id: string
          status: Database["public"]["Enums"]["proposal_status"]
          trade_items: string | null
          updated_at: string
        }
        Insert: {
          cash_amount?: number
          created_at?: string
          id?: string
          include_trade?: boolean | null
          message?: string | null
          product_id: string
          proposer_id: string
          seller_id: string
          status?: Database["public"]["Enums"]["proposal_status"]
          trade_items?: string | null
          updated_at?: string
        }
        Update: {
          cash_amount?: number
          created_at?: string
          id?: string
          include_trade?: boolean | null
          message?: string | null
          product_id?: string
          proposer_id?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          trade_items?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      product_category:
        | "veiculos"
        | "eletronicos"
        | "moveis"
        | "eletrodomesticos"
        | "moda"
        | "esportes"
        | "outros"
      proposal_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "counter"
        | "cancelled"
      urgency_level: "baixa" | "media" | "alta" | "emergencial"
      user_level: "bronze" | "prata" | "ouro" | "diamante"
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
      app_role: ["admin", "user"],
      product_category: [
        "veiculos",
        "eletronicos",
        "moveis",
        "eletrodomesticos",
        "moda",
        "esportes",
        "outros",
      ],
      proposal_status: [
        "pending",
        "accepted",
        "rejected",
        "counter",
        "cancelled",
      ],
      urgency_level: ["baixa", "media", "alta", "emergencial"],
      user_level: ["bronze", "prata", "ouro", "diamante"],
    },
  },
} as const
