"use client";

import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface PostItemProps {
  post: Post;
  users: User[];
  createComment: (postId: string, authorId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  createAnswer: (commentId: string, authorId: string, content: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  deletePost: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  users,
  createComment,
  deleteComment,
  toggleLike,
  deletePost,
  createAnswer,
}) => {
  const { user } = useAuth();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleToggleLike = () => {
    if (user) {
      toggleLike(post.id, user.id);
    }
  };

  const handleDeletePost = () => {
    deletePost(post.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href={`/${post.user.username}`}>
            {post.user?.image !== "" ? (
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={`http://localhost:8080/uploads/avatar/${post.user?.image}`}
                  className="object-cover"
                />
                <AvatarFallback>
                  <div className="flex-grow bg-slate-500 animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={"/usuario-sem-foto-de-perfil.jpg"}
                  className="object-cover"
                />
                <AvatarFallback>
                  <div className="flex-grow bg-slate-500 animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            )}
          </Link>
          <Link href={`/${post.user.username}`}>
            <h3 className="font-normal text-base">{post.user.username}</h3>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"link"} className="hover:no-underline p-0">
              <EllipsisVerticalIcon size={30} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/${post.user.username}`} className="w-full py-2">
                Ver perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              {user?.id !== post.user.id && (
                <Button
                  variant={"link"}
                  className="w-full text-red-600 py-0 px-0 m-0 text-left justify-start hover:no-underline gap-0"
                >
                  Denunciar
                </Button>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {user?.id === post.user.id && (
                <Button
                  variant={"link"}
                  className="w-full text-red-600 py-0 px-0 m-0 text-left justify-start hover:no-underline gap-0"
                  onClick={() => setIsAlertOpen(true)}
                >
                  Excluir
                </Button>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3">
        <div className="relative w-[468px] h-[585px]">
          <Image
            src={`http://localhost:8080/uploads/${post.images[0].url}`}
            alt={"post image " + post.id}
            priority
            layout="fill"
            className="object-cover rounded-lg"
          />
        </div>
        <PostActions post={post} users={users} onLike={handleToggleLike} />
        <div className="mt-3">
          <p className="text-base">
            <span className="text-base font-semibold">{post.user.name}</span>{" "}
            {post.content}
          </p>
          <span className="text-xs text-gray-500">
            {dateConvert(post.created_at)}
          </span>
        </div>
      </div>

      <PostComments
        post={post}
        users={users}
        createComment={createComment}
        deleteComment={deleteComment}
        createAnswer={createAnswer}
      />

      {isAlertOpen && (
        <AlertDialog open onOpenChange={() => setIsAlertOpen(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir postagem?</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja excluir essa postagem?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeletePost()}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PostItem;
