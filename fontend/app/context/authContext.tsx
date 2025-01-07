"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id?: string;
  name: string;
  email: string;
  image: string;
  username: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
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
  const router = useRouter();

  // Inicializa como null para evitar acesso no SSR
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // UseEffect para buscar dados do localStorage no cliente
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUserJson =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (storedToken && storedUserJson) {
      setToken(storedToken);
      setUser(JSON.parse(storedUserJson));
    }
    setIsInitialized(true);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      const { token, user } = response.data;

      // Salva apenas no momento do login, após SSR
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
