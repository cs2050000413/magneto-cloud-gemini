import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMagnetStory = async (magnetTitle: string, location: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a whimsical, short story (max 100 words) about a magical refrigerator magnet depicting "${magnetTitle}" in "${location}". make it sound cozy and artistic.`,
    });
    return response.text || "The magnet hums with a mysterious energy, but no story appears today.";
  } catch (error) {
    console.error("Error generating story:", error);
    return "Could not conjure a story at this moment. Try again later.";
  }
};

export const identifyMagnetFromImage = async (base64Image: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    // Clean base64 string if needed
    const data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: "Identify if this image looks like a hand-painted souvenir magnet. If it looks like a landscape, food, or animal magnet, describe it in 3 words. If not, say 'Not a magnet'.",
          },
        ],
      },
    });
    return response.text || null;
  } catch (error) {
    console.error("Error identifying image:", error);
    return null;
  }
};