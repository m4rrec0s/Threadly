import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import axiosClient from "../services/axiosClient";

import { signInRequest } from "../services/auth";
// import { api } from "../services/api";
import { Post } from "../types/Posts";

type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  posts: Post[];
};

type SignInData = {
  email: string;
  password: string;
  image: string;
  name: string;
  posts: Post[];
  username: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const router = useRouter();

  const signOut = useCallback(() => {
    destroyCookie(undefined, "nextauth.token");
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      axiosClient
        .get("/me")
        .then((response) => setUser(response.data))
        .catch(() => signOut());
    }
  }, [signOut]);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const { token, user } = await signInRequest({ email, password });

      setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 }); // 1 hora

      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Adicionar feedback visual ao usuário
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
