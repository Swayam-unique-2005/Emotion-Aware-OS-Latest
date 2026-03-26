import { GoogleGenAI } from "@google/genai";
import { Mood } from '../types';

export const analyzeMood = async (imageBase64: string): Promise<Mood | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains the header
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analyze the facial expression. If NO human face is clearly visible, or if the face is too dark/obscured, return strictly 'No Face'. Otherwise, classify the emotion as: 'Happy', 'Sad', or 'Angry'. Return ONLY the single word."
          }
        ]
      }
    });

    const text = response.text?.trim();
    console.log("Gemini Raw Response:", text);

    if (text) {
        if (text.toLowerCase().includes('no face')) return null; // Explicitly return null for no face
        if (text.toLowerCase().includes('happy')) return 'Happy';
        if (text.toLowerCase().includes('sad')) return 'Sad';
        if (text.toLowerCase().includes('angry')) return 'Angry';
    }
    
    // Default fallback if unclear
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Don't throw, just return null so the UI can show "No Face" or "Error" without crashing
    return null;
  }
};

export const getAssistantResponse = async (prompt: string, currentMood: Mood): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Customize system persona based on mood
    let systemInstruction = "You are a helpful mobile OS assistant.";
    if (currentMood === 'Happy') systemInstruction += " The user is happy! Be energetic, use emojis, and keep answers brief and fun.";
    if (currentMood === 'Sad') systemInstruction += " The user is sad. Be empathetic, soft-spoken, comforting, and helpful.";
    if (currentMood === 'Angry') systemInstruction += " The user is angry. Be efficient, direct, calm, and solve problems quickly without fluff.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 100,
      }
    });

    return response.text || "I'm having trouble connecting right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I can't reach the cloud right now.";
  }
}