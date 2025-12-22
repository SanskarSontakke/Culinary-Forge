import { GoogleGenAI, Type } from "@google/genai";
import { Dish, PhotoStyle, ParseMenuResponse } from "../types";
import { STYLE_PROMPTS } from "../constants";

// Helper to ensure API key is selected for paid features
export const ensureApiKey = async (): Promise<boolean> => {
  const aistudio = (window as any).aistudio;
  if (aistudio && aistudio.hasSelectedApiKey && aistudio.openSelectKey) {
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await aistudio.openSelectKey();
      // We assume success if the dialog closes, but checking again is safer or just proceeding.
      // The guidance says: "assume the key selection was successful ... Do not add delay".
      return true;
    }
    return true;
  }
  return true; // Fallback for environments without the specific aistudio wrapper
};

const getAIClient = () => {
  // Always create a new client to pick up the potentially newly selected API key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const parseMenuText = async (text: string): Promise<Dish[]> => {
  const ai = getAIClient();
  
  // Using Gemini 2.5 Flash for text extraction
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Extract a list of dishes from the following menu text. Return a JSON object with a "dishes" array, where each item has "name" and "description". If no description is present, infer a brief one based on the name.
    
    Menu Text:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const jsonStr = response.text || "{}";
  try {
    const parsed = JSON.parse(jsonStr) as ParseMenuResponse;
    return parsed.dishes.map((d, index) => ({
      id: `${Date.now()}-${index}`,
      name: d.name,
      description: d.description
    }));
  } catch (e) {
    console.error("Failed to parse menu", e);
    return [];
  }
};

export const generateDishImage = async (
  dish: Dish, 
  style: PhotoStyle,
  customPrompt?: string
): Promise<string> => {
  // ensureApiKey() is typically required for Pro models. For flash-image, we rely on the default env key.
  const ai = getAIClient();

  let styleDescription = STYLE_PROMPTS[style];
  if (customPrompt && customPrompt.trim()) {
    styleDescription += ` ${customPrompt.trim()}`;
  }

  const prompt = `Professional food photography of ${dish.name}. ${dish.description}. 
  Style details: ${styleDescription}. 
  Ensure the food looks delicious, appetizing, and high-end. Ultra-realistic.`;

  // Using Gemini 2.5 Flash Image (free/lower tier) instead of Pro
  // Note: Removing imageConfig as the default aspect ratio is 1:1 and setting it explicitly
  // can sometimes cause RPC errors with the flash-image model in certain environments.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
};

export const editDishImage = async (
  imageBase64: string, 
  instruction: string
): Promise<string> => {
  const ai = getAIClient();

  // Using Gemini 2.5 Flash Image for editing (as requested: "Nano banana powered app")
  // Note: Standard Flash Image model is 'gemini-2.5-flash-image' ("nano banana")
  
  // Clean base64 string if it has prefix
  const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data
          }
        },
        {
          text: instruction
        }
      ]
    }
  });

   // Extract image
   for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to edit image");
};