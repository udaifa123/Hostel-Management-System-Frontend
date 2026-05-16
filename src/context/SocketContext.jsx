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
  const [socketError, setSocketError] = useState(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!user || !token) {
      console.log("⚠️ No user/token. Socket not started.");
      return;
    }

    console.log("🔌 Connecting socket...");

    // FIXED: Removed /api from the socket URL
    const socketInstance = io("https://hostel-management-system-backened-1.onrender.com", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
      setSocketError(null);
      reconnectAttempts.current = 0;
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
      
      // Attempt to reconnect if server disconnected
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setSocketError(null);
      reconnectAttempts.current = 0;
    });

    socketInstance.on("reconnecting", (attemptNumber) => {
      console.log(`🔄 Attempting to reconnect (${attemptNumber})...`);
      reconnectAttempts.current = attemptNumber;
    });

    socketInstance.on("connect_error", (err) => {
      reconnectAttempts.current += 1;
      console.log("❌ Socket connection error:", err.message);
      console.log("Reconnect attempt:", reconnectAttempts.current);
      
      setSocketError(err.message);
      
      // Don't show error for initial connection attempts
      if (err.message === "Invalid namespace") {
        console.error("⚠️ Invalid namespace error - check that socket URL doesn't include /api");
      } else if (err.message === "websocket error") {
        console.warn("WebSocket error - falling back to polling transport");
      }
    });

    socketInstance.on("online_users", (users) => {
      console.log("📡 Online users updated:", users);
      setOnlineUsers(users);
    });

    socketInstance.on("user_online", (userId) => {
      console.log("🟢 User online:", userId);
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socketInstance.on("user_offline", (userId) => {
      console.log("🔴 User offline:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Chat event handlers
    socketInstance.on("new_message", (message) => {
      console.log("💬 New message received:", message);
    });

    socketInstance.on("messages_read", (data) => {
      console.log("✓ Messages marked as read:", data);
    });

    socketInstance.on("user_typing", ({ userId, isTyping }) => {
      console.log(`${userId} is ${isTyping ? "typing..." : "stopped typing"}`);
    });

    // Call event handlers
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

    // WebRTC event handlers
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
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("reconnect");
        socketInstance.off("reconnecting");
        socketInstance.off("connect_error");
        socketInstance.off("online_users");
        socketInstance.off("user_online");
        socketInstance.off("user_offline");
        socketInstance.off("new_message");
        socketInstance.off("messages_read");
        socketInstance.off("user_typing");
        socketInstance.off("call:incoming");
        socketInstance.off("call:accepted");
        socketInstance.off("call:rejected");
        socketInstance.off("call:ended");
        socketInstance.off("call:failed");
        socketInstance.off("webrtc:offer");
        socketInstance.off("webrtc:answer");
        socketInstance.off("webrtc:ice-candidate");
        socketInstance.disconnect();
      }
    };
  }, [user, token]);

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const joinChat = (participantId) => {
    if (socket?.connected) {
      console.log(`📚 Joining chat with: ${participantId}`);
      socket.emit("join_chat", participantId);
      return true;
    }
    console.warn("Cannot join chat - socket not connected");
    return false;
  };

  const leaveChat = (participantId) => {
    if (socket?.connected) {
      console.log(`📚 Leaving chat with: ${participantId}`);
      socket.emit("leave_chat", participantId);
      return true;
    }
    return false;
  };

  const sendTyping = (receiverId, isTyping) => {
    if (socket?.connected) {
      socket.emit("typing", { receiverId, isTyping });
      return true;
    }
    return false;
  };

  const sendMessage = (receiverId, message) => {
    if (socket?.connected) {
      socket.emit("send_message", { receiverId, message });
      return true;
    }
    console.warn("Cannot send message - socket not connected");
    return false;
  };

  const value = {
    socket,
    isConnected,
    socketError,
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