import { MessageSquare, Users, Clock, CheckCircle } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import ClientListItem from "@/components/dashboard/ClientListItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";

const mockMyClients = [
  { name: "John Smith", phone: "+1 234 567 890", lastMessage: "Thanks for your help!", lastMessageTime: "2m ago", unreadCount: 2 },
  { name: "Sarah Johnson", phone: "+1 234 567 891", lastMessage: "When will my order arrive?", lastMessageTime: "15m ago", unreadCount: 0 },
  { name: "Mike Wilson", phone: "+1 234 567 892", lastMessage: "I need to reschedule", lastMessageTime: "1h ago", unreadCount: 1 },
];

const MemberDashboard = () => {
  const { user } = useUser();

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || "Member"}! Here's your overview.`}
        />

        <main className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="My Clients"
              value="All"
              change="Active conversations"
              changeType="neutral"
              icon={Users}
              iconColor="gradient-primary"
            />
            {/* <StatsCard
              title="Active Chats"
              value="12"
              change="5 unread messages"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-info"
            />
            <StatsCard
              title="Resolved Today"
              value="8"
              change="Great work!"
              changeType="positive"
              icon={CheckCircle}
              iconColor="bg-success"
            />
            <StatsCard
              title="Avg Response"
              value="1.8m"
              change="Excellent time"
              changeType="positive"
              icon={Clock}
              iconColor="bg-success"
            /> */}
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">My Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockMyClients.map((client, index) => (
                    <div key={index} className="px-4">
                      <ClientListItem {...client} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">My Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Replied to", client: "John Smith", time: "5m ago" },
                    { action: "Resolved conversation with", client: "Sarah Johnson", time: "12m ago" },
                    { action: "Started chat with", client: "Mike Wilson", time: "1h ago" },
                    { action: "Updated status for", client: "Emily Davis", time: "2h ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-xs">
                        {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "ME"}
                      </div>
                      <div className="flex-1">
                        <span className="text-muted-foreground">You {activity.action} </span>
                        <span className="font-medium text-foreground">{activity.client}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;

