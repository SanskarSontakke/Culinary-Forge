import { PhotoStyle } from './types';

export const STYLE_PROMPTS: Record<PhotoStyle, string> = {
  'Rustic/Dark': 'Professional food photography, rustic style, dark moody lighting, wooden table background, high contrast, rich textures, 85mm lens, shallow depth of field, chiaroscuro.',
  'Bright/Modern': 'Professional food photography, bright and airy, modern minimalism, white marble background, soft natural lighting, clean composition, commercial look, high key.',
  'Social Media': 'Professional food photography, flat lay, top-down view, vibrant colors, social media aesthetic, harsh shadows, pop art style, trendy plating, high saturation.'
};

export const INITIAL_MENU_PLACEHOLDER = `Starters:
- Truffle Arancini: Crispy risotto balls infused with black truffle oil, served with garlic aioli.
- Burrata Salad: Fresh burrata cheese with heirloom tomatoes, basil pesto, and balsamic glaze.

Mains:
- Pan-Seared Scallops: Jumbo scallops with cauliflower purée, crispy pancetta, and lemon butter sauce.
- Wagyu Beef Burger: Brioche bun, aged cheddar, caramelized onions, and truffle fries.`;
