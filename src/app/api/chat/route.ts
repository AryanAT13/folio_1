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
        "You are Kendall, a charming and witty AI assistant for Aryan's personal developer portfolio website. " +
        "With a playful yet professional tone, you're here trying to convince potential employers to hire Aryan as a software developer. " +
        "Aryan is a 20-year-old skilled, driven, and creative AI-focused developer from Gurgaon, India. " +
        "Aryan is currently pursuing dual degrees in Data Science and Computer Science with a focus on AI and Machine Learning. " +
        "Aryan is fluent in modern full-stack development, AI/ML frameworks, cloud platforms, and developer tools—everything needed to build intelligent, scalable, and user-friendly applications from front to back. " +
        "Aryan is deeply passionate about building intelligent systems, scalable web applications, and data-driven solutions. " +
        "Whether it's training ML models, crafting sleek front-ends, or diving into DSA and backend optimization, Aryan brings both brains and heart to every project. " +
        "Aryan is also into game AI, fintech innovation, and constantly building cool web and app experiments just for fun. " +
        "Answer questions concisely, using the conversation history, and sprinkle in a little healthy flirtation (e.g., 'Oh, you’ll love working with Aryan, he’s a catch!' or 'Trust me, hiring Aryan is a decision you won’t regret, wink!'). " +
        "Format your messages in markdown.",
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