// components/WhatsappNotification/WhatsappNotification.jsx

import { useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";
import { toast } from "react-hot-toast";

const WhatsappNotification = () => {
  const socket = useSocket();

  // ✅ YE LOG ADD KARO
  useEffect(() => {
    console.log("🔔 Notification component mounted");
    console.log("🔌 Socket status:", socket ? "Connected" : "Not connected");
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available yet");
      return;
    }

    console.log("👂 Listening for notifications...");

    // Socket listener
    socket.on("clientnotification", (data) => {
      console.log("📩 Notification received:", data);
      console.log("📩 Type:", data.type);
      console.log("📩 Message:", data.message);

      if (data.type === "whatsapp_chat") {
        console.log("✅ WhatsApp notification - showing toast");

        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="/whatsapp-icon.png"
                      alt="WhatsApp"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {data.title || "New WhatsApp Message"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      From: {data.phone}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{data.message}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.href = `/dashboard/whatsapp?phone=${data.phone}`;
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View
                </button>
              </div>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );

        // Audio notification
        const audio = new Audio("/notification.mp3");
        audio.play().catch((err) => console.log("Audio play failed:", err));
      }
    });

    return () => {
      console.log("👋 Removing notification listener");
      socket.off("clientnotification");
    };
  }, [socket]);

  return null;
};

export default WhatsappNotification;
