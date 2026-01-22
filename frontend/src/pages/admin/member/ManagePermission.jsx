import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UpdatePermission } from "../../../services/AdminServices";

const PERMISSIONS = [
  { key: "add_user", label: "Add User" },
  { key: "edit_user", label: "Edit User" },
  { key: "delete_user", label: "Delete User" },
  { key: "view_user", label: "View User" },

  { key: "add_client", label: "Add Client" },
  { key: "edit_client", label: "Edit Client" },
  { key: "delete_client", label: "Delete Client" },

  { key: "add_member", label: "Add Member" },
  { key: "edit_member", label: "Edit Member" },
  { key: "delete_member", label: "Delete Member" },
];

const ManagePermission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("tokenjwt");
  const user = location?.state?.user;
  const userId = user?._id;

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast({
        title: "Invalid User",
        description: "User not found",
        variant: "destructive",
      });
      navigate(-1);
      return;
    }

    let parsedPermissions = [];

    try {
      if (Array.isArray(user?.permissions)) {
        if (
          typeof user.permissions[0] === "string" &&
          user.permissions.length > 1
        ) {
          parsedPermissions = user.permissions;
        } else if (typeof user.permissions[0] === "string") {
          parsedPermissions = JSON.parse(user.permissions[0]);
        }
      }
    } catch (err) {
      console.error("Permission parse error", err);
    }

    setPermissions(Array.isArray(parsedPermissions) ? parsedPermissions : []);
  }, [userId]);

  const togglePermission = (key) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        permissions,
      };

      console.log("SENDING →", {
        id: userId,
        permissions,
      });

      const res = await UpdatePermission(token, userId, payload);

      if (res?.status) {
        toast({
          title: "Permissions Updated",
          description: "User permissions updated successfully",
        });
        navigate(-1);
      } else {
        toast({
          title: "Error",
          description: res?.message || "Unable to update permissions",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Permission update failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Manage Permissions"
      subtitle={`User: ${user?.FullName || "N/A"}`}
    >
      <div className="flex h-screen bg-background">
        <div className="flex-1 overflow-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {PERMISSIONS.map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{perm.label}</span>
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm.key)}
                    onChange={() => togglePermission(perm.key)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              ))}

              <div className="pt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Permissions"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePermission;
