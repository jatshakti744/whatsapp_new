import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import * as config from "../utils/config";

export default function SocketToast({ children }) {
  const socketRef = useRef(null);
  const { user } = useUser();
  const SOCKET_URL = `${config.socket_url}`;

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const showBrowserNotification = ({ title, message }) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const notification = new Notification(title || "New Notification", {
      body: message,
      icon: "/logo.png",
      badge: "/logo.png",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on("clientnotification", (data) => {
      if (!data) return;

      if (data.type !== "whatsapp_chat") {
        return;
      }

      if (data.sender_type && data.sender_type !== "client") {
        return;
      }

      if (
        data.crm_user_id &&
        user?.crm_user_id &&
        data.crm_user_id !== 1 &&
        data.crm_user_id !== user.crm_user_id
      ) {
        return;
      }

      const { title, message, phone } = data;

      if (document.hidden) {
        showBrowserNotification({
          title: title || "New WhatsApp Message",
          message: message || "New message received",
        });
      }

      toast.info(
        <div>
          <strong>{title || "New WhatsApp Message"}</strong>
          <div>{message}</div>
          {phone && (
            <div style={{ fontSize: "12px", color: "#666" }}>📱 {phone}</div>
          )}
        </div>,
        {
          autoClose: 5000,
        },
      );
    });

    socket.on("whatsapp_status_update", (data) => {});

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.crm_user_id]);

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={5}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
