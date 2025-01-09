"use client";

import { useRouter } from "next/navigation";
import PostsList from "./components/PostsList";
import { useAuth } from "./context/authContext";
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import axiosClient from "./services/axiosClient";
import { User } from "./types/Users";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import Link from "next/link";
import { Button } from "./components/ui/button";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userLogged, setUserLogged] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }

    axiosClient
      .get(`/users?username=${user?.username}`)
      .then((response) => {
        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setUserLogged(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-extrabold text-6xl animate-pulse">Threadly</h1>
      </div>
    );

  return (
    <div className="grid grid-cols-[18%_80%] w-screen h-screen relative items-stretch">
      <div className="col-span-1 fixed top-0 left-0 h-full">
        <Menu user={userLogged} />
      </div>
      <div className="col-span-1 col-start-2 flex justify-center w-full gap-16 py-6 px-2">
        <PostsList />
        <section className="flex justify-between items-center h-fit w-96 p-6">
          <div className="flex items-center gap-2">
            <Link href={`/${userLogged?.username}`}>
              <Avatar>
                <AvatarImage src={userLogged?.image} />
                <AvatarFallback>
                  <div className="flex-grow bg-slate-500 animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="leading-5">
              <Link href={`/${userLogged?.username}`}>
                <h3 className="font-semibold">{userLogged?.username}</h3>
              </Link>
              <h5 className="text-gray-400">{userLogged?.name}</h5>
            </div>
          </div>
          <Button
            variant="link"
            className="text-blue-500 px-4 py-2 rounded-md"
            onClick={logout}
          >
            Mudar
          </Button>
        </section>
      </div>
    </div>
  );
}
