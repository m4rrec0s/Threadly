"use client";

import axiosClient from "@/app/services/axiosClient";
import { User } from "@/app/types/Users";
import Image from "next/image";
import { useEffect, useState, use } from "react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: ProfilePageProps) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    axiosClient
      .get(`/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <section className="flex flex-col w-screen h-screen">
      <header className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Profile</h1>
      </header>
      <main className="flex flex-col items-center p-5">
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <Image
            src={`https://picsum.photos/200?random=${id}`}
            alt={`${user?.name} avatar`}
            className="rounded-full object-cover"
            width={200}
            height={200}
          />
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </main>
    </section>
  );
}
