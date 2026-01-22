import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChangePassword } from "../../../services/AdminServices";

const Profile = () => {
  const [userdetails, setUserDetails] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* 🔹 Load data from localStorage */
  useEffect(() => {
    const data = {
      FullName: localStorage.getItem("name"),
      Email: localStorage.getItem("email"),
      PhoneNo: localStorage.getItem("phone"),
      Role: localStorage.getItem("role"),
      UserName: localStorage.getItem("name"),
      ActiveStatus: true,
      uid: localStorage.getItem("uid"),
    };

    setUserDetails(data);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🔹 Reset Password */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      id: localStorage.getItem("uid"),
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    };

    try {
      setLoading(true);
      const res = await ChangePassword(payload);

      if (res?.status === true) {
        toast.success("Password reset successfully");
        setResetOpen(false);
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res?.message || "Current password is incorrect");
      }
    } catch (error) {
      toast.error("Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        {/* <div className="flex justify-end">
          <button
            onClick={() => setResetOpen(true)}
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Reset Password
          </button>
        </div> */}

        {/* User Info */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{userdetails?.FullName}</h2>
          <p className="text-gray-500">{userdetails?.Email}</p>
          {/* <p className="text-sm text-gray-400 mt-1 capitalize">
            Role: {userdetails?.Role}
          </p> */}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="text-gray-500 text-sm">User Name</p>
            <p className="font-medium">{userdetails?.UserName}</p>
          </div>

          {/* <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-medium">
              {userdetails?.ActiveStatus ? "Active" : "Inactive"}
            </p>
          </div> */}

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium">{userdetails?.PhoneNo}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">User ID</p>
            <p className="font-medium">{userdetails?.uid}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Reset Password Modal */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Profile;
