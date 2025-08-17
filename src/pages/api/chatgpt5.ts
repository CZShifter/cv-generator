// src/pages/api/chatgpt.ts
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
  model: string = "gpt-5-mini"
): Promise<string | undefined> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 6000,
      temperature: 0.7,
    });
    return completion.choices[0]?.message?.content?.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      //console.error("ChatGPT API error:", error.message);
    } else {
      //console.error("Unknown ChatGPT API error:", error);
    }
    throw new Error("Chyba při komunikaci s ChatGPT API.");
  }
}