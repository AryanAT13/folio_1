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
    // /api/chat streams plain text, so let useChat read it as text. (Reading the body by hand
    // in onResponse locked the stream, which made useChat flag every reply as an error.)
    streamProtocol: "text",
    // Keep the user's message on screen if the request fails so they can retry.
    keepLastMessageOnError: true,
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
          // Full width minus a margin on small phones, 20rem otherwise; clear of the home indicator.
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 w-[calc(100vw-2rem)] max-w-80 rounded-md border bg-background sm:bottom-8 sm:right-8"
        >
          <AccordionTrigger className="border-b px-6">
            <ChatHeader />
          </AccordionTrigger>
          {/* Capped by the space left under the navbar (12rem = nav + chat header + margins), so it
              still fits on landscape phones / with the keyboard open. */}
          <AccordionContent className="flex max-h-[min(24rem,calc(100dvh-12rem))] min-h-[min(20rem,calc(100dvh-12rem))] flex-col justify-between p-0">
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