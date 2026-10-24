import { Message } from "ai";
import { Bot, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

// useChat surfaces the response body as the error message; /api/chat sends { error: "..." }.
function getErrorMessage(error: Error) {
  try {
    const parsed = JSON.parse(error.message);
    if (typeof parsed?.error === "string") return parsed.error;
  } catch {}
  return "Ellie couldn't reply. Please try again.";
}

interface ChatMessagesProps {
  messages: Message[];
  error: Error | undefined;
  isLoading: boolean;
}

export default function ChatMessages({
  messages,
  error,
  isLoading,
}: ChatMessagesProps) {
  const isLastMessageUser = messages[messages.length - 1]?.role === "user";

  // Scroll to new messages automatically
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-3" ref={scrollRef}>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <ChatMessage message={msg} />
          </li>
        ))}
      </ul>

      {/* empty */}
      {!error && messages.length === 0 && (
        <div className="mt-16 flex h-full flex-col items-center justify-center gap-2">
          <Bot />
          <p className="font-medium">Ask Ellie anything about me, she&apos;ll help!</p>
          <p className="text-center text-xs text-muted-foreground">
          Ellie might lose it after a few ques, yeah...Free API.
          </p>
        </div>
      )}

      {/* loading */}
      {isLoading && isLastMessageUser && (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-1.5 size-3 animate-spin text-muted-foreground" />
          <p className="text-center text-xs text-muted-foreground">
            Thinking...
          </p>
        </div>
      )}

      {/* error */}
      {error && (
        <p className="text-center text-xs text-rose-500">
          {getErrorMessage(error)}
        </p>
      )}
    </div>
  );
}
