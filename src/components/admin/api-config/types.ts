
export interface APIConfig {
  id: string;
  key_name: string;
  description: string | null;
  is_active: boolean;
  kids_story_credits_cost: number | null;
  image_generation_provider?: string;
}

export type APICategory = {
  label: string;
  keys: readonly string[];
};

export const API_CATEGORIES: Record<string, APICategory> = {
  payments: {
    label: "Payments",
    keys: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
  },
  textGeneration: {
    label: "Text Generation",
    keys: ["OPENAI_API_KEY"],
  },
  imageGeneration: {
    label: "Image Generation",
    keys: ["RUNWARE_API_KEY"],
  },
  credits: {
    label: "Credits & Usage",
    keys: ["AUDIO_STORY_CREDITS", "IMAGE_STORY_CREDITS", "PDF_STORY_CREDITS"],
  },
} as const;

export const API_KEYS = [
  {
    key: "OPENAI_API_KEY",
    description: "API key for OpenAI services",
  },
  {
    key: "STRIPE_SECRET_KEY",
    description: "Secret key for Stripe payment processing",
  },
  {
    key: "STRIPE_PUBLISHABLE_KEY",
    description: "Publishable key for Stripe payment processing",
  },
  {
    key: "RUNWARE_API_KEY",
    description: "API key for Runware.ai image generation service",
  },
] as const;

