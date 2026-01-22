import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Users, MessageSquare, UserPlus, Clock } from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import ClientListItem from "@/components/dashboard/ClientListItem";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GetDashboardCount } from "../../../services/AdminServices";

const mockRecentClients = [
  {
    name: "John Smith",
    phone: "+1 234 567 890",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "2m ago",
    unreadCount: 2,
  },
  {
    name: "Sarah Johnson",
    phone: "+1 234 567 891",
    lastMessage: "When will my order arrive?",
    lastMessageTime: "15m ago",
    unreadCount: 0,
  },
  {
    name: "Mike Wilson",
    phone: "+1 234 567 892",
    lastMessage: "I need to reschedule",
    lastMessageTime: "1h ago",
    unreadCount: 1,
  },
  {
    name: "Emily Davis",
    phone: "+1 234 567 893",
    lastMessage: "Perfect, thank you!",
    lastMessageTime: "2h ago",
    unreadCount: 0,
  },
];

const Dashboard = () => {
  const [dashboardCount, setDashboardCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const tokenjwt = searchParams.get("tokenjwt");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (tokenjwt) {
      localStorage.setItem("uid", uid || "");
      localStorage.setItem("token", token || "");
      localStorage.setItem("tokenjwt", tokenjwt || "");
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("phone", phone || "");

      // 🔁 URL clean karne ke liye (query params hata dega)
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const fetchDashboardCount = async () => {
      try {
        const token = localStorage.getItem("tokenjwt");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await GetDashboardCount(token);
        setDashboardCount(response.data);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCount();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening today."
        />

        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-background to-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/dashboard/allclients">
              <StatsCard
                title="Total Clients"
                value="All"
                 change="Active conversations"
                changeType="positive"
                icon={Users}
                iconColor="gradient-primary"
              />
            </Link>

            {/* <StatsCard
              title="Active Chats"
              value={dashboardCount?.clientCountActive || 0}
              change="Unread messages"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-info"
            />

            <StatsCard
              title="Unassigned"
              value={dashboardCount?.clientCountInactive || 0}
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
            /> */}
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-medium border-border/50">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y">
                  {mockRecentClients.map((client, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-muted/30">
                      <ClientListItem {...client} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border/50">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-info" />
                  Team Activity
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {[
                  {
                    member: "Alice Cooper",
                    action: "assigned",
                    client: "John Smith",
                    time: "5m ago",
                    color: "bg-primary",
                  },
                  {
                    member: "Bob Martin",
                    action: "replied to",
                    client: "Sarah Johnson",
                    time: "12m ago",
                    color: "bg-success",
                  },
                  {
                    member: "Carol White",
                    action: "transferred",
                    client: "Mike Wilson",
                    time: "1h ago",
                    color: "bg-info",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl text-white flex items-center justify-center font-semibold",
                        item.color
                      )}
                    >
                      {item.member
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div className="flex-1 text-sm">
                      <span className="font-semibold">{item.member}</span>{" "}
                      <span className="text-muted-foreground">
                        {item.action}
                      </span>{" "}
                      <span className="font-semibold">{item.client}</span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
