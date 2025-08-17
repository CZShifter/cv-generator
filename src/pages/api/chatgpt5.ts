// src/pages/api/chatgpt5.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type APIErrorLike = {
  status?: number;
  message?: string;
  error?: unknown;
};

function isAPIErrorLike(e: unknown): e is APIErrorLike {
  return typeof e === "object" && e !== null && (
    "message" in e || "status" in e || "error" in e
  );
}

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
  } catch (error: unknown) {
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
      } catch (fallbackErr: unknown) {
        // zaloguj i selhání fallbacku
        if (isAPIErrorLike(fallbackErr)) {
          //console.error("OpenAI fallback API error:", fallbackErr.status, fallbackErr.message, fallbackErr.error);
        } else {
          //console.error("Unknown fallback error:", fallbackErr);
        }
      }
    }

    if (isAPIErrorLike(error)) {
      //console.error("OpenAI API error:", error.status, error.message, error.error);
      throw new Error(error.message || "Chyba při komunikaci s ChatGPT API.");
    }

    //console.error("Unknown OpenAI API error:", error);
    throw new Error("Chyba při komunikaci s ChatGPT API.");
  }
}
