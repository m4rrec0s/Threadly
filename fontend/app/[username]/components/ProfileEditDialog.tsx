"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
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
import { useState, useEffect } from "react";

interface ProfileEditDialogProps {
  name: string;
  setName: (name: string) => void;
  newUsername: string;
  setNewUsername: (username: string) => void;
  profileImage: File | "";
  setProfileImage: (file: File | "") => void;
  handleEditProfile: (e: React.FormEvent) => void;
  error: string | null;
  setEditProfile: (open: boolean) => void;
  currentImage: string;
  setCurrentImage: (image: string) => void;
}

export default function ProfileEditDialog({
  name,
  setName,
  newUsername,
  setNewUsername,
  profileImage,
  setProfileImage,
  handleEditProfile,
  error,
  setEditProfile,
  currentImage,
  setCurrentImage,
}: ProfileEditDialogProps) {
  const [previewImage, setPreviewImage] = useState<string>("");

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

  return (
    <Dialog open onOpenChange={() => setEditProfile(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditProfile} className="flex flex-col gap-4">
          <DropdownMenu>
            <div className="w-full flex justify-center">
              <DropdownMenuTrigger asChild>
                {previewImage ? (
                  <Avatar className="w-[150px] h-[150px]">
                    <AvatarImage src={previewImage} className="object-cover" />
                    <AvatarFallback>
                      <div className="flex-grow bg-slate-500 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                ) : currentImage !== "" ? (
                  <Avatar className="w-[150px] h-[150px]">
                    <AvatarImage
                      src={`http://localhost:8080/uploads/avatar/${currentImage}`}
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
          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
