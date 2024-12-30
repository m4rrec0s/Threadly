"use client";

import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
  };

  return (
    <div className="flex items-center justify-center h-screen px-5">
      <div className="p-8 rounded shadow-md w-full max-w-sm border-[0.5px] border-white/10">
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-extrabold text-center mb-4">Threadly</h3>
          <div className="my-6 space-y-3">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-visible:ring-0 text-xs"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-0 text-xs"
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </div>
        </form>
        <div className="flex justify-between items-center w-full max-w-md mt-4">
          <div className="bg-white/10 h-[1px] w-full"></div>
          <span className="text-white text-xs mx-4">OR</span>
          <div className="bg-white/10 h-[1px] w-full"></div>
        </div>
        <div className="flex justify-center items-center mt-4">
          <Button className="w-full">
            <span>Sign in with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
