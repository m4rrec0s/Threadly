"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/app/services/axiosClient";
import Image from "next/image";
import { User } from "../types/Users";

export default function ClientPage({ username }: { username: string }) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/users?username=${username}`)
      .then((response) => {
        // Se json-server retorna um array, pegue o primeiro item
        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        console.log(userData);
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Usuário não encontrado</p>;

  return (
    <section className="flex flex-col w-screen h-screen">
      <header className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Profile</h1>
      </header>
      <main className="flex flex-col items-center p-5">
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <Image
            src={`${user.image}?random=${user.id}`}
            alt={`${user.name} avatar`}
            className="rounded-full object-cover"
            width={200}
            height={200}
          />
          <h2 className="text-2xl font-bold">@{user.username}</h2>
          <h3 className="text-sm text-gray-500">{user.name}</h3>
        </div>
      </main>
    </section>
  );
}
