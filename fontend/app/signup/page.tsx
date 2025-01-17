"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../context/authContext";

const SignUpPare = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("Please fill all the fields.");
      return;
    }

    if (username.length < 6) {
      setError("Username must be at least 6 characters long.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axiosClient.post("/register", {
        username,
        name,
        email,
        password,
      });

      await login(username, password);

      setEmail("");
      setPassword("");
      setUsername("");
      setName("");
    } catch (err) {
      setError(`Invalid username or password. ${(err as Error).message}`);
    }
  };

  return (
    <section className="fixed top-0 left-0 w-screen h-screen= z-50 flex items-center justify-center">
      <div className="flex flex-col gap-6 items-center justify-center h-screen px-5">
        <div className="p-8 rounded shadow-md w-full max-w-sm border-[0.5px] border-white/10">
          <div className="mb-6 space-y-3">
            <h3 className="text-5xl font-extrabold text-center mb-4">
              Threadly
            </h3>
            <p className="font-semibold text-gray-400 text-lg leading-6 text-center">
              Cadastre-se para ver fotos e vídeos dos seus amigos.
            </p>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 mb-5">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={async (e) => {
                  setEmail(e.target.value);
                  setError(null);
                  try {
                    const response = await axiosClient.get(
                      "/users?email=" + e.target.value
                    );
                    if (response.data.exists) {
                      setError("Email already in use.");
                    }
                  } catch (err) {
                    setError(`Error checking email. ${(err as Error).message}`);
                  }
                }}
                required
                className="focus-visible:ring-0 text-xs"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-0 text-xs"
              />
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-visible:ring-0 text-xs"
              />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={async (e) => {
                  setUsername(e.target.value);
                  setError(null);
                  try {
                    const response = await axiosClient.get(
                      "/users?username=" + e.target.value
                    );
                    if (response.data.exists) {
                      setError("Username already in use.");
                    }
                  } catch (err) {
                    setError(
                      `Error checking username. ${(err as Error).message}`
                    );
                  }
                }}
                required
                className="focus-visible:ring-0 text-xs"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full text-black/50 font-semibold"
            >
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpPare;
