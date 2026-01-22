import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      console.log("⚠️ User not found, socket not connecting");
      return;
    }

    console.log("🔌 Connecting socket for user:", user.crm_user_id);

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        crm_user_id: user.crm_user_id,
        role: user.role,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      setSocket(socketRef.current); // ✅ STATE UPDATE KARO
    });

    // socketRef.current.on("disconnect", () => {
    //   console.log("❌ Socket disconnected");
    //   setSocket(null);
    // });

    // socketRef.current.on("connect_error", (error) => {
    //   console.error("❌ Socket connection error:", error);
    // });

    return () => {
      console.log("🔌 Cleaning up socket connection");
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
