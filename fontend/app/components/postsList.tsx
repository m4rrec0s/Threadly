"use client";

import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import Image from "next/image";
import { dateConvert } from "../helpers/dateConvert";
import { Button } from "./ui/button";
import { HeartIcon, MessageCircle, Send, SendIcon } from "lucide-react";
import { User } from "../types/Users";
import { Post } from "../types/Posts";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axiosClient.get("/users");
      const usersData = response.data;
      setUsers(usersData);

      const allPosts = usersData.flatMap((user: User) =>
        user.posts.map((post) => ({
          ...post,
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
            username: user.username,
          },
        }))
      );
      allPosts.sort(
        (a: Post, b: Post) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setPosts(allPosts);
    } catch (error: unknown) {
      setError("Error fetching posts - " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex-grow">
        <div className="flex items-center py-6 h-full overflow-y-hidden">
          <div className="space-y-6 w-full flex flex-col items-center max-w-2xl mx-auto">
            <div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-[500px] w-[500px]" />

                <div className="mt-6 space-y-3">
                  <Skeleton className="h-5 w-96" />
                  <Skeleton className="h-5 w-80" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-[500px] w-[500px]" />

                <div className="mt-6 space-y-3">
                  <Skeleton className="h-5 w-96" />
                  <Skeleton className="h-5 w-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Image src="/sadCloud.svg" alt="error" width={200} height={170} />
          <h3>Ocorreu um erro: {error}</h3>
        </div>
      </section>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto py-6">
      <section className="space-y-6 w-full flex flex-col items-center max-w-2xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <div className="flex items-center space-x-2">
                <Image
                  src={`${post.user.image}?random=${post.user.id}`}
                  alt="user image"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <h3 className="font-normal text-base">{post.user.username}</h3>
              </div>

              <div className="mt-3">
                <Image
                  src={`${post.image_url}?random=${post.id}`}
                  alt="post image"
                  width={500}
                  height={500}
                />
                <div className="space-x-4 mt-1">
                  <Button
                    variant="link"
                    className="hover:text-red-500 px-0 hover:no-underline"
                  >
                    <HeartIcon className="!w-5 !h-5" />
                  </Button>
                  <Button
                    variant="link"
                    className="hover:text-blue-500 px-0 hover:no-underline"
                  >
                    <MessageCircle className="!w-5 !h-5" />
                  </Button>
                  <Button
                    variant="link"
                    className="hover:text-green-500 px-0 hover:no-underline"
                  >
                    <Send className="!w-5 !h-5" />
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    {Array.isArray(post.likes) && post.likes.length > 0 ? (
                      <Button
                        variant="link"
                        className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-0 hover:no-underline"
                      >
                        <div>
                          {post.likes && post.likes.length > 0 ? (
                            <div className="flex -space-x-2">
                              {post.likes.slice(0, 3).map((like, index) => {
                                const user = users.find(
                                  (user) => user.id === like.user_id
                                );
                                return (
                                  <Image
                                    key={index}
                                    src={`${user?.image}?random=${like.user_id}`}
                                    alt="user image"
                                    width={20}
                                    height={20}
                                    className="rounded-full border-2 border-black"
                                    style={{ zIndex: 3 - index }}
                                  />
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                        <span>
                          {post.likes.length > 1
                            ? `${post.likes.length} curtidas`
                            : `${post.likes.length} curtida`}
                        </span>
                      </Button>
                    ) : null}
                  </DialogTrigger>
                  <DialogContent className="px-0 max-w-[300px] max-h-[400px]">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Curtidas
                      </DialogTitle>
                    </DialogHeader>
                    <div className=" border-t-[0.5px] border-gray-600 border-separate"></div>
                    <div className="flex flex-col space-y-3 h-full overflow-y-auto max-h-[300px] px-2">
                      {loading ? (
                        <div>Loading likes...</div>
                      ) : post.likes ? (
                        post.likes.map((like) => {
                          const user = users.find(
                            (user) => user.id === like.user_id
                          );
                          return (
                            <div
                              key={like.id}
                              className="flex items-center space-x-3 py-2 hover:bg-white/10 transition-all rounded-lg"
                            >
                              <Image
                                src={`${user?.image}?random=${like.user_id}`}
                                alt="user image"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                              <p className="font-semibold">{user?.username}</p>
                            </div>
                          );
                        })
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="mt-3">
                  <p className="text-base">
                    <span className="text-base font-semibold">
                      {post.user.name}
                    </span>{" "}
                    {post.content}
                  </p>
                  <span className="text-xs text-gray-500">
                    {dateConvert(post.created_at)}
                  </span>
                </div>
              </div>

              {/* Comments */}
              <div>
                {post && post.comments && post.comments.length > 0 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-0 hover:no-underline"
                      >
                        Ver todos os {post.comments.length} comentários
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="text-sm flex-grow">
                      <DialogHeader className="hidden">
                        <DialogTitle>Comentários</DialogTitle>
                        <DialogDescription>
                          Lista de comentários deste post
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <div className="flex items-center space-x-2">
                          {post.user && (
                            <Image
                              src={`${post.user.image}?random=${post.user.id}`}
                              alt="user image"
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                          )}
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

                      {post.comments.map((comment) => {
                        const userComment = users.find(
                          (user) => user.id === comment.author_id
                        );

                        return (
                          <div key={comment.id}>
                            <div className="mt-3 flex items-center space-x-2">
                              <Image
                                src={`${userComment?.image}?random=${comment.author_id}`}
                                alt="user image"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
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
                                    className="p-0 hover:no-underline"
                                  >
                                    Responder
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {comment.answers &&
                              comment.answers.map((answer) => {
                                const userAnswers = users.find(
                                  (user) => user.id === answer.author_id
                                );
                                return (
                                  <div
                                    key={answer.id}
                                    className="mt-3 flex items-center space-x-2"
                                  >
                                    <Image
                                      src={`${userAnswers?.image}?random=${answer.author_id}`}
                                      alt="user image"
                                      width={30}
                                      height={30}
                                      className="rounded-full"
                                    />
                                    <div className="flex flex-col">
                                      <p>
                                        <span className="font-semibold text-base">
                                          {userAnswers?.username}
                                        </span>{" "}
                                        {answer.content}
                                      </p>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">
                                          {dateConvert(answer.created_at)}
                                        </span>
                                        <Button
                                          variant={"link"}
                                          className="p-0 hover:no-underline"
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
                      {post.comments.length === 0 && (
                        <div className="w-full mt-2 text-center">
                          <h3 className="text-sm text-gray-400">
                            Ainda não há nenhum comentário
                          </h3>
                        </div>
                      )}

                      <form className="mt-3 flex gap-3 items-center">
                        <Input
                          type="text"
                          placeholder="Adicione um comentário..."
                          className=""
                        />
                        <Button className="text-sm px-2 font-semibold">
                          <SendIcon className="!w-5 !h-5" />
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : null}
                <div>
                  <div className="mt-3 flex gap-3 items-center">
                    <Input
                      type="text"
                      placeholder="Adicione um comentário..."
                      className=""
                    />
                    <Button className="text-sm px-2 font-semibold">
                      <SendIcon className="!w-5 !h-5" />
                    </Button>
                  </div>
                </div>
                <div className="border-b border-gray-600 py-2"></div>
              </div>
            </div>
          ))
        ) : (
          <h3>Nenhum post adicionado ainda</h3>
        )}
      </section>
    </div>
  );
};

export default PostsList;
