// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { User } from "@/types/auth";
import { toast } from "sonner"; // <-- import toast

interface AuthContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ user: User }>(
        `https://bill-backend-j5en.onrender.com/auth/user`,
        { withCredentials: true }
      );
      setUser(res.data.user);
      toast.success("User fetched successfully!");
    } catch (err: any) {
      setUser(null);
      toast.error(err?.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `https://bill-backend-j5en.onrender.com/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err: any) {
      console.error("Logout error:", err);
      toast.error(err?.response?.data?.message || "Logout failed!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
