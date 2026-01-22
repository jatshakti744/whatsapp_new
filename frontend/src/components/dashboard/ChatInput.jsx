import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile } from "lucide-react";

const ChatInput = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground">
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none pr-10 bg-muted/50"
            disabled={disabled}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 bottom-1 text-muted-foreground"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        <Button 
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;

