"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (name: string, email: string) => {
    setUser({ name, email });
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
