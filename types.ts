export interface Dish {
  id: string;
  name: string;
  description: string;
  generatedImage?: string;
  isGenerating?: boolean;
}

export type PhotoStyle = 'Rustic/Dark' | 'Bright/Modern' | 'Social Media';

export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

export interface ParseMenuResponse {
  dishes: { name: string; description: string }[];
}