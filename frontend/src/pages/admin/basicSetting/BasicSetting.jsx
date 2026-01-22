import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  GetBasicSettings,
  UpdateBasicSettings,
} from "../../../services/AdminServices";

const BasicSetting = () => {
  const token = localStorage.getItem("tokenjwt");
  const { toast } = useToast();

  const [basicsettings, setBasicSettings] = useState({
    website_title: "",
    email_address: "",
    contact_number: "",
    smtp_status: 0,
    smtp_host: "",
    smtp_port: "",
    encryption: "",
    smtp_username: "",
    smtp_password: "",
    from_name: "",
    smsprovider: "",
    address: "",
    logo: null,
    favicon: null,
  });

  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBasicSettings = async () => {
    try {
      const response = await GetBasicSettings(token);
      if (response?.data?.length > 0) {
        setBasicSettings(response.data[0]);
        setOriginalSettings(response.data[0]);
      }
    } catch (error) {
      console.log("Error fetching Basic Settings", error);
    }
  };

  useEffect(() => {
    fetchBasicSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setBasicSettings((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const hasChanges = () => {
    if (!originalSettings) return false;

    // ✅ If new logo selected
    if (basicsettings.logo instanceof File) return true;

    // ✅ If new favicon selected
    if (basicsettings.favicon instanceof File) return true;

    const ignoreKeys = [
      "logo",
      "favicon",
      "_id",
      "__v",
      "created_at",
      "updated_at",
    ];

    return Object.keys(basicsettings).some((key) => {
      if (ignoreKeys.includes(key)) return false;
      return basicsettings[key] !== originalSettings[key];
    });
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      toast({
        title: "No Changes",
        description: "No changes made",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(basicsettings).forEach((key) => {
        if (key === "logo" || key === "favicon") {
          if (basicsettings[key] instanceof File) {
            formData.append(key, basicsettings[key]);
          }
        } else {
          formData.append(key, basicsettings[key] ?? "");
        }
      });

      const response = await UpdateBasicSettings(token, formData);

      if (response?.status) {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
        fetchBasicSettings();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Basic Settings"
      subtitle="Manage and preview your website information"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            Edit Website Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Website Logo</Label>
                <Input type="file" name="logo" onChange={handleChange} />
              </div>

              <div>
                <Label>Favicon</Label>
                <Input type="file" name="favicon" onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>Website Title</Label>
              <Input
                name="website_title"
                value={basicsettings.website_title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Email</Label>
                <Input
                  name="email_address"
                  value={basicsettings.email_address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Contact</Label>
                <Input
                  name="contact_number"
                  value={basicsettings.contact_number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SMTP Status</Label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={basicsettings.smtp_status === 1}
                    onChange={(e) =>
                      setBasicSettings((prev) => ({
                        ...prev,
                        smtp_status: e.target.checked ? 1 : 0,
                      }))
                    }
                  />
                  <span>
                    {basicsettings.smtp_status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <Label>SMTP Host</Label>
                <Input
                  name="smtp_host"
                  value={basicsettings.smtp_host}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SMTP Port</Label>
                <Input
                  name="smtp_port"
                  value={basicsettings.smtp_port}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Encryption</Label>
                <Input
                  name="encryption"
                  value={basicsettings.encryption}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SMTP Username</Label>
                <Input
                  name="smtp_username"
                  value={basicsettings.smtp_username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SMTP Password</Label>
                <Input
                  type="password"
                  name="smtp_password"
                  value={basicsettings.smtp_password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>From Name</Label>
                <Input
                  name="from_name"
                  value={basicsettings.from_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SMS Provider</Label>
                <Input
                  name="smsprovider"
                  value={basicsettings.smsprovider}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                name="address"
                value={basicsettings.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BasicSetting;
