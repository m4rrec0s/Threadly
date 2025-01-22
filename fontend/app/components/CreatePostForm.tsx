import { useState } from "react";
import { useAuth } from "../context/authContext";
import axiosClient from "../services/axiosClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Post } from "../types/Posts";

interface CreatePostFormProps {
  onPostCreated: (newPost: Post) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onPostCreated,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) {
      setError("Conteúdo ou usuário inválido");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", user.id);
    if (image) {
      formData.append("images", image);
    }

    try {
      const response = await axiosClient.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newPost = response.data;
      setContent("");
      setImage(null);
      setError("");
      onPostCreated(newPost);
    } catch (error: unknown) {
      setError("Erro ao criar post - " + (error as Error).message);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Crie seu post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <Textarea
              placeholder="Escreva algo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
            <Button type="submit" className="text-sm px-2 font-semibold">
              Criar Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostForm;
