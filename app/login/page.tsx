"use client";

import { useForm } from "react-hook-form";
import { LockIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { signIn } = useAuth();

  async function handleSignIn(data: FormData) {
    await signIn(data);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-extrabold">Bem vindo!</h1>
      <div className="mt-6">
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="flex flex-col gap-3 min-w-[500px]"
        >
          <Input type="email" placeholder="Email" {...register("email")} />
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <Button type="submit">
            <LockIcon size={24} />
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
