import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AllClients from "./pages/admin/clients/AllClients";
import AllMembers from "./pages/admin/member/AllMembers";
import AddMember from "./pages/admin/member/AddMember";
import WhatsappChat from "./pages/member/WhatsAppChat";
import WhatsappChatAdmin from "./pages/admin/chats/WhatsAppAdmin";
import UnassignedChats from "./pages/admin/unassignedClients/UnassignChat";
import Template from "./pages/admin/templates/Templates";
import SocketToast from "./utils/socket";
import CrmStatusWatcher from "@/components/CrmStatusWatcher";
import MemberClients from "./pages/member/Clients";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Auth />} />
    <Route path="/forgot" element={<ForgotPassword />} />
    <Route path="/dashboard/allclients" element={<AllClients />} />
    <Route path="/dashboard/allmembers" element={<AllMembers />} />
    <Route path="/dashboard/addmember" element={<AddMember />} />
    <Route path="/dashboard/whatsapp" element={<WhatsappChat />} />
    <Route path="/dashboard/whatsappadmin" element={<WhatsappChatAdmin />} />
    <Route path="/dashboard/unassignchat" element={<UnassignedChats />} />
    <Route path="/dashboard/template" element={<Template />} />
    <Route path="/member/clients" element={<MemberClients />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <SocketToast>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CrmStatusWatcher />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </SocketToast>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
