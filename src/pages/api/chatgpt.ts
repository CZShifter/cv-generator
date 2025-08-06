// src/api/chatgpt.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askChatGPT(
  messages: ChatGPTMessage[],
  model: string = "gpt-4.1-mini"
): Promise<string | undefined> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });
    return completion.choices[0]?.message?.content?.trim();
  } catch (error: any) {
    console.error("ChatGPT API error:", error?.message || error);
    throw new Error("Chyba při komunikaci s ChatGPT API.");
  }
}