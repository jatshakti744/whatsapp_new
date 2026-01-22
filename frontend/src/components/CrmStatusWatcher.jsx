import { useEffect } from "react";
import { AuthCheck } from "@/services/AuthServices";
import { useUser } from "@/context/UserContext";

const CrmStatusWatcher = () => {
  const { logout } = useUser();

  useEffect(() => {
    console.log("🔥 CRM Watcher mounted");

    const uid = localStorage.getItem("uid");
    const crmId = Number(uid);

    console.log("CRM ID from storage:", crmId);

    if (!uid || isNaN(crmId)) {
      console.warn("CRM ID missing, skipping check");
      return;
    }

    if (crmId === 1) {
      console.log("Super admin → skip CRM check");
      return;
    }

    const checkStatus = async () => {
      console.log("📡 Calling CRM API...");
      try {
        const res = await AuthCheck({ crm_user_id: crmId });
        console.log("✅ CRM response:", res);

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
