import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClientListItem from "@/components/dashboard/ClientListItem";
import ChatMessage from "@/components/dashboard/ChatMessage";
import ChatInput from "@/components/dashboard/ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockClients = [
  { id: 1, name: "John Smith", phone: "+1 234 567 890", lastMessage: "Thanks for your help!", lastMessageTime: "2m ago", unreadCount: 2, assignedTo: "Alice Cooper" },
  { id: 2, name: "Sarah Johnson", phone: "+1 234 567 891", lastMessage: "When will my order arrive?", lastMessageTime: "15m ago", unreadCount: 0, assignedTo: "Bob Martin" },
  { id: 3, name: "Mike Wilson", phone: "+1 234 567 892", lastMessage: "I need to reschedule", lastMessageTime: "1h ago", unreadCount: 1, assignedTo: "Alice Cooper" },
  { id: 4, name: "Emily Davis", phone: "+1 234 567 893", lastMessage: "Perfect, thank you!", lastMessageTime: "2h ago", unreadCount: 0, assignedTo: "Carol White" },
  { id: 5, name: "David Brown", phone: "+1 234 567 894", lastMessage: "Is this still available?", lastMessageTime: "3h ago", unreadCount: 3 },
];

const mockMessages = [
  { id: 1, content: "Hi, I'm interested in your product", timestamp: "10:30 AM", isOwn: false },
  { id: 2, content: "Hello! Thanks for reaching out. Which product are you interested in?", timestamp: "10:32 AM", isOwn: true, status: "read" },
  { id: 3, content: "The premium package. Can you tell me more about the features?", timestamp: "10:35 AM", isOwn: false },
  { id: 4, content: "Of course! The premium package includes:\n\n• Unlimited messages\n• Priority support\n• Advanced analytics\n• Custom integrations\n\nWould you like me to send you the detailed brochure?", timestamp: "10:38 AM", isOwn: true, status: "read" },
  { id: 5, content: "Yes please! That would be great", timestamp: "10:40 AM", isOwn: false },
  { id: 6, content: "Thanks for your help!", timestamp: "10:42 AM", isOwn: false },
];

const DashboardChats = () => {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: "sent"
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="All Chats" />

        <div className="flex-1 flex overflow-hidden">
          {/* Client List */}
          <div className="w-80 border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockClients.map((client) => (
                  <ClientListItem
                    key={client.id}
                    {...client}
                    isActive={selectedClient.id === client.id}
                    onClick={() => setSelectedClient(client)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {selectedClient.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedClient.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedClient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-muted/20">
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} {...message} />
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChats;

