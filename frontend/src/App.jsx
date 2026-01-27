import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Redirect from "./pages/RedirectPage";

// Admin Pages
import Dashboard from "./pages/admin/dashboard/Dashboard";
import AllChats from "./pages/admin/chats/AllChats";
import AllClients from "./pages/admin/clients/AllClients";
import AddClientDialog from "./pages/admin/clients/AddClientDialog";
import ChatListItem from "./pages/admin/chats/ChatListItem";
import AllMembers from "./pages/admin/member/AllMembers";
import AddMember from "./pages/admin/member/AddMember";
import Unassigned from "./pages/admin/unassignedClients/Unassigned";
import Profile from "./pages/admin/profile/Profile";
import EditProfile from "./pages/admin/profile/EditProfile";
import BasicSetting from "./pages/admin/basicSetting/BasicSetting";
import MemberPermissions from "./pages/admin/member/ManagePermission";
import WhatsappChat from "./pages/admin/chats/WhatsAppChat";
import WhatsappChatAdmin from "./pages/admin/chats/WhatsAppAdmin";
import UnassignedChats from "./pages/admin/chats/UnassignChat";
import Template from "./pages/admin/templates/Templates";
// Member Pages
import MemberDashboard from "./pages/member/Dashboard";
import MemberClients from "./pages/member/Clients";
import MemberSettings from "./pages/member/Settings";

import SocketToast from "./utils/socket";
import CrmStatusWatcher from "@/components/CrmStatusWatcher";

const queryClient = new QueryClient();

// Protected Route
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useUser();

  // Uncomment when auth needed
  // if (!user) return <Navigate to="/" replace />;
  // if (requireAdmin && !isAdmin)
  //   return <Navigate to="/member/dashboard" replace />;

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/redirect" element={<Redirect />} />
    <Route path="/" element={<Auth />} />
    <Route path="/forgot" element={<ForgotPassword />} />

    {/* Admin */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute requireAdmin>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/allchats"
      element={
        <ProtectedRoute requireAdmin>
          <AllChats />
        </ProtectedRoute>
      }
    />
    <Route
      path="/chat/:id"
      element={
        <ProtectedRoute requireAdmin>
          <ChatListItem />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/allclients"
      element={
        <ProtectedRoute requireAdmin>
          <AllClients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/allmembers"
      element={
        <ProtectedRoute requireAdmin>
          <AllMembers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/addmember"
      element={
        <ProtectedRoute requireAdmin>
          <AddMember />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/unassigned"
      element={
        <ProtectedRoute requireAdmin>
          <Unassigned />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/profile"
      element={
        <ProtectedRoute requireAdmin>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/editprofile"
      element={
        <ProtectedRoute requireAdmin>
          <EditProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/basicsetting"
      element={
        <ProtectedRoute requireAdmin>
          <BasicSetting />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/managepermission"
      element={
        <ProtectedRoute requireAdmin>
          <MemberPermissions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/whatsapp"
      element={
        <ProtectedRoute>
          <WhatsappChat />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/whatsappadmin"
      element={
        <ProtectedRoute>
          <WhatsappChatAdmin />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/unassignchat"
      element={
        <ProtectedRoute requireAdmin>
          <UnassignedChats />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/template"
      element={
        <ProtectedRoute requireAdmin>
          <Template />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/add-client"
      element={
        <ProtectedRoute requireAdmin>
          <AddClientDialog />
        </ProtectedRoute>
      }
    />

    {/* Member */}
    <Route
      path="/member/dashboard"
      element={
        <ProtectedRoute>
          <MemberDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/member/clients"
      element={
        <ProtectedRoute>
          <MemberClients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/member/settings"
      element={
        <ProtectedRoute>
          <MemberSettings />
        </ProtectedRoute>
      }
    />

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
