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
  messages: ChatGPTMessage[]
): Promise<string | undefined> {
  try {
    // Responses API používá max_output_tokens.
    const response = await openai.responses.create({
      model: "gpt-6-luna",
      input: messages.map(m => ({ role: m.role, content: m.content })),
      max_output_tokens: 1600, // Rezerva pro celý dopis v češtině i slovenštině.
      reasoning: { effort: "low" },
    });

    const text = response.output_text?.trim();
    if (response.status !== "completed" || !text) {
      throw new Error("AI nevrátila úplný text. Zkuste to prosím znovu.");
    }
    return text;
  } catch (error: unknown) {
    if (isAPIErrorLike(error)) {
      //console.error("OpenAI API error:", error.status, error.message, error.error);
      throw new Error(error.message || "Chyba při komunikaci s ChatGPT API.");
    }

    //console.error("Unknown OpenAI API error:", error);
    throw new Error("Chyba při komunikaci s ChatGPT API.");
  }
}
