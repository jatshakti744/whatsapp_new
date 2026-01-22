import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  GetUserDetails,
  UpdateMyProfile,
} from "../../../services/AdminServices";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("tokenjwt");
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  const [userdetails, setUserDetails] = useState({
    FullName: "",
    Email: "",
    PhoneNo: "",
  });
  const [originalDetails, setOriginalDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await GetUserDetails(token, userId);
      setUserDetails(res?.data || {});
      setOriginalDetails(res?.data || {});
    } catch (error) {
      console.log("Error fetching User Details", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateButton = async (e) => {
    e.preventDefault();

    if (
      originalDetails &&
      userdetails.FullName === originalDetails.FullName &&
      userdetails.Email === originalDetails.Email &&
      userdetails.PhoneNo === originalDetails.PhoneNo
    ) {
      toast({
        title: "No Changes",
        description: "No changes made",
      });
      return;
    }

    const payload = {
      id: userId,
      FullName: userdetails.FullName,
      Email: userdetails.Email,
      PhoneNo: userdetails.PhoneNo,
    };

    try {
      const res = await UpdateMyProfile(token, payload);

      if (res?.status) {
        toast({
          title: "Profile Updated",
          description: "Profile updated successfully",
        });
        navigate("/dashboard/profile");
        fetchUserDetails();
      }
    } catch (error) {
      console.log("Error updating profile", error);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Update Profile">
      <div className="mx-auto bg-white rounded-xl shadow p-6 mt-10">
        <form className="space-y-5" onSubmit={handleUpdateButton}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="FullName"
                value={userdetails.FullName || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="Email"
                value={userdetails.Email || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              type="text"
              name="PhoneNo"
              value={userdetails.PhoneNo || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => navigate("/dashboard/profile")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
