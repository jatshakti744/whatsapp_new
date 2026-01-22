import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

const DashboardHeader = ({ title, subtitle }) => {
  const { isAdmin, logout } = useUser();
  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.clear();
    window.location.href = "https://crmplus.in/crm";
  };

  // const user = JSON.parse(localStorage.getItem("user") || "{}");

  // const userName =
  //   typeof user.name === "string" && user.name.trim().length > 0
  //     ? user.name.trim()
  //     : "User";

  const userName=localStorage.getItem("name");

  const userInitials = userName
    .split(" ")
    .filter(Boolean) // extra spaces remove
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-colors"
          />
        </div> */}

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted/50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-medium animate-pulse-soft">
            3
          </span>
        </Button> */}

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-3 hover:bg-muted/50 transition-colors rounded-xl"
            >
              <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold shadow-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold hidden sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/dashboard/basicsetting")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="text-destructive"    onClick={() =>handleLogout()} >
              Sign out
            </DropdownMenuItem> 
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
