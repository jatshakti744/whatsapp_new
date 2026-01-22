import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ClientListItem = ({
  name,
  phone,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isActive = false,
  assignedTo,
  onClick
}) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
        isActive 
          ? "bg-primary/10 border border-primary/20 shadow-soft" 
          : "hover:bg-muted/50 hover:translate-x-1 border border-transparent"
      )}
    >
      <div className="relative">
        <Avatar className="w-12 h-12 ring-2 ring-background group-hover:ring-primary/20 transition-all">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold border border-primary/20">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-status-online border-2 border-card rounded-full shadow-medium" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn(
            "font-semibold truncate transition-colors",
            isActive ? "text-primary" : "text-foreground"
          )}>{name}</h4>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2 font-medium">
            {lastMessageTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mb-1">{lastMessage}</p>
        {assignedTo && (
          <Badge variant="secondary" className="mt-1 text-xs shadow-soft">
            {assignedTo}
          </Badge>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 shadow-glow animate-pulse-soft">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </div>
  );
};

export default ClientListItem;

