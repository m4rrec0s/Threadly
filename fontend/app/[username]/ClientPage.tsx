"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/app/services/axiosClient";
import Image from "next/image";
import { User } from "../types/Users";
import Menu from "../components/Menu";
import { useAuth } from "../context/authContext";
import { Button } from "../components/ui/button";
import { LayoutGridIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function ClientPage({ username }: { username: string }) {
  const [userF, setUserF] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosClient.get(
          `/users?username=${username}`
        );
        const userData = Array.isArray(userResponse.data)
          ? userResponse.data[0]
          : userResponse.data;

        const postsResponse = await axiosClient.get(
          `/posts?user_id=${userData.id}`
        );
        const postsData = postsResponse.data;

        setUserF({ ...userData, posts: postsData });
        console.log({ ...userData, posts: postsData });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-extrabold text-6xl animate-pulse">Threadly</h1>
      </div>
    );

  if (!userF) return <p>Usuário não encontrado</p>;

  return (
    <div className="grid grid-cols-[18%_80%] w-screen h-screen relative items-stretch">
      <div className="col-span-1 fixed top-0 left-0 h-full">
        <Menu user={user} />
      </div>
      <section className="col-span-1 col-start-2 w-full flex justify-center gap-16 py-6 px-2">
        <div className="flex flex-col gap-4 w-full py-6 max-w-5xl">
          <div className="flex gap-16 items-center w-full justify-center mb-6">
            <Avatar className="h-[150px] w-[150px]">
              <AvatarImage src={userF?.image} />
              <AvatarFallback>
                <div className="flex-grow bg-slate-500 animate-pulse"></div>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex space-x-6 items-center">
                <h2 className="text-2xl">{userF.username}</h2>
                <div className="flex items-center">
                  {userF.username === user?.username ? (
                    <>
                      <Button className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                        Editar perfil
                      </Button>
                      <Button className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                        Itens Arquivados
                      </Button>
                    </>
                  ) : (
                    <Button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Seguir
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex gap-6 my-4">
                <h3 className="text-xl font-light">
                  <strong className="font-bold">{userF.posts.length}</strong>{" "}
                  {userF.posts.length === 1 ? "publicação" : "publicações"}
                </h3>
                {/* <h3 className="text-sm text-gray-500">
                  {userF.followers.length} seguidores
                </h3>
                <h3 className="text-sm text-gray-500">
                  {userF.following.length} seguindo
                </h3> */}
                <h3 className="text-xl font-light">
                  <strong className="font-bold">10</strong> seguidores
                </h3>
                <h3 className="text-xl font-light">70 seguindo</h3>
              </div>
              <h3 className="text-lg font-medium">{userF.name}</h3>
            </div>
          </div>
          <div className="w-full border border-white/10"></div>
          <div className="flex justify-center w-full items-center gap-3">
            <LayoutGridIcon className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Publicações</h3>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {userF.posts.length > 0 ? (
              userF.posts.map((post) => (
                <div key={post.id} className="w-full h-0 pb-[100%] relative">
                  <Image
                    src={`http://localhost:8080/uploads/${post.images[0].url}`}
                    alt={post.content}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full flex-grow">
                <h3 className="text-lg text-center">
                  Nenhuma publicação encontrada
                </h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
