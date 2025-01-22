"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/app/services/axiosClient";
import Image from "next/image";
import { User } from "../types/Users";
import { useAuth } from "../context/authContext";
import { Button } from "../components/ui/button";
import { CheckCircle, LayoutGridIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useApi } from "../hooks/useApi";

export default function ClientPage({ username }: { username: string }) {
  const [userF, setUserF] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { getUserByUsername } = useApi();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByUsername(username, true);
        setUserF(userData);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar usuário - " + (error as Error).message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, getUserByUsername]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", newUsername);
    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      const response = await axiosClient.put(`/users/${userF?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = response.data;
      setEditProfile(false);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: updatedUser.name,
          username: updatedUser.username,
          image: updatedUser.image,
        };
      });
      setError("");
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
      window.dispatchEvent(
        new CustomEvent("profileUpdate", { detail: updatedUser })
      );
      updateUser(updatedUser);
    } catch (error: unknown) {
      setError("Erro ao editar perfil - " + (error as Error).message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-extrabold text-6xl animate-pulse">Threadly</h1>
      </div>
    );

  if (!userF) return <p>Usuário não encontrado</p>;

  return (
    <section className="col-span-1 col-start-2 w-full flex justify-center gap-16 py-6 px-2">
      <div className="flex flex-col gap-4 w-full py-6 max-w-5xl">
        <div className="flex gap-16 items-center w-full justify-center mb-6">
          {userF.image !== "" ? (
            <Avatar className="w-[150px] h-[150px]">
              <AvatarImage
                src={`http://localhost:8080/uploads/avatar/${userF.image}`}
                className="object-cover"
              />
              <AvatarFallback>
                <div className="flex-grow bg-slate-500 animate-pulse"></div>
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-[150px] h-[150px]">
              <AvatarImage
                src={"/usuario-sem-foto-de-perfil.jpg"}
                className="object-cover"
              />
              <AvatarFallback>
                <div className="flex-grow bg-slate-500 animate-pulse"></div>
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex space-x-6 items-center">
              <h2 className="text-2xl">{userF.username}</h2>
              <div className="flex items-center">
                {userF.username === user?.username ? (
                  <>
                    <Button
                      onClick={() => setEditProfile(true)}
                      className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                    >
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
        {userF.image === "" && (
          <div className="w-full flex justify-center">
            <Button variant={"outline"} onClick={() => setEditProfile(true)}>
              Adiocione uma foto de perfil
            </Button>
          </div>
        )}
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
      {editProfile && (
        <Dialog open onOpenChange={() => setEditProfile(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProfile} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                {newUsername.length >= 4 && (
                  <div className="text-green-600 flex items-center gap-1 text-sm mt-1">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs">Username disponível</span>
                  </div>
                )}
                {error && (
                  <div>
                    <p className="text-red-500 text-xs">{error}</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfileImage(e.target.files ? e.target.files[0] : null)
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              <Button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
