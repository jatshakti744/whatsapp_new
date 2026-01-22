import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChatMessage from "@/components/dashboard/ChatMessage";
import ChatInput from "@/components/dashboard/ChatInput";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, MoreVertical, AlertCircle, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data (keep as-is or replace with real data)
const mockUnassignedClients = [
  { id: 1, name: "Acme Corporation", phone: "+1 987 654 321", lastMessage: "We need to discuss the new pricing plan...", lastMessageTime: "about 1 year ago", tags: ["enterprise", "priority"] },
  { id: 2, name: "New Customer", phone: "+1 555 123 456", lastMessage: "Hi, I saw your ad and I'm interested", lastMessageTime: "Just now", tags: [] },
  { id: 3, name: "Unknown", phone: "+1 555 789 012", lastMessage: "Hello? Anyone there?", lastMessageTime: "5m ago", tags: [] },
];

const mockMembers = [
  { id: 1, name: "Alice Cooper" },
  { id: 2, name: "Bob Martin" },
  { id: 3, name: "Carol White" },
  { id: 4, name: "Frank Johnson" },
];

const mockMessages = [
  { id: 1, content: "Hi, I saw your ad and I'm interested", timestamp: "2:45 PM", isOwn: false },
  { id: 2, content: "Can you tell me more about your services?", timestamp: "2:46 PM", isOwn: false },
];

// Compact card used on the unassigned list. It doesn't open the chat directly — only shows name and relevant info.
const ClientCard = ({ client, onViewDetails, onAssign }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-warning text-warning-foreground">
            {client.name.split(" ").map(n => n[0]).slice(0,2).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{client.name}</h4>
            <span className="text-xs text-muted-foreground">{client.lastMessageTime}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[220px]">{client.lastMessage}</p>
          <div className="flex items-center gap-1 mt-1">
            {client.tags?.map((t, idx) => (
              <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onViewDetails(client); }}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button size="sm" onClick={(e) => { e.stopPropagation(); onAssign(client); }}>
          <UserPlus className="w-4 h-4 mr-2" />
          Assign
        </Button>
      </div>
    </div>
  );
};

const DashboardUnassigned = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const { toast } = useToast();

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

  const openDetails = (client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const openAssign = (client) => {
    setSelectedClient(client);
    setAssignDialogOpen(true);
  };

  const handleAssign = () => {
    if (selectedMember) {
      toast({
        title: "Client Assigned",
        description: `${selectedClient?.name} has been assigned to ${mockMembers.find(m => m.id.toString() === selectedMember)?.name}`,
      });
      setAssignDialogOpen(false);
      setSelectedMember("");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Unassigned Clients" 
          subtitle="New messages that need to be assigned to team members"
        />

        <div className="">
          {/* Client List */}
          <div className="border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 text-warning">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{mockUnassignedClients.length} clients need attention</span>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {mockUnassignedClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onViewDetails={openDetails}
                    onAssign={openAssign}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

     
        </div>
      </div>

      {/* Details Dialog (shows chat + assign option) */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="w-[900px] max-w-full h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>Conversation and client metadata — only shown when you explicitly open details.</DialogDescription>
          </DialogHeader>

          <div className="flex h-full">
            {/* Left column: client info */}
            <div className="w-80 border-r border-border p-4 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-warning text-warning-foreground">{selectedClient?.name.split(" ").map(n => n[0]).slice(0,2).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedClient?.name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedClient?.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium">Last message</h5>
                  <p className="text-sm text-muted-foreground">{selectedClient?.lastMessage}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Tags</h5>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedClient?.tags?.map((t, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => { setAssignDialogOpen(true); }} className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" /> Assign Client
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column: Chat area */}
            <div className="flex-1 flex flex-col">
              <div className="h-16 bg-card border-b border-border flex items-center px-4">
                <div>
                  <h3 className="font-semibold">{selectedClient?.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedClient?.phone}</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 bg-muted/20">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-center mb-4">
                    <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full">New conversation started</span>
                  </div>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} {...message} />
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog (can open from both card and details) */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="w-[420px]">
          <DialogHeader>
            <DialogTitle>Assign Client</DialogTitle>
            <DialogDescription>Select a team member to handle this client's conversations.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {mockMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssign} className="w-full" disabled={!selectedMember}>
              Assign Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardUnassigned;
