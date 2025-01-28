"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MoreVerticalIcon, SendIcon } from "lucide-react";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useApi } from "../hooks/useApi";
import { Comment } from "../types/Comments";
import { Post } from "../types/Posts";
import Link from "next/link";

interface PostCommentsProps {
  post: Post;
  users: User[];
  createComment: (postId: string, authorId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  createAnswer: (commentId: string, authorId: string, content: string) => void;
  commentCount: number;
}

const PostComments: React.FC<PostCommentsProps> = ({
  post,
  users,
  createComment,
  deleteComment,
  createAnswer,
  commentCount,
}) => {
  const { getComments, getPostById } = useApi();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [replyTo, setReplyTo] = useState<User | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);

  const handleOpenComments = async () => {
    setShowDialog(true);
    try {
      const fetched = await getComments(post.id);
      setComments(fetched);
    } catch {
      console.error("Erro ao buscar comentários");
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleReply = (commentId: string, usr: User) => {
    setReplyTo(usr);
    setReplyCommentId(commentId);
    setCommentContent(`@${usr.username} `);
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim() && user) {
      if (replyCommentId) {
        await createAnswer(commentContent, user.id, replyCommentId);
      } else {
        await createComment(post.id, user.id, commentContent);
      }
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      const updatedPost = await getPostById(post.id);
      post.commentCount = updatedPost.commentCount;
      setCommentContent("");
      setReplyTo(null);
      setReplyCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    const updatedComments = await getComments(post.id);
    setComments(updatedComments);
    const updatedPost = await getPostById(post.id);
    post.commentCount = updatedPost.commentCount;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && commentContent === `@${replyTo?.username} `) {
      setCommentContent("");
      setReplyTo(null);
      setReplyCommentId(null);
    }
  };

  return (
    <div>
      {commentCount > 0 && (
        <Button
          variant="link"
          onClick={handleOpenComments}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-0 hover:no-underline"
        >
          Ver todos os {commentCount} comentários
        </Button>
      )}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="text-sm flex-grow">
          <DialogHeader className="hidden">
            <DialogTitle>Comentários</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex items-center space-x-2">
              {post.user &&
                (post.user?.image !== "" ? (
                  <Avatar>
                    <AvatarImage
                      src={`http://localhost:8080/uploads/avatar/${post.user?.image}`}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <div className="flex-grow bg-slate-500 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage src={"/usuario-sem-foto-de-perfil.jpg"} />
                    <AvatarFallback>
                      <div className="flex-grow bg-slate-500 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                ))}
              <div className="flex flex-col">
                <p>
                  <span className="font-semibold text-base">
                    {post.user.username}
                  </span>{" "}
                  {post.content}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {dateConvert(post.created_at)}
            </span>
          </div>

          <div className="border-b border-gray-600"></div>

          {comments.map((comment) => {
            const userComment = users.find(
              (user) => user.id === comment.author_id
            );

            return (
              <div key={comment.id} className="">
                <div className="flex items-center justify-between">
                  <div className="mt-3 flex items-center space-x-2">
                    {userComment?.image !== "" ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`http://localhost:8080/uploads/avatar/${userComment?.image}`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <div className="flex-grow bg-slate-500 animate-pulse"></div>
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={"/usuario-sem-foto-de-perfil.jpg"}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <div className="flex-grow bg-slate-500 animate-pulse"></div>
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p>
                        <span className="font-semibold text-base">
                          {userComment?.username}
                        </span>{" "}
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {dateConvert(comment.created_at)}
                        </span>
                        <Button
                          variant={"link"}
                          className="p-0 hover:no-underline text-gray-500"
                          onClick={() =>
                            userComment && handleReply(comment.id, userComment)
                          }
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                  {user?.id === comment.author_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="link"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreVerticalIcon size={30} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {comment.answers &&
                  comment.answers.map((answer) => {
                    const userAnswers = users.find(
                      (user) => user.id === answer.author_id
                    );
                    return (
                      <div
                        key={answer.id}
                        className="ml-8 mt-3 flex items-center space-x-2"
                      >
                        {userAnswers?.image !== "" ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={`http://localhost:8080/uploads/avatar/${userAnswers?.image}`}
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
                        <div className="flex flex-col">
                          <p>
                            <span className="font-semibold text-base">
                              {userAnswers?.username}
                            </span>{" "}
                            {answer.content.startsWith("@") ? (
                              <>
                                <Link
                                  href={`/${answer.content
                                    .split(" ")[0]
                                    .substring(1)}`}
                                  className="text-blue-600 px-1 py-0.5 rounded-md font-semibold hover:opacity-80"
                                >
                                  {answer.content.split(" ")[0]}
                                </Link>
                                {` ${answer.content
                                  .split(" ")
                                  .slice(1)
                                  .join(" ")}`}
                              </>
                            ) : (
                              answer.content
                            )}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {dateConvert(answer.created_at)}
                            </span>
                            <Button
                              variant={"link"}
                              className="p-0 hover:no-underline text-gray-500 "
                              onClick={() =>
                                userAnswers &&
                                handleReply(comment.id, userAnswers)
                              }
                            >
                              Responder
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
          {comments.length === 0 && (
            <div className="w-full mt-2 text-center">
              <h3 className="text-sm text-gray-400">
                Ainda não há nenhum comentário
              </h3>
            </div>
          )}

          {replyTo && (
            <div className="bg-gray-800 p-2 rounded-md mb-0 w-full flex items-center justify-between">
              <p>
                Respondendo a{" "}
                <span className="font-semibold">@{replyTo.username}</span>
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setReplyTo(null);
                  setReplyCommentId(null);
                  setCommentContent("");
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            </div>
          )}

          <form
            className="mt-3 flex gap-3 items-center"
            onSubmit={handleCreateComment}
          >
            <Input
              type="text"
              placeholder="Adicione um comentário..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="submit" className="text-sm px-2 font-semibold">
              <SendIcon className="!w-5 !h-5" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <form
        onSubmit={handleCreateComment}
        className="mt-3 flex gap-3 items-center"
      >
        <Input
          type="text"
          placeholder="Adicione um comentário..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" className="text-sm px-2 font-semibold">
          <SendIcon className="!w-5 !h-5" />
        </Button>
      </form>
      <div className="border-b border-gray-600 py-2"></div>
    </div>
  );
};

export default PostComments;
