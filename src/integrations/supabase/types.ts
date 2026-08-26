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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      disputes: {
        Row: {
          created_at: string
          id: string
          order_id: string
          raiser_id: string
          reason: string
          resolution: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          raiser_id: string
          reason: string
          resolution?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          raiser_id?: string
          reason?: string
          resolution?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_raiser_id_fkey"
            columns: ["raiser_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          id: string
          minted_at: string
          post_id: string
          quality_score: number
          token_id: string | null
          tx_hash: string | null
          writer_id: string
        }
        Insert: {
          id?: string
          minted_at?: string
          post_id: string
          quality_score: number
          token_id?: string | null
          tx_hash?: string | null
          writer_id: string
        }
        Update: {
          id?: string
          minted_at?: string
          post_id?: string
          quality_score?: number
          token_id?: string | null
          tx_hash?: string | null
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nfts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          chain_purchase_id: number | null
          created_at: string
          escrow_release_at: string
          id: string
          price_word: number
          product_id: string
          seller_id: string
          status: string
          tx_hash: string | null
        }
        Insert: {
          buyer_id: string
          chain_purchase_id?: number | null
          created_at?: string
          escrow_release_at?: string
          id?: string
          price_word: number
          product_id: string
          seller_id: string
          status?: string
          tx_hash?: string | null
        }
        Update: {
          buyer_id?: string
          chain_purchase_id?: number | null
          created_at?: string
          escrow_release_at?: string
          id?: string
          price_word?: number
          product_id?: string
          seller_id?: string
          status?: string
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          ai_feedback: string | null
          authenticity_score: number | null
          category: string
          category_multiplier: number
          claim_available_at: string | null
          claim_tx: string | null
          claimed_at: string | null
          content: string
          created_at: string
          id: string
          originality_score: number | null
          quality_multiplier: number | null
          quality_score: number | null
          reward_amount: number | null
          status: string
          title: string
          word_count: number
          writer_id: string
        }
        Insert: {
          ai_feedback?: string | null
          authenticity_score?: number | null
          category: string
          category_multiplier?: number
          claim_available_at?: string | null
          claim_tx?: string | null
          claimed_at?: string | null
          content: string
          created_at?: string
          id?: string
          originality_score?: number | null
          quality_multiplier?: number | null
          quality_score?: number | null
          reward_amount?: number | null
          status?: string
          title: string
          word_count?: number
          writer_id: string
        }
        Update: {
          ai_feedback?: string | null
          authenticity_score?: number | null
          category?: string
          category_multiplier?: number
          claim_available_at?: string | null
          claim_tx?: string | null
          claimed_at?: string | null
          content?: string
          created_at?: string
          id?: string
          originality_score?: number | null
          quality_multiplier?: number | null
          quality_score?: number | null
          reward_amount?: number | null
          status?: string
          title?: string
          word_count?: number
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          chain_product_id: number | null
          cover_url: string | null
          created_at: string
          description: string
          id: string
          price_word: number
          seller_id: string
          status: string
          title: string
        }
        Insert: {
          category: string
          chain_product_id?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          price_word: number
          seller_id: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          chain_product_id?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          price_word?: number
          seller_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount: number
          created_at: string
          from_writer_id: string | null
          id: string
          to_writer_id: string
          tx_hash: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          from_writer_id?: string | null
          id?: string
          to_writer_id: string
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          from_writer_id?: string | null
          id?: string
          to_writer_id?: string
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tips_from_writer_id_fkey"
            columns: ["from_writer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_to_writer_id_fkey"
            columns: ["to_writer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_nonces: {
        Row: {
          created_at: string
          nonce: string
          used: boolean
          wallet_address: string
        }
        Insert: {
          created_at?: string
          nonce: string
          used?: boolean
          wallet_address: string
        }
        Update: {
          created_at?: string
          nonce?: string
          used?: boolean
          wallet_address?: string
        }
        Relationships: []
      }
      wallet_sessions: {
        Row: {
          created_at: string
          expires_at: string
          token: string
          wallet_address: string
          writer_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          token: string
          wallet_address: string
          writer_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          token?: string
          wallet_address?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_sessions_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "writers"
            referencedColumns: ["id"]
          },
        ]
      }
      writers: {
        Row: {
          approved_posts: number
          avatar_url: string | null
          bio: string
          created_at: string
          id: string
          name: string
          niches: string[]
          tier: string
          total_earned: number
          wallet_address: string
        }
        Insert: {
          approved_posts?: number
          avatar_url?: string | null
          bio?: string
          created_at?: string
          id?: string
          name: string
          niches?: string[]
          tier?: string
          total_earned?: number
          wallet_address: string
        }
        Update: {
          approved_posts?: number
          avatar_url?: string | null
          bio?: string
          created_at?: string
          id?: string
          name?: string
          niches?: string[]
          tier?: string
          total_earned?: number
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
