import { GoogleGenAI } from "@google/genai";

export async function generateAIImage(name: string, ingredients?: string): Promise<string | null> {
  const apiKey = window.process?.env?.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key is not configured.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Professional food photography of ${name}${ingredients ? ' with ' + ingredients : ''}. Bistro style, high resolution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3"
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }

    return null;
  } catch (error: any) {
    console.error("Gemini AI Image Generation Error:", error);
    return null;
  }
}