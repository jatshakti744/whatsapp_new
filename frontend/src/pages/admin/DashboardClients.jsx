import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, UserPlus, MessageSquare, Edit } from "lucide-react";

const mockClients = [
  { id: 1, name: "John Smith", phone: "+1 234 567 890", assignedTo: "Alice Cooper", status: "active", lastActive: "2 minutes ago", messages: 45 },
  { id: 2, name: "Sarah Johnson", phone: "+1 234 567 891", assignedTo: "Bob Martin", status: "active", lastActive: "15 minutes ago", messages: 23 },
  { id: 3, name: "Mike Wilson", phone: "+1 234 567 892", assignedTo: "Alice Cooper", status: "inactive", lastActive: "2 days ago", messages: 12 },
  { id: 4, name: "Emily Davis", phone: "+1 234 567 893", assignedTo: "Carol White", status: "active", lastActive: "1 hour ago", messages: 67 },
  { id: 5, name: "David Brown", phone: "+1 234 567 894", assignedTo: null, status: "unassigned", lastActive: "3 hours ago", messages: 8 },
  { id: 6, name: "Lisa Anderson", phone: "+1 234 567 895", assignedTo: "Bob Martin", status: "active", lastActive: "30 minutes ago", messages: 34 },
];

const DashboardClients = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Clients" subtitle="Manage all your clients" />

        <main className="flex-1 overflow-auto p-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Clients Table */}
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                            {client.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                    <TableCell>
                      {client.assignedTo ? (
                        <span className="text-foreground">{client.assignedTo}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          client.status === "active" ? "default" : 
                          client.status === "unassigned" ? "secondary" : "outline"
                        }
                        className={
                          client.status === "active" ? "bg-success" :
                          client.status === "unassigned" ? "bg-warning text-warning-foreground" : ""
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.lastActive}</TableCell>
                    <TableCell className="text-muted-foreground">{client.messages}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Open Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign Member
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardClients;

