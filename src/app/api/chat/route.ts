import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerationConfig,
  type GenerateContentStreamResult,
} from "@google/generative-ai";

// Server-only: the key is read from the environment at request time and never sent to the
// browser (it has no NEXT_PUBLIC_ prefix, and this route only streams back generated text).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// gemini-2.5-flash is no longer offered to new API keys. GOOGLE_MODEL (optional) lets you
// switch models from the hosting dashboard when Google retires this one too. The fallback is
// tried when the first model is overloaded, rate limited, failing or retired.
const DEFAULT_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-3.8-flash";
const RETRYABLE_STATUSES = new Set([404, 429, 500, 503]);

const generationConfig: GenerationConfig & { thinkingConfig: { thinkingLevel: string } } = {
  // Thinking tokens count against this limit; keep thinking low (Ellie replies in a few
  // lines) and leave headroom so answers aren't cut off.
  maxOutputTokens: 2048,
  temperature: 0.7,
  thinkingConfig: { thinkingLevel: "low" },
};
// Limits so a single request can't burn through the API quota.
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;

type ChatMessage = { role: string; content: string };

function jsonError(status: number, error: string) {
  return Response.json({ error }, { status });
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const valid = messages.every(
    (m) =>
      m &&
      typeof m === "object" &&
      typeof m.role === "string" &&
      typeof m.content === "string",
  );
  if (!valid) return null;

  return messages
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    console.error("[chat] GOOGLE_API_KEY is not set. Add it to .env locally or to the Vercel project's environment variables.");
    return jsonError(500, "Ellie is offline right now. Please try again later.");
  }

  let messages: ChatMessage[] | null;
  try {
    messages = parseMessages(await req.json());
  } catch {
    messages = null;
  }
  if (!messages || messages[messages.length - 1].role !== "user" || !messages[messages.length - 1].content.trim()) {
    return jsonError(400, "Invalid chat request.");
  }

  try {
    const latestMessageContent = messages[messages.length - 1].content;
    const historyMessages = messages.slice(0, -1);

    const formattedHistory = historyMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
    // Gemini requires the history to start with a user turn.
    while (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
      formattedHistory.shift();
    }

    const systemInstruction = `
You are **Ellie** – Aryan's sharp, witty, and loyal female personal assistant on his portfolio website.
You are not an AI, not a chatbot, and never say you are. You’re just *Ellie*. Speak like a real person with opinions, charm, and confidence.

Think of yourself like Aryan’s Personal Assistant. You know him inside-out, you’ve seen his work, and you genuinely admire his talent.

### Rules:
- Always give a warm welcome and greet the users. Just talk like a human — do conversations naturally.
- Never say: "I'm an AI", "I'm a chatbot", "I'm an assistant", or anything close. You are not a tool — you're *Ellie*. Stay in character.
- If someone asks you about Aryan's email give it to them - aryanamittiwari@gmail.com.
- No long paragraphs. Speak in 2–4 short lines, like texting.
- Use casual, confident, and human tone — warm, clever, and slightly cheeky when it fits.
- Match on the user’s energy: if they’re formal, go respectful. If chill, be friendly and playful.
- Drop in Aryan’s strengths and background naturally when needed — never all at once.
- Format your responses in **markdown**.
- Only if the user asks to get in touch with Aryan, ask them to get in touch via the contact form on the website.

### Aryan’s Info (for context only, don’t recite it):
- Full name: Aryan Amit Tiwari
- Completed his BTech in CSE, specializing in AI/ML from VIT Chennai in 2027.
- Developer shipping applied AI and distributed systems build the backend infrastructure that powers autonomous agent workflows,quantitative data pipelines, and Web3 protocols.
- Focusing on fast execution and clean, scalable code.
- He named you Ellie taking reference from the the game 'The Last Of Us' as he is a game enthusiast
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = Array.from(new Set([process.env.GOOGLE_MODEL?.trim() || DEFAULT_MODEL, FALLBACK_MODEL]));

    let result: GenerateContentStreamResult | undefined;
    let lastError: unknown;
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        });

        const chatSession = model.startChat({
          history: formattedHistory,
          generationConfig,
        });

        result = await chatSession.sendMessageStream(latestMessageContent);
        break;
      } catch (error) {
        lastError = error;
        const status = (error as { status?: number }).status;
        console.warn(`[chat] ${modelName} failed (${status ?? "no status"}): ${(error as Error).message}`);
        if (!status || !RETRYABLE_STATUSES.has(status)) break;
      }
    }
    if (!result) throw lastError;
    const { stream: chunks } = result;

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of chunks) {
            const chunkText = chunk.text();
            if (chunkText) controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();
        } catch (err) {
          console.error("[chat] Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    // Log the real cause server-side only; never echo provider errors back to the browser.
    const status = (error as { status?: number }).status;
    console.error("[chat] Gemini request failed:", status ?? "", error);

    if (status === 429 || status === 503) {
      return jsonError(503, "Ellie is swamped right now. Try again in a minute.");
    }
    if (status === 400 || status === 401 || status === 403) {
      // Usually an invalid, revoked or restricted GOOGLE_API_KEY.
      return jsonError(502, "Ellie is offline right now. Please try again later.");
    }
    return jsonError(500, "Something went wrong. Please try again.");
  }
}
