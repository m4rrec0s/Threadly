import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useApi } from "../hooks/useApi";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Post } from "../types/Posts";
import Image from "next/image";
import { XIcon } from "lucide-react";

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
  const { createPost } = useApi();

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
      const newPost = await createPost(formData);
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
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-center">Crie seu post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {image && (
              <div className="relative w-fit">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded object-cover"
                />
                <Button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <XIcon size={10} />
                </Button>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              {!image && (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Clique para enviar
                        </span>{" "}
                        ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG ou GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/gif"
                      className="hidden"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </label>
                </div>
              )}
              <Textarea
                placeholder="Escreva algo..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0"
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="text-sm px-5 font-semibold w-fit"
              >
                Criar Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostForm;
