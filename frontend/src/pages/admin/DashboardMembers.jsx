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
import { Search, Plus, MoreHorizontal, Edit, UserX, Users } from "lucide-react";

const mockMembers = [
  { id: 1, name: "Alice Cooper", email: "alice@company.com", role: "Member", status: "active", clients: 24, messages: 342 },
  { id: 2, name: "Bob Martin", email: "bob@company.com", role: "Member", status: "active", clients: 18, messages: 256 },
  { id: 3, name: "Carol White", email: "carol@company.com", role: "Member", status: "on_leave", clients: 12, messages: 189 },
  { id: 4, name: "David Lee", email: "david@company.com", role: "Member", status: "inactive", clients: 0, messages: 45 },
  { id: 5, name: "Emma Wilson", email: "emma@company.com", role: "Admin", status: "active", clients: 8, messages: 567 },
  { id: 6, name: "Frank Johnson", email: "frank@company.com", role: "Member", status: "active", clients: 31, messages: 423 },
];

const DashboardMembers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-success";
      case "on_leave": return "bg-warning text-warning-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active": return "Active";
      case "on_leave": return "On Leave";
      case "inactive": return "Inactive";
      default: return status;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Members" subtitle="Manage your team members" />

        <main className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{mockMembers.length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">{mockMembers.filter(m => m.status === "active").length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">On Leave</p>
              <p className="text-2xl font-bold text-warning">{mockMembers.filter(m => m.status === "on_leave").length}</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Members Table */}
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Clients</TableHead>
                  <TableHead>Total Messages</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.role === "Admin" ? "default" : "secondary"}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusLabel(member.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.clients}</TableCell>
                    <TableCell className="text-muted-foreground">{member.messages}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            View Clients
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
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

export default DashboardMembers;

