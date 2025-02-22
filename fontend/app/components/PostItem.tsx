"use client";

import { Post } from "../types/Posts";
import { User } from "../types/Users";
import PostActions from "./PostActions";
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
import { dateConvert } from "../helpers/dateConvert";
import { Input } from "./ui/input";

interface PostItemProps {
  post: Post;
  users: User[];
  createComment: (postId: string, authorId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  createAnswer: (commentId: string, authorId: string, content: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  deletePost: (postId: string) => void;
  onPostUpdated: (post: Post) => void;
  getPostById: (postId: string) => Promise<Post>;
  openPostModal: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  users,
  // createComment,
  // deleteComment,
  toggleLike,
  deletePost,
  // createAnswer,
  onPostUpdated,
  getPostById,
  openPostModal,
}) => {
  const { user } = useAuth();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleToggleLike = async () => {
    if (user) {
      toggleLike(post.id, user.id);
      const updatedPost = await getPostById(post.id);
      onPostUpdated(updatedPost);
    }
  };

  const handleDeletePost = () => {
    deletePost(post.id);
  };

  // const handleCreateComment = async (
  //   postId: string,
  //   authorId: string,
  //   content: string
  // ) => {
  //   createComment(postId, authorId, content);
  //   const updatedPost = await getPostById(postId);
  //   onPostUpdated(updatedPost);
  // };

  // const handleDeleteComment = async (commentId: string) => {
  //   deleteComment(commentId);
  //   const updatedPost = await getPostById(post.id);
  //   onPostUpdated(updatedPost);
  // };

  // const handleCreateAnswer = async (
  //   commentId: string,
  //   authorId: string,
  //   content: string
  // ) => {
  //   createAnswer(commentId, authorId, content);
  //   const updatedPost = await getPostById(post.id);
  //   onPostUpdated(updatedPost);
  // };

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
        <div className="relative w-full h-ful max-sm:min-w-[440px] min-w-[468px] max-w-[468px] h-[585px] mx-auto">
          <Image
            src={`http://localhost:8080/uploads/${post.images[0].url}`}
            alt={"post image " + post.id}
            priority
            layout="fill"
            className="object-cover rounded-lg aspect-auto"
          />
        </div>
        <PostActions
          post={post}
          users={users}
          onLike={handleToggleLike}
          openPostModal={() => openPostModal(post.id)}
        />
        <div className="mt-2 w-full">
          <p className="text-base max-w-[468px]">
            <span className="text-base font-semibold">{post.user.name}</span>{" "}
            {post.content}
          </p>
          <span className="text-xs text-gray-500">
            {dateConvert(post.created_at)}
          </span>
        </div>
      </div>

      {/* <PostComments
        post={post}
        users={users}
        createComment={handleCreateComment}
        deleteComment={handleDeleteComment}
        createAnswer={handleCreateAnswer}
        commentCount={post.commentCount || 0}
      /> */}

      {post.commentCount > 0 && (
        <div className="mt-2">
          <Button
            onClick={() => openPostModal(post.id)}
            variant={"link"}
            className="text-gray-500 text-sm px-0 hover:no-underline"
          >
            Ver todos os {post.commentCount} comentários
          </Button>
        </div>
      )}

      <div className="mt-2">
        <Input placeholder="Adicione um comentário" />
      </div>

      {/* Apagar postagem */}
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

      <div className="border border-t mt-5 mx-5 border-white/20" />
    </div>
  );
};

export default PostItem;
