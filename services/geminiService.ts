
import { GoogleGenAI } from "@google/genai";
import { AgeGroup } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generate3DCharacter = async (
  imageBase64: string, 
  age: AgeGroup
): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = `Transform the person in this image into a premium, extremely adorable 3D character in the style of high-end animation studios like Pixar or Disney.

  CORE REQUIREMENTS:
  1. FULL BODY VIEW: Render the character from head to toe. Ensure the entire body silhouette is visible.
  2. CHARACTER STYLE: Extremely adorable, soft rounded shapes, pastel colors, oversized eyes, chibi-like proportions. High-end toy aesthetic.
  3. AGE APPEARANCE: Target age looks like a ${age}.
  4. VISUAL FIDELITY: 4K resolution rendering, professional studio lighting, subsurface scattering on skin for a soft glow, and high-detail fabric textures.
  5. COMPOSITION: Center the character with generous padding (safe margins) from all edges. No part of the character should be cropped.
  6. BACKGROUND: A clean, simple, and slightly blurry aesthetic background that complements the character's colors.

  Keep the original person's key features (hair color, skin tone, general facial structure) but translate them into this highly stylized 3D toy/animation aesthetic. Make it look professional and 'collectible' like a high-quality figurine.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('Image generation failed - no parts returned.');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No image data found in the AI response.');
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
