import { useEffect } from "react";
import { AuthCheck } from "@/services/AuthServices";
import { useUser } from "@/context/UserContext";

const CrmStatusWatcher = () => {
  const { logout } = useUser();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const crmId = uid;
    const role = localStorage.getItem("role");

    if (!uid || isNaN(crmId)) {
      console.warn("CRM ID missing, skipping check");
      return;
    }

    if (role == "admin") {
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await AuthCheck({ crm_user_id: crmId });

        if (!res?.status) {
          console.warn("❌ CRM inactive → logout");
          logout();
        }
      } catch (err) {
        console.error("🚨 CRM API error:", err);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default CrmStatusWatcher;
