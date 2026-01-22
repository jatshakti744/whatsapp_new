import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

const ChatMessage = ({
  content,
  timestamp,
  isOwn,
  status = "sent",
  senderName,
  isEdited = false
}) => {
  return (
    <div className={cn("flex mb-4 animate-fade-in", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-soft",
          isOwn
            ? "bg-gradient-to-br from-chat-user to-chat-user/90 text-chat-user-foreground rounded-br-md"
            : "bg-chat-other text-chat-other-foreground rounded-bl-md border border-border/50"
        )}
      >
        {senderName && !isOwn && (
          <p className="text-xs font-semibold text-primary mb-1">{senderName}</p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1",
          isOwn ? "text-chat-user-foreground/70" : "text-muted-foreground"
        )}>
          {isEdited && <span className="text-[10px]">edited</span>}
          <span className="text-[10px]">{timestamp}</span>
          {isOwn && (
            <span className="ml-0.5">
              {status === "read" ? (
                <CheckCheck className="w-3.5 h-3.5 text-info" />
              ) : status === "delivered" ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

