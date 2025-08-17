// src/pages/api/chatgpt5.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askChatGPT(
  messages: ChatGPTMessage[],
  model: string = "gpt-5-mini"
): Promise<string | undefined> {
  try {
    // Responses API; pro GPT-5 používej max_output_tokens
    const response = await openai.responses.create({
      model,
      input: messages.map(m => ({ role: m.role, content: m.content })),
      max_output_tokens: 700, // ~300–400 slov
      temperature: 0.7,
    });

    return response.output_text?.trim();
  } catch (error: any) {
    // volitelný fallback na 4.1-mini, pokud nemáš přístup k 5-mini
    if (model !== "gpt-4.1-mini") {
      try {
        const fallback = await openai.responses.create({
          model: "gpt-4.1-mini",
          input: messages.map(m => ({ role: m.role, content: m.content })),
          max_output_tokens: 700,
          temperature: 0.7,
        });
        return fallback.output_text?.trim();
      } catch {}
    }
    console.error("OpenAI API error:", error?.status, error?.message, error?.error);
    throw new Error(error?.message || "Chyba při komunikaci s ChatGPT API.");
  }
}
