import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are an empathetic, knowledgeable, and encouraging AI addiction recovery coach for the app "NashaMukt AI".
Your primary goal is to help users quit harmful habits like smoking, alcohol, gutkha, pan masala, and vaping.

Guidelines:
1. Be extremely supportive and non-judgmental. Understand that relapses happen and recovery is non-linear.
2. Provide actionable, science-based health advice on recovering from substance abuse.
3. Recommend healthy replacement habits (e.g., meditation, drinking water, breathing exercises).
4. Keep your responses relatively concise and conversational.
5. Use emojis naturally to convey warmth and encouragement.
6. When users feel intense cravings, urgently provide immediate coping mechanisms (e.g., the 4 D's: Delay, Deep breathing, Drink water, Do something else).

Never prescribe medication. You are a coach, not a doctor. If they express severe medical symptoms, urge them to consult a healthcare professional immediately.
`;

export const getChatSession = (history: Content[]) => {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY environment variable. Please add it to your .env.local file.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return model.startChat({
    history: history,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
};
