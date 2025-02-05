"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  PostModal,
  PostModalContent,
  PostModalDescription,
  PostModalHeader,
  PostModalTitle,
} from "@/app/components/ui/postModal";
import { dateConvert } from "@/app/helpers/dateConvert";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { useApi } from "@/app/hooks/useApi";
import { Post } from "@/app/types/Posts";
import { Comment } from "@/app/types/Comments";
import { Answer } from "@/app/types/Answer";
import { Button } from "@/app/components/ui/button";
import { User } from "@/app/types/Users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { MoreVerticalIcon, SendIcon } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { renderContentWithMention } from "@/app/helpers/mentionHelper";
import PostActions from "@/app/components/PostActions";
import PostSkeleton from "@/app/p/[post_id]/_components/Skeleton";

interface PostPageProps {
  postId: string;
  onClose: () => void;
}

interface AnswerWithUser extends Answer {
  user: User;
}

interface CommentWithUser extends Comment {
  user: User;
}

export default function PostPage({ postId, onClose }: PostPageProps) {
  const { user } = useAuth();
  const {
    getPostById,
    getComments,
    getUserById,
    getAnswers,
    createComment,
    deleteComment,
    createAnswer,
    deleteAnswer,
    toggleLike,
    getLikesByPost,
  } = useApi();

  const [post, setPost] = useState<Post>();
  const [usersLiked, setUsersLiked] = useState<User[]>([]);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [answers, setAnswers] = useState<AnswerWithUser[]>([]);
  const [replyTo, setReplyTo] = useState<User | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = async () => {
    try {
      const responseP = await getPostById(postId);
      const responseC = await getComments(postId);

      const commentsData = await Promise.all(
        responseC.map(async (comment: Comment) => {
          const user = await getUserById(comment.author_id);
          return {
            ...comment,
            user: user ? user : {},
          };
        })
      );

      const usersLData = await getLikesByPost(postId);

      const answersData = await Promise.all(
        responseC.map(async (comment: Comment) => {
          const responseA = await getAnswers(comment.id);
          return responseA;
        })
      );

      const answersWithUser = await Promise.all(
        answersData.flat().map(async (answer: Answer) => {
          const user = await getUserById(answer.author_id);
          return {
            ...answer,
            user: user ? user : ({} as User),
          };
        })
      );

      setPost(responseP);
      setUsersLiked(usersLData);
      setComments(commentsData);
      setAnswers(answersWithUser);
      setIsLoading(false);
    } catch (error: unknown) {
      setError("Error fetching post - " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user || !post) return;

    try {
      await toggleLike(post.id, user.id);
      const updatedPost = await getPostById(post.id);
      setPost(updatedPost);
      const updatedLikes = await getLikesByPost(post.id);
      setUsersLiked(updatedLikes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like post");
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleReply = (commentId: string, usr: User) => {
    setReplyTo(usr);
    setReplyCommentId(commentId);
    setCommentContent(`@${usr.username} `);
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !user || !post) return;

    try {
      if (replyCommentId) {
        await createAnswer(commentContent, user.id, replyCommentId);
      } else {
        await createComment(post.id, user.id, commentContent);
      }

      fetchPost();

      setCommentContent("");
      setReplyTo(null);
      setReplyCommentId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;

    try {
      await deleteComment(commentId);

      fetchPost();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    try {
      await deleteAnswer(answerId);

      fetchPost();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete answer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && commentContent === `@${replyTo?.username} `) {
      setCommentContent("");
      setReplyTo(null);
      setReplyCommentId(null);
    }
  };

  if (error) {
    return (
      <PostModal open onOpenChange={onClose}>
        <PostModalContent className="w-screen h-[90vh]">
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </PostModalContent>
      </PostModal>
    );
  }

  if (isLoading) {
    return (
      <PostModal open onOpenChange={onClose}>
        <PostModalContent className="w-screen h-[90vh]">
          <PostSkeleton />
        </PostModalContent>
      </PostModal>
    );
  }

  if (!post) {
    return (
      <PostModal open onOpenChange={onClose}>
        <PostModalContent className="w-screen h-[90vh]">
          <div className="flex justify-center items-center h-full">
            <p>Post not found</p>
          </div>
        </PostModalContent>
      </PostModal>
    );
  }

  return (
    <PostModal open onOpenChange={onClose}>
      <PostModalContent className="w-screen h-[90vh] gap-2">
        <PostModalHeader className="hidden">
          <PostModalTitle>Post {postId}</PostModalTitle>
          <PostModalDescription>{post.content}</PostModalDescription>
        </PostModalHeader>
        <section className="grid grid-cols-2 gap-4 h-full max-sm:grid-cols-1 overflow-hidden">
          {/* post image */}
          <div className="relative w-full h-full max-sm:w-full max-sm:h-96">
            <Image
              src={`http://localhost:8080/uploads/${post.images[0].url}`}
              alt={"post image " + post.id}
              priority
              layout="fill"
              className="object-cover rounded-lg"
            />
          </div>
          {/* Post Content - Right Side */}
          <div className="grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
            {/* Post Header */}
            <div>
              <div className="flex items-center space-x-2 p-2 border-b">
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

            {/* <div className="border-b border-gray-600 my-2"></div> */}

            {/* Comments Section - Scrollable */}
            <div className="overflow-y-auto p-2">
              <ul className="space-y-2">
                {comments.map((comment) => (
                  <li key={comment.id} className="mt-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {comment.user && comment.user.image ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`http://localhost:8080/uploads/avatar/${comment.user.image}`}
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
                              {comment.user?.username}
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
                                comment.user &&
                                handleReply(comment.id, comment.user)
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
                    {answers
                      .filter((answer) => answer.comment_id === comment.id)
                      .map((answer) => (
                        <div key={answer.id} className="mt-2 ml-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {answer.user && answer.user.image ? (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={`http://localhost:8080/uploads/avatar/${answer.user.image}`}
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
                                    {answer.user?.username}
                                  </span>{" "}
                                  {renderContentWithMention(answer.content)}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {dateConvert(answer.created_at)}
                                  </span>
                                  <Button
                                    variant={"link"}
                                    className="p-0 hover:no-underline text-gray-500 "
                                    onClick={() =>
                                      answer &&
                                      handleReply(comment.id, answer.user)
                                    }
                                  >
                                    Responder
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {user?.id === answer.author_id && (
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
                                    onClick={() =>
                                      answer && handleDeleteAnswer(answer.id)
                                    }
                                  >
                                    Deletar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                  </li>
                ))}
                {comments.length === 0 && (
                  <li className="w-full mt-2 text-center">
                    <h3 className="text-sm text-center text-gray-400">
                      Ainda não há nenhum comentário
                    </h3>
                  </li>
                )}
              </ul>
            </div>

            {/* Fixed Actions and Comment Input */}
            <div className="flex-none mt-2">
              <div className="border-t border-gray-600"></div>
              <PostActions
                onLike={handleToggleLike}
                openPostModal={() => {}}
                post={post}
                users={usersLiked}
              />
              <div className="border-b border-gray-600 w-full"></div>
              <form
                className="flex gap-3 items-center py-2"
                onSubmit={handleCreateComment}
              >
                <Input
                  type="text"
                  placeholder="Adicione um comentário..."
                  className="border-none focus:outline-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="submit" className="text-sm px-2 font-semibold">
                  <SendIcon className="!w-5 !h-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </PostModalContent>
    </PostModal>
  );
}
