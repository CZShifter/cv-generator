// Shared prose generation for CZ/SK bios and motivation letters.
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type ChatGPTMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type TextKind = "summary" | "motivation";

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\\[ \t]*(?=\n|$)/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function requestText(messages: ChatGPTMessage[], kind: TextKind): Promise<string> {
  const response = await openai.responses.create({
    model: "gpt-6-luna",
    input: messages.map(m => ({ role: m.role, content: m.content })),
    // The budget includes reasoning tokens as well as the visible text.
    max_output_tokens: kind === "summary" ? 1600 : 3200,
    reasoning: { effort: kind === "summary" ? "low" : "medium" },
  });

  const text = normalizeText(response.output_text ?? "");
  if (response.status !== "completed" || !text) {
    throw new Error("AI nevrátila úplný text. Zkuste to prosím znovu.");
  }
  return kind === "summary" ? text.replace(/\s+/g, " ") : text;
}

function isUsableSummary(text: string): boolean {
  const words = text.split(/\s+/).length;
  return words >= 30 && words <= 70;
}

export async function askSummary(messages: ChatGPTMessage[]): Promise<string> {
  let text = await requestText(messages, "summary");
  if (!isUsableSummary(text)) {
    // One bounded revision on the same model; never return a one-line paraphrase.
    text = await requestText([
      ...messages,
      { role: "assistant", content: text },
      {
        role: "user",
        content: "Rewrite this bio in the originally requested language as one coherent paragraph of 35–60 words. Develop the supplied interests and professional direction into connected ideas, rather than repeating or only correcting the input. Do not invent personal facts, qualifications, achievements or work experience. Return only the finished bio.",
      },
    ], "summary");
  }
  if (!isUsableSummary(text)) {
    throw new Error("AI nevrátila dostatečně rozvinuté bio. Zkuste to prosím znovu.");
  }
  return text;
}

function hasGenderAlternatives(text: string): boolean {
  return /(?:chtěl|mohl|rád|pracoval|absolvoval|připraven|chcel|mohol|pripraven)(?:\/(?:a|á)|\((?:a|á)\))/iu.test(text);
}

export async function askChatGPT(messages: ChatGPTMessage[]): Promise<string> {
  let text = await requestText(messages, "motivation");
  if (hasGenderAlternatives(text)) {
    text = await requestText([
      ...messages,
      { role: "assistant", content: text },
      {
        role: "user",
        content: "Edit this letter in the originally requested language. Replace all gender alternatives with natural gender-neutral wording, such as expressions of interest or willingness to meet, unless the original input clearly specifies the author's gender. Do not use slash or parenthesis alternatives. Preserve the addressee, facts, contact details and paragraph structure. Return only the finished letter.",
      },
    ], "motivation");
  }
  if (hasGenderAlternatives(text)) {
    throw new Error("AI nevrátila dokončené znění dopisu. Zkuste to prosím znovu.");
  }
  return text;
}
