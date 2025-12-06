import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ReadableStream } from "stream/web";

// Initialize the Google Client
// ✅ Using your working key
const genAI = new GoogleGenerativeAI("AIzaSyCLSd7EVa3HFSH-UuPE0bgSb05QJutBn7g");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as { role: string; content: string }[];

    // 1. Separate the latest message from the history
    const latestMessageContent = messages[messages.length - 1].content;
    const historyMessages = messages.slice(0, -1);

    // 2. Format history for Google SDK (User = 'user', Assistant = 'model')
    // Google SDK requires the role to be strictly 'user' or 'model'
    const formattedHistory = historyMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 3. Define the System Prompt (Ellie's Persona)
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
- 20 y/o developer from Gurgaon, India
- Pursuing Dual degrees: Data Science @ IIT Madras & CS/AI @ VIT Chennai
- Specializes in DSA, full-stack development, ML/AI, scalable backend systems, and fintech/game AI
- Loves building smart, beautiful, and useful digital stuff — both solo and in teams
- He named you Ellie taking reference from the the game 'The Last Of Us' as he is a game enthusiast
    `;

    // 4. Initialize the Model with 2.5 Pro
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro", 
      systemInstruction: systemInstruction,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    // 5. Start the Chat Session with History
    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        // We can optionally add thinkingBudget here if we want to disable reasoning, 
        // but the SDK handles reasoning chunks gracefully, unlike LangChain.
      },
    });

    // 6. Send Message and Get Stream
    const result = await chatSession.sendMessageStream(latestMessageContent);

    // 7. Stream the response back to the client
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          console.log("--- GOOGLE STREAM STARTED ---");
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              // console.log("✅ Chunk:", chunkText.substring(0, 10) + "...");
              const encodedChunk = new TextEncoder().encode(chunkText);
              controller.enqueue(encodedChunk);
            }
          }
          console.log("--- GOOGLE STREAM FINISHED ---");
          controller.close();
        } catch (err) {
          console.error("❌ Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream as any, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}