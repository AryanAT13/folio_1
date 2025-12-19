"use client";

import { useChatbot } from "@/contexts/ChatContext";
import { BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleChatbot}
      className={cn(
        "relative rounded-full hover:bg-transparent", // Forces transparency
        "text-zinc-400 transition-colors hover:text-white", // Matches nav text
        isVisible && "text-white" // Highlights when active
      )}
    >
      <BotMessageSquare className="size-5" />
      <span className="sr-only">Toggle Chat</span>
    </Button>
  );
}