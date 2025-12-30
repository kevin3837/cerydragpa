
export enum AppTab {
  IMAGE_WORKSHOP = 'image',
  VIDEO_STUDIO = 'video',
  GALLERY = 'gallery',
  PROFILE = 'profile',
  PLANNING = 'planning'
}

export interface GenerationItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
  isFavorite: boolean;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserProfile {
  name: string;
  isVip: boolean;
  credits: number;
  avatar: string;
}

export interface PromptOptimizationResult {
  refinedPrompt: string;
  elements: {
    subject: string;
    style: string;
    lighting: string;
    composition: string;
  };
}
