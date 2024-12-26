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
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded shadow-md w-full max-w-md"
      >
        <h3>Faça seu login</h3>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Nome</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <span>
          <Button type="submit">Entrar</Button>
        </span>
      </form>
    </div>
  );
}
