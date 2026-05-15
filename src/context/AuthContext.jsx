import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      "Content-Type": "application/json"
    }
  });

  api.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  });

const login = async (credentials) => {
  setLoading(true);

  try {
    console.log("Sending login request with:", credentials);

   
    let endpoint = "/auth/login";

    if (credentials.role === "admin") {
      endpoint = "/auth/admin/login";
    } else if (credentials.role === "parent") {
      endpoint = "/auth/parent/login";
    } else if (credentials.role === "student") {
      endpoint = "/auth/student/login";
    } else if (credentials.role === "warden") {
      endpoint = "/auth/warden/login";
    }

   
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    const response = await api.post(endpoint, loginData);

    console.log("Login response:", response.data);

    if (response.data.success) {
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      toast.success(`Welcome back, ${user.name || 'User'}!`);

    
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'parent') {
        navigate('/parent/dashboard');
      } else if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'warden') {
        navigate('/warden/dashboard');
      } else {
        navigate('/dashboard');
      }

      return { success: true, user };
    } else {
      toast.error(response.data.message || "Login failed");
      return { success: false };
    }

  } catch (error) {
    console.error("Login error:", error);

    const message =
      error.response?.data?.message || "Login failed. Please try again.";

    toast.error(message);

    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

  
  const register = async (userData) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.success) {
        toast.success("Registration successful!");
        navigate("/login");
        return { success: true };
      } else {
        toast.error(response.data.message || "Registration failed");
        return { success: false };
      }

    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";

      toast.error(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    role: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};