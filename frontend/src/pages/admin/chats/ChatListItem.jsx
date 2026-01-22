// src/components/ChatListItem.jsx
import React from "react";

const ChatListItem = ({ id, name, phone, lastMessage, lastMessageTime, unreadCount, onClick, isActive }) => {
  return (
    <div
      onClick={() => onClick?.({ id })}
      className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b border-border ${
        isActive ? "bg-muted/60" : "bg-transparent"
      } hover:bg-muted/40`}
    >
      {/* Avatar letter */}
      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
        {name ? name.split(" ").map(n => n[0]).slice(0,2).join("") : "U"}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground truncate">{name}</div>
          <div className="text-xs text-muted-foreground ml-2">{lastMessageTime}</div>
        </div>

        <div className="text-xs text-muted-foreground truncate">
          {phone ? phone + " · " : ""}{lastMessage ?? ""}
        </div>
      </div>

      {/* Unread badge */}
      <div className="ml-2">
        {unreadCount > 0 ? (
          <div className="min-w-[22px] h-6 flex items-center justify-center rounded-full bg-red-600 text-white text-xs px-2">
            {unreadCount}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground"> </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
