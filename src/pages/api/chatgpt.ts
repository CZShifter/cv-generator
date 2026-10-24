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
  messages: ChatGPTMessage[]
): Promise<string | undefined> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-6-luna",
      messages,
      max_completion_tokens: 600,
      reasoning_effort: "none",
      temperature: 0.5,
    });
    const choice = completion.choices[0];
    const text = choice?.message?.content?.trim();
    if (choice?.finish_reason !== "stop" || !text) {
      throw new Error("AI nevrátila úplný text. Zkuste to prosím znovu.");
    }
    return text;
  } catch (error: unknown) {
    if (error instanceof Error) {
      //console.error("ChatGPT API error:", error.message);
    } else {
      //console.error("Unknown ChatGPT API error:", error);
    }
    throw new Error("Chyba při komunikaci s ChatGPT API.");
  }
}