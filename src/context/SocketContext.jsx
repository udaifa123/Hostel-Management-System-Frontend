import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";


const SocketContext = createContext(null);


export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};


export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!user || !token) {
      console.log("⚠️ No user/token. Socket not started.");
      return;
    }

    console.log("🔌 Connecting socket...");

    const socketInstance = io("http://localhost:4000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      reconnectAttempts.current += 1;
      console.log("❌ Socket connection error:", err.message);
    });

    socketInstance.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on("user_online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socketInstance.on("user_offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

   
    socketInstance.on("call:incoming", (data) => {
      console.log("📞 Incoming call event received:", data);
    });

    socketInstance.on("call:accepted", (data) => {
      console.log("✅ Call accepted event received:", data);
    });

    socketInstance.on("call:rejected", (data) => {
      console.log("❌ Call rejected event received:", data);
    });

    socketInstance.on("call:ended", (data) => {
      console.log("📴 Call ended event received:", data);
    });

    socketInstance.on("call:failed", (data) => {
      console.log("❌ Call failed event received:", data);
    });

    
    socketInstance.on("webrtc:offer", ({ offer, senderId }) => {
      console.log("📨 WebRTC offer received from:", senderId);
    });

    socketInstance.on("webrtc:answer", ({ answer }) => {
      console.log("📨 WebRTC answer received");
    });

    socketInstance.on("webrtc:ice-candidate", ({ candidate }) => {
      console.log("📨 ICE candidate received");
    });

    setSocket(socketInstance);

    return () => {
      console.log("🧹 Cleaning socket...");
      socketInstance.disconnect();
    };
  }, [user, token]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  const joinChat = (participantId) => {
    if (socket?.connected) {
      socket.emit("join_chat", participantId);
    }
  };

  const leaveChat = (participantId) => {
    if (socket?.connected) {
      socket.emit("leave_chat", participantId);
    }
  };

  const sendTyping = (receiverId, isTyping) => {
    if (socket?.connected) {
      socket.emit("typing", { receiverId, isTyping });
    }
  };

  const sendMessage = (receiverId, message) => {
    if (socket?.connected) {
      socket.emit("send_message", { receiverId, message });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    isOnline,
    joinChat,
    leaveChat,
    sendTyping,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};


export default SocketProvider;