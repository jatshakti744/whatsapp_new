import {
  MessageSquare,
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  X,
  UserMinus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, useRef } from "react";
import { GetLatestChat } from "@/services/AdminServices";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";
import template from "../../pages/admin/templates/Templates";

const adminNavItems = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/dashboard/allclients" },
  { icon: UserCog, label: "Members", href: "/dashboard/allmembers" },
  { icon: UserMinus, label: "Unassign Chat", href: "/dashboard/unassignchat" },
  { icon: MessageSquare, label: "Templates", href: "/dashboard/template" }, // { icon: Template, label: "Templates", href: "/dashboard/templates" },
  // { icon: Settings, label: "Settings", href: "/dashboard/basicsetting" },
];

const memberNavItems = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/member/dashboard" },
  { icon: Users, label: "My Clients", href: "/member/clients" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef(null);
  const isFirstRender = useRef(true);
  const [countdowns, setCountdowns] = useState({});

  const user = useMemo(() => {
    return {
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      token: localStorage.getItem("tokenjwt"),
      crm_user_id: Number(localStorage.getItem("uid")),
    };
  }, []);

  const isAdmin = user.role === "admin";
  const navItems = isAdmin ? adminNavItems : memberNavItems;
  const basePath = isAdmin ? "/dashboard" : "/member/dashboard";

  const fetchChatUsers = async (search = "") => {
    setLoadingChats(true);
    try {
      const res = await GetLatestChat(
        user.token,
        String(isAdmin ? "66bc8b0c3fb6f1724c02bfec" : user.crm_user_id),
        search,
      );

      if (res?.status) {
        setChatUsers(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    socketRef.current = io("https://apiwhatsapp.tradestreet.in:1001", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("clientnotification", (data) => {
      if (!data) return;

      if (data.type === "whatsapp_chat") {
        fetchChatUsers(searchQuery);
      }

      if (data.type === "whatsapp_status" || data.type === "whatsapp_chat") {
        setChatUsers((prev) => {
          const updated = [...prev];
          const chatIndex = updated.findIndex(
            (c) =>
              data.phone && c.phone.endsWith(data.phone.replace(/^91/, "")),
          );

          if (chatIndex !== -1) {
            const chat = updated.splice(chatIndex, 1)[0];

            if (
              data.type === "whatsapp_chat" &&
              data.sender_type !== "employee"
            ) {
              chat.unreadCount = (chat.unreadCount || 0) + 1;
            }

            if (data.lastMessage) {
              chat.lastMessage = data.lastMessage;
            }

            updated.unshift(chat);
          }

          return updated;
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchChatUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   window.location.href = "https://crmplus.in/crm";
  // };

  const openChat = (chat) => {
    setChatUsers((prev) =>
      prev.map((c) => (c.phone === chat.phone ? { ...c, unreadCount: 0 } : c)),
    );

    const phoneNumber = chat.phone.replace(/^91/, "");

    navigate(isAdmin ? "/dashboard/whatsappadmin" : "/dashboard/whatsapp", {
      state: {
        client: {
          mobile: phoneNumber,
          name: chat.client_name,
        },
      },
    });
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatUsers;

    const query = searchQuery.toLowerCase();
    return chatUsers.filter(
      (chat) =>
        chat.phone.toLowerCase().includes(query) ||
        chat.lastMessage?.toLowerCase().includes(query),
    );
  }, [chatUsers, searchQuery]);

  const getInitials = (phone) => {
    return phone.slice(-2).toUpperCase();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const messageDate = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    // 👉 Today → time
    if (messageDate >= startOfToday) {
      return messageDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // 👉 Yesterday → Yesterday + time (NOT date)
    if (messageDate >= startOfYesterday && messageDate < startOfToday) {
      const timePart = messageDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return `Yesterday, ${timePart}`;
    }

    // 👉 Older → date only
    return messageDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChatUsers((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getAlertType = (lastClientMessageAt) => {
    const now = new Date();
    const msgTime = new Date(lastClientMessageAt);

    const diffInHours = (now.getTime() - msgTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      return "red";
    } else if (diffInHours >= 20) {
      return "yellow";
    } else {
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        chatUsers.forEach((chat) => {
          const remaining = getRemainingTime(chat.lastClientMessageAt);
          if (remaining) updated[chat.phone] = remaining;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [chatUsers]);

  const getRemainingTime = (lastMessageTime) => {
    if (!lastMessageTime) return null;

    const now = new Date();
    const lastMsgDate = new Date(lastMessageTime);
    const diffMs = 24 * 60 * 60 * 1000 - (now - lastMsgDate); // 24h - elapsed time

    if (diffMs <= 0) return null;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-green-200 flex flex-col transition-all duration-300 border-r",
        collapsed ? "w-16" : "w-72",
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
              <img
                className="w-6 h-6 object-contain"
                src="/assets/logo.jpeg"
                alt="Logo"
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg text-gray-900">
                Infinix Infotech
              </span>
              <span className="text-sm text-gray-600">Private Limited</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("w-4 h-4", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-green-600 text-white"
                  : "text-green-800 hover:bg-green-100",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by mobile no"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-9 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingChats ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">Loading chats...</div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  {searchQuery ? "No chats found" : "No recent chats"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredChats.map((chat) => {
                  const alertType = getAlertType(chat.createdAt);

                  return (
                    <div
                      key={chat.phone}
                      onClick={() => openChat(chat)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        "hover:bg-green-100",

                        alertType === "red"
                          ? "bg-red-100 border-l-4 border-red-500"
                          : alertType === "yellow"
                            ? "bg-yellow-100 border-l-4 border-yellow-500"
                            : "",

                        location.pathname.includes("whatsapp") &&
                          location.state?.client?.mobile ===
                            chat.phone.replace(/^91/, "")
                          ? "bg-green-50 border-l-4 border-green-600"
                          : "",
                      )}
                    >
                      <div className="w-8 h-8 text-sm rounded-full bg-green-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {getInitials(chat.phone)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          {/* <p className="text-sm font-semibold text-gray-900 truncate">
                            {chat.client_name && chat.client_name.trim() !== ""
                              ? chat.client_name
                              : `+${chat.phone}`}
                          </p> */}

                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {chat.client_name && chat.client_name.trim() !== ""
                              ? chat.client_name
                              : `+${chat.phone}`}
                            {countdowns[chat.phone] && (
                              <span className="ml-2 text-xs text-red-600 font-bold">
                                {countdowns[chat.phone]}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600 truncate flex-1">
                            {chat.message_type === "image"
                              ? "📷 Photo"
                              : chat.message_type === "video"
                                ? "🎥 Video"
                                : chat.message_type === "document"
                                  ? "📄 Document"
                                  : // : chat.message_type === "template"
                                    // ? "📋 Template"
                                    chat.lastMessage || "No message"}
                          </p>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[11px] text-gray-500 whitespace-nowrap">
                              {formatTime(chat.createdAt)}
                            </span>

                            {alertType && (
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  alertType === "red"
                                    ? "bg-red-600"
                                    : "bg-yellow-500",
                                )}
                              />
                            )}

                            {chat.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 min-w-[20px] flex items-center justify-center text-xs"
                              >
                                {chat.unreadCount > 99
                                  ? "99+"
                                  : chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <div className="p-2 border-t bg-green-50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Go to CRM</span>}
        </Button>
      </div> */}
    </aside>
  );
};

export default DashboardSidebar;
