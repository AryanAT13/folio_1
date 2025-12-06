import { useChatbot } from "@/contexts/ChatContext";
import { useChat } from "ai/react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
    // ✅ THE FIX: Manual Reader to handle Raw Text
    onResponse: (response) => {
      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        // 1. Create a placeholder message for Ellie's response
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", content: "" },
        ]);

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) return;

            // Decode the raw chunk
            const chunk = decoder.decode(value, { stream: true });

            // 2. Append the new text to the LAST message (Ellie's bubble)
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              // Ensure we are modifying the assistant's message
              if (lastMsg && lastMsg.role === "assistant") {
                return [
                  ...prev.slice(0, -1), // Keep all previous messages
                  { ...lastMsg, content: lastMsg.content + chunk }, // Update the last one
                ];
              }
              return prev;
            });

            // Keep reading the next chunk
            read();
          }).catch((err) => console.error("Stream read error:", err));
        };
        
        // Start the loop
        read();
      }
    },
    onError: (e) => {
      console.error("Chat error:", e);
    },
  });

  const { isVisible } = useChatbot();

  return (
    isVisible && (
      <Accordion type="single" collapsible className="flex relative z-40">
        <AccordionItem
          value="item-1"
          className="fixed bottom-8 right-8 w-80 rounded-md border bg-background"
        >
          <AccordionTrigger className="border-b px-6">
            <ChatHeader />
          </AccordionTrigger>
          <AccordionContent className="flex max-h-96 min-h-80 flex-col justify-between p-0">
            <ChatMessages
              messages={messages}
              error={error}
              isLoading={isLoading}
            />
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              setMessages={setMessages}
              isLoading={isLoading}
              messages={messages}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
}