// src/pages/admin/AllChats.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ChatListItem from "./ChatListItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockClients = [
  { id: 1, name: "StartUp Ventures", phone: "+1987654324", lastMessage: "Can someone help us with onboarding?", lastMessageTime: "1y", unreadCount: 0 },
  { id: 2, name: "Finance Pro Services", phone: "+1987654328", lastMessage: "Hello, we are interested in your services.", lastMessageTime: "1y", unreadCount: 1 },
  { id: 3, name: "Acme Corporation", phone: "+1987654321", lastMessage: "We need to discuss the new pricing plan...", lastMessageTime: "1y", unreadCount: 3 },
  // add more...
];

const AllChats = () => {
  const navigate = useNavigate();
  const [clients] = useState(mockClients);
  const [query, setQuery] = useState("");

  const filtered = clients.filter(c =>
    (c.name + " " + c.phone + " " + (c.lastMessage || "")).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout title="All Chats">
      <div className="w-full h-full flex flex-col bg-card border-border">
        <div className="p-4 border-b">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filtered.map(client => (
              <ChatListItem
                key={client.id}
                {...client}
                onClick={() => navigate(`/chat/${client.id}`)}
              />
            ))}
            {filtered.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">No conversations</div>}
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
};

export default AllChats;
