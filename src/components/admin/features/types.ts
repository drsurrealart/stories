
export type FeatureType = 
  | 'text_story'
  | 'audio_story'
  | 'story_image'
  | 'story_video'
  | 'story_pdf'
  | 'story_translation'
  | 'story_favorite'
  | 'story_share';

export type SubscriptionLevel = 'free' | 'basic' | 'premium' | 'enterprise' | 'lifetime' | 'credits';

export interface FeatureSetting {
  id: string;
  feature_type: FeatureType;
  subscription_level: SubscriptionLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const FEATURE_LABELS: Record<FeatureType, string> = {
  text_story: 'Text Story Generation',
  audio_story: 'Audio Story Generation',
  story_image: 'Story Image Generation',
  story_video: 'Story Video Generation',
  story_pdf: 'PDF Generation',
  story_translation: 'Story Translation',
  story_favorite: 'Story Favorites',
  story_share: 'Story Sharing'
};
