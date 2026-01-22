import { Users, MessageSquare, UserPlus, Clock } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import ClientListItem from "@/components/dashboard/ClientListItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const mockRecentClients = [
  { name: "John Smith", phone: "+1 234 567 890", lastMessage: "Thanks for your help!", lastMessageTime: "2m ago", unreadCount: 2 },
  { name: "Sarah Johnson", phone: "+1 234 567 891", lastMessage: "When will my order arrive?", lastMessageTime: "15m ago", unreadCount: 0 },
  { name: "Mike Wilson", phone: "+1 234 567 892", lastMessage: "I need to reschedule", lastMessageTime: "1h ago", unreadCount: 1 },
  { name: "Emily Davis", phone: "+1 234 567 893", lastMessage: "Perfect, thank you!", lastMessageTime: "2h ago", unreadCount: 0 },
];

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening today."
        />

        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-background to-muted/20">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <StatsCard
              title="Total Clients"
              value="1,234"
              change="+12% from last month"
              changeType="positive"
              icon={Users}
              iconColor="gradient-primary"
            />
            <StatsCard
              title="Active Chats"
              value="89"
              change="23 unread messages"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-info"
            />
            <StatsCard
              title="Unassigned"
              value="12"
              change="Needs attention"
              changeType="negative"
              icon={UserPlus}
              iconColor="bg-warning"
            />
            <StatsCard
              title="Avg Response"
              value="2.4m"
              change="-18% from last week"
              changeType="positive"
              icon={Clock}
              iconColor="bg-success"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="shadow-medium card-hover border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {mockRecentClients.map((client, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                      <ClientListItem {...client} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Activity */}
            <Card className="shadow-medium card-hover border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-info/5 to-transparent border-b border-border/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-info" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { member: "Alice Cooper", action: "assigned", client: "John Smith", time: "5m ago", color: "bg-primary" },
                    { member: "Bob Martin", action: "replied to", client: "Sarah Johnson", time: "12m ago", color: "bg-success" },
                    { member: "Carol White", action: "transferred", client: "Mike Wilson", time: "1h ago", color: "bg-info" },
                    { member: "Admin", action: "created member", client: "David Brown", time: "2h ago", color: "bg-warning" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-xs shadow-medium", activity.color)}>
                        {activity.member.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-foreground">{activity.member}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-semibold text-foreground">{activity.client}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

