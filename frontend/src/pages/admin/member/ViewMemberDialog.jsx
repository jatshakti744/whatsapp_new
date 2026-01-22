import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, User, Shield } from "lucide-react";

const ViewMemberDialog = ({ open, setOpen, member }) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Member Details
          </DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold">
              {member.FullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-lg font-semibold">{member.FullName}</p>
            <p className="text-sm text-muted-foreground">
              @{member.UserName}
            </p>
          </div>

          <Badge
            className="ml-auto"
            variant={member.ActiveStatus === "active" ? "default" : "secondary"}
          >
            {member.ActiveStatus?"Active" : "Inactive" }
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{member.FullName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span>{member.UserName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{member.Email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{member.PhoneNo}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMemberDialog;
