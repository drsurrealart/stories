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
          kids_story_credits_cost: number | null
          pdf_credits_cost: number | null
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
          kids_story_credits_cost?: number | null
          pdf_credits_cost?: number | null
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
          kids_story_credits_cost?: number | null
          pdf_credits_cost?: number | null
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
      feature_settings: {
        Row: {
          created_at: string
          feature_type: Database["public"]["Enums"]["feature_type"]
          id: string
          is_active: boolean | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_type: Database["public"]["Enums"]["feature_type"]
          id?: string
          is_active?: boolean | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_type?: Database["public"]["Enums"]["feature_type"]
          id?: string
          is_active?: boolean | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          updated_at?: string
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
          aspect_ratio: string
          created_at: string
          credits_used: number
          id: string
          image_url: string
          story_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          aspect_ratio?: string
          created_at?: string
          credits_used?: number
          id?: string
          image_url: string
          story_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          aspect_ratio?: string
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
      story_translations: {
        Row: {
          created_at: string
          credits_used: number
          id: string
          language: string
          original_story_id: string
          translated_story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          id?: string
          language: string
          original_story_id: string
          translated_story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          id?: string
          language?: string
          original_story_id?: string
          translated_story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_translations_original_story_id_fkey"
            columns: ["original_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_translations_translated_story_id_fkey"
            columns: ["translated_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_videos: {
        Row: {
          aspect_ratio: Database["public"]["Enums"]["video_aspect_ratio"]
          created_at: string
          credits_used: number
          id: string
          processing_method:
            | Database["public"]["Enums"]["video_processing_method"]
            | null
          story_id: string
          updated_at: string
          user_id: string
          video_url: string
        }
        Insert: {
          aspect_ratio: Database["public"]["Enums"]["video_aspect_ratio"]
          created_at?: string
          credits_used?: number
          id?: string
          processing_method?:
            | Database["public"]["Enums"]["video_processing_method"]
            | null
          story_id: string
          updated_at?: string
          user_id: string
          video_url: string
        }
        Update: {
          aspect_ratio?: Database["public"]["Enums"]["video_aspect_ratio"]
          created_at?: string
          credits_used?: number
          id?: string
          processing_method?:
            | Database["public"]["Enums"]["video_processing_method"]
            | null
          story_id?: string
          updated_at?: string
          user_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_videos_story_id_fkey"
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
      user_sub_profiles: {
        Row: {
          age: number
          created_at: string
          ethnicity: string | null
          gender: string | null
          hair_color: string | null
          id: string
          interests: string[] | null
          name: string
          type: Database["public"]["Enums"]["profile_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          ethnicity?: string | null
          gender?: string | null
          hair_color?: string | null
          id?: string
          interests?: string[] | null
          name: string
          type: Database["public"]["Enums"]["profile_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          ethnicity?: string | null
          gender?: string | null
          hair_color?: string | null
          id?: string
          interests?: string[] | null
          name?: string
          type?: Database["public"]["Enums"]["profile_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_preferences: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_sub_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_samples: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          voice_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          id?: string
          voice_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          id?: string
          voice_id?: string
        }
        Relationships: []
      }
      watermark_settings: {
        Row: {
          content_type: Database["public"]["Enums"]["watermark_content_type"]
          created_at: string
          id: string
          is_active: boolean | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          updated_at: string
          watermark_template_id: string | null
        }
        Insert: {
          content_type: Database["public"]["Enums"]["watermark_content_type"]
          created_at?: string
          id?: string
          is_active?: boolean | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          updated_at?: string
          watermark_template_id?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["watermark_content_type"]
          created_at?: string
          id?: string
          is_active?: boolean | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          updated_at?: string
          watermark_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watermark_settings_watermark_template_id_fkey"
            columns: ["watermark_template_id"]
            isOneToOne: false
            referencedRelation: "watermark_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      watermark_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_default: boolean | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
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
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      feature_type:
        | "text_story"
        | "audio_story"
        | "story_image"
        | "story_video"
        | "story_pdf"
        | "story_translation"
        | "story_favorite"
        | "story_share"
      poetic_style_type:
        | "prose"
        | "rhyming"
        | "haiku"
        | "limerick"
        | "free_verse"
        | "narrative_poem"
      profile_type: "family" | "student"
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
      video_aspect_ratio: "16:9" | "9:16"
      video_processing_method: "ffmpeg" | "moviepy"
      watermark_content_type:
        | "text_story"
        | "audio_story"
        | "story_image"
        | "story_video"
        | "story_pdf"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feature_type: [
        "text_story",
        "audio_story",
        "story_image",
        "story_video",
        "story_pdf",
        "story_translation",
        "story_favorite",
        "story_share",
      ],
      poetic_style_type: [
        "prose",
        "rhyming",
        "haiku",
        "limerick",
        "free_verse",
        "narrative_poem",
      ],
      profile_type: ["family", "student"],
      reading_level_type: [
        "early_reader",
        "beginner",
        "intermediate",
        "advanced",
        "fluent",
      ],
      subscription_level: [
        "free",
        "basic",
        "premium",
        "enterprise",
        "lifetime",
        "credits",
      ],
      video_aspect_ratio: ["16:9", "9:16"],
      video_processing_method: ["ffmpeg", "moviepy"],
      watermark_content_type: [
        "text_story",
        "audio_story",
        "story_image",
        "story_video",
        "story_pdf",
      ],
    },
  },
} as const
