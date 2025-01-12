export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_configurations: {
        Row: {
          audio_credits_cost: number | null
          created_at: string
          description: string | null
          id: string
          image_credits_cost: number | null
          is_active: boolean | null
          key_name: string
          updated_at: string
        }
        Insert: {
          audio_credits_cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_credits_cost?: number | null
          is_active?: boolean | null
          key_name: string
          updated_at?: string
        }
        Update: {
          audio_credits_cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_credits_cost?: number | null
          is_active?: boolean | null
          key_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      audio_stories: {
        Row: {
          audio_url: string
          created_at: string
          credits_used: number
          id: string
          story_id: string
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          credits_used?: number
          id?: string
          story_id: string
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          credits_used?: number
          id?: string
          story_id?: string
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      content_filters: {
        Row: {
          category: string
          created_at: string
          id: string
          updated_at: string
          word: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          updated_at?: string
          word: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          updated_at?: string
          word?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          name: string
          price: number
          stripe_price_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name: string
          price: number
          stripe_price_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name?: string
          price?: number
          stripe_price_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          subscription_level:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          action_steps: Json | null
          age_group: string
          author_id: string | null
          content: string
          created_at: string
          discussion_prompts: Json | null
          genre: string
          id: string
          image_prompt: string | null
          language: string | null
          length_preference: string | null
          moral: string
          poetic_style: Database["public"]["Enums"]["poetic_style_type"]
          reading_level: Database["public"]["Enums"]["reading_level_type"]
          reflection_questions: Json | null
          related_quote: string | null
          slug: string
          title: string
          tone: string | null
          updated_at: string
        }
        Insert: {
          action_steps?: Json | null
          age_group: string
          author_id?: string | null
          content: string
          created_at?: string
          discussion_prompts?: Json | null
          genre: string
          id?: string
          image_prompt?: string | null
          language?: string | null
          length_preference?: string | null
          moral: string
          poetic_style?: Database["public"]["Enums"]["poetic_style_type"]
          reading_level?: Database["public"]["Enums"]["reading_level_type"]
          reflection_questions?: Json | null
          related_quote?: string | null
          slug: string
          title: string
          tone?: string | null
          updated_at?: string
        }
        Update: {
          action_steps?: Json | null
          age_group?: string
          author_id?: string | null
          content?: string
          created_at?: string
          discussion_prompts?: Json | null
          genre?: string
          id?: string
          image_prompt?: string | null
          language?: string | null
          length_preference?: string | null
          moral?: string
          poetic_style?: Database["public"]["Enums"]["poetic_style_type"]
          reading_level?: Database["public"]["Enums"]["reading_level_type"]
          reflection_questions?: Json | null
          related_quote?: string | null
          slug?: string
          title?: string
          tone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      story_favorites: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_favorites_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_images: {
        Row: {
          created_at: string
          credits_used: number
          id: string
          image_url: string
          story_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_used?: number
          id?: string
          image_url: string
          story_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_used?: number
          id?: string
          image_url?: string
          story_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_pdfs: {
        Row: {
          created_at: string
          credits_used: number
          id: string
          pdf_url: string
          story_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_used?: number
          id?: string
          pdf_url: string
          story_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_used?: number
          id?: string
          pdf_url?: string
          story_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_pdfs_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          level: Database["public"]["Enums"]["subscription_level"]
          monthly_credits: number
          name: string
          price: number
          saved_stories_limit: number
          stripe_price_id: string | null
          stripe_yearly_price_id: string | null
          updated_at: string
          yearly_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          level: Database["public"]["Enums"]["subscription_level"]
          monthly_credits: number
          name: string
          price: number
          saved_stories_limit: number
          stripe_price_id?: string | null
          stripe_yearly_price_id?: string | null
          updated_at?: string
          yearly_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          level?: Database["public"]["Enums"]["subscription_level"]
          monthly_credits?: number
          name?: string
          price?: number
          saved_stories_limit?: number
          stripe_price_id?: string | null
          stripe_yearly_price_id?: string | null
          updated_at?: string
          yearly_price?: number
        }
        Relationships: []
      }
      user_story_counts: {
        Row: {
          created_at: string
          credits_used: number | null
          id: string
          month_year: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_used?: number | null
          id?: string
          month_year: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_used?: number | null
          id?: string
          month_year?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_details: {
        Row: {
          created_at: string | null
          credits_used: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
          subscription_level:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at: string | null
          upgrade_date: string | null
        }
        Insert: {
          created_at?: string | null
          credits_used?: never
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at?: string | null
          upgrade_date?: never
        }
        Update: {
          created_at?: string | null
          credits_used?: never
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at?: string | null
          upgrade_date?: never
        }
        Relationships: []
      }
      user_details_secure: {
        Row: {
          created_at: string | null
          credits_purchased: number | null
          credits_used: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
          renewal_date: string | null
          subscription_level:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          updated_at: string | null
          upgrade_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_user_details: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      poetic_style_type:
        | "prose"
        | "rhyming"
        | "haiku"
        | "limerick"
        | "free_verse"
        | "narrative_poem"
      reading_level_type:
        | "early_reader"
        | "beginner"
        | "intermediate"
        | "advanced"
        | "fluent"
      subscription_level:
        | "free"
        | "basic"
        | "premium"
        | "enterprise"
        | "lifetime"
        | "credits"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
