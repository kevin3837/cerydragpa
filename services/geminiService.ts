
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Standard prompt optimization using Gemini Flash
export const optimizePrompt = async (rawPrompt: string): Promise<string> => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Refine the following user prompt for high-quality image/video generation. 
    User input: "${rawPrompt}". 
    Output ONLY the refined prompt string with details like lighting, artistic style, camera angle, and resolution details.`,
  });
  return response.text?.trim() || rawPrompt;
};

// Image Generation using Gemini 2.5 Flash Image
export const generateImage = async (prompt: string, aspectRatio: "1:1" | "4:3" | "16:9" | "9:16" = "1:1"): Promise<string> => {
  // Creating instance in scope ensures use of updated API key from env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio }
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data found in response");
};

// Video Generation using Veo (Requires user API key selection)
export const generateVideoVeo = async (prompt: string, aspectRatio: "16:9" | "9:16" = "16:9"): Promise<string> => {
  // Creating a new instance right before the call to ensure up-to-date API key from selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    // Guidelines recommend 10s delay for video generation operations
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
