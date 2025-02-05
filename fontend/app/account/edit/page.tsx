"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/hooks/use-toast";
import axiosClient from "@/app/services/axiosClient";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

const AccountEditPage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [profileImage, setProfileImage] = useState<File | "">("");
  const [currentImage, setCurrentImage] = useState(user?.image || "");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    } else {
      setPreviewImage("");
    }
  }, [profileImage]);

  const handleRemoveImage = () => {
    setProfileImage("");
    setPreviewImage("");
    setCurrentImage("");
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", newUsername);
    if (profileImage !== "") {
      formData.append("image", profileImage);
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosClient.put(`/users/${user?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = response.data;
      setError(null);
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
      updateUser(updatedUser);
    } catch (error: unknown) {
      setError("Erro ao editar perfil - " + (error as Error).message);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10 px-5">
      <div className="flex flex-col gap-12">
        <h1 className="text-2xl font-bold">Editar perfil</h1>
        <form onSubmit={handleEditProfile} className="flex flex-col gap-4">
          <DropdownMenu>
            <div className="w-full flex justify-between items-center py-3 px-3 bg-muted rounded-3xl">
              <div className="flex items-center gap-2">
                <Avatar className="w-[80px] h-[80px] shadow-md">
                  <AvatarImage
                    src={
                      previewImage ||
                      (currentImage
                        ? `http://localhost:8080/uploads/avatar/${currentImage}`
                        : "/usuario-sem-foto-de-perfil.jpg")
                    }
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <div className="flex-grow bg-slate-500 animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user?.username}</h3>
                  <h4 className="text-gray-400 text-sm">{user?.name}</h4>
                </div>
              </div>
              <DropdownMenuTrigger asChild>
                <Button className="text-xs font-semibold shadow-md rounded-xl">
                  Alterar imagem
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleRemoveImage}>
                Remover imagem
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => document.getElementById("fileInput")?.click()}
              >
                Carregar nova imagem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-semibold">
              Nome
            </label>
            <Input
              name="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-lg font-semibold">
              Username
            </label>
            <Input
              name="username"
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
            <Input
              type="file"
              accept="image/*"
              id="fileInput"
              onChange={(e) =>
                setProfileImage(e.target.files ? e.target.files[0] : "")
              }
              className="p-2 border border-gray-300 rounded-lg hidden"
            />
            {error && (
              <div>
                <p className="text-red-500 text-xs">{error}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccountEditPage;
