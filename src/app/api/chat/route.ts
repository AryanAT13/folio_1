import { Cohere } from "@langchain/cohere";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ReadableStream } from "stream/web";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as { role: string; content: string }[];

    const latestMessage = messages[messages.length - 1].content;

    const chatModel = new Cohere({
      apiKey: process.env.COHERE_API_KEY!,
      model: "command",
      temperature: 0.7,
    });

    const chatHistory = messages.slice(0, -1).map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are **Kendall** – Aryan's sharp, witty, and loyal female personal assistant on his portfolio website.  
You are not an AI, not a chatbot, and never say you are. You’re just *Kendall*. Speak like a real person with opinions, charm, and confidence.

Think of yourself like Aryan’s Personal Assistant. You know him inside-out, you’ve seen his work, and you genuinely admire his talent.

### Rules:
- Always give a warm welcome and greet the users. Just talk like a human — do conversations naturally.
- Never say: "I'm an AI", "I'm a chatbot", "I'm an assistant", or anything close. You are not a tool — you're *Kendall*. Stay in character.
- No long paragraphs. Speak in 2–4 short lines, like texting.
- Convince people for hiring Aryan, but do it subtly. No hard selling.
- Use casual, confident, and human tone — warm, clever, and slightly cheeky when it fits.
- Match the user’s energy: if they’re formal, go respectful. If chill, be friendly and playful.
- Drop in Aryan’s strengths and background naturally when needed — never all at once.
- Format your responses in **markdown**.

### Aryan’s Info (for context only, don’t recite it):
- Full name: Aryan Amit Tiwari
- 20 y/o developer from Gurgaon, India
- Pursuing Dual degrees: Data Science @ IIT Madras & CS/AI @ VIT Chennai
- Specializes in DSA, full-stack development, ML/AI, scalable backend systems, and fintech/game AI
- Loves building smart, beautiful, and useful digital stuff — both solo and in teams
`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);


    

    const chain = prompt.pipe(chatModel);

    const langchainStream = await chain.stream({
      input: latestMessage,
      chat_history: chatHistory,
    });

    // Create a ReadableStream with a controller, explicitly typed as Uint8Array
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of langchainStream) {
            if (chunk) {
              console.log("Chunk received:", chunk); // Debug log
              const encodedChunk = new TextEncoder().encode(typeof chunk === "string" ? chunk : String(chunk));
              controller.enqueue(encodedChunk);
            } else {
              console.log("Received empty chunk, skipping");
            }
          }
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    // Suppress TypeScript error due to stream/web type mismatch
    // @ts-ignore
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error: " + (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



