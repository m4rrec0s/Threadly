"use client";

import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import Image from "next/image";
import { dateConvert } from "../helpers/dateConvert";
import { Button } from "./ui/button";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { Comment } from "../types/Comments";
import { Likes } from "../types/Likes";

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [users, setUsers] = useState<User[]>();
  const [comments, setComments] = useState<Comment[]>();
  const [likes, setLikes] = useState<Likes[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const responsePosts = await axiosClient.get("/posts");
      const responseUsers = await axiosClient.get("/users");
      const responseComments = await axiosClient.get("/comments");
      const responseLikes = await axiosClient.get("/likes");
      setPosts(responsePosts.data);
      setUsers(responseUsers.data);
      setComments(responseComments.data);
      setLikes(responseLikes.data);
    } catch (error: unknown) {
      setError("Error fetching posts - " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const findUserById = (userId: string | number): User | undefined => {
    if (!users || users.length === 0) {
      console.error("Users data not loaded or empty");
    }
    return users?.find((user) => String(user.id) === String(userId));
  };

  const findCommentsByPostId = (postId: string): Comment[] | undefined => {
    return comments?.filter((comment) => comment.post_id === postId);
  };

  const findLikesByPostId = (postId: string): Likes[] | undefined => {
    return likes?.filter((like) => like.post_id === postId);
  };

  if (loading) {
    return (
      <section>
        <div>
          <h3>Loading...</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div>
          <h3>{error}</h3>
        </div>
      </section>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto py-6">
      <section className="space-y-6 w-full flex flex-col items-center max-w-2xl mx-auto">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const user = findUserById(post.author_id);
            return (
              <div key={post.id}>
                {user && (
                  <div className="flex items-center space-x-2">
                    <Image
                      src={`${user.image}?random=${user.id}`}
                      alt="user image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <h3 className="font-normal text-base">{user.username}</h3>
                  </div>
                )}
                <div className="mt-3">
                  <Image
                    src={`${post.image_url}?random=${post.id}0`}
                    alt="post image"
                    width={500}
                    height={500}
                  />
                  <div className="space-x-4">
                    <Button
                      variant={"link"}
                      className="p-0 hover:text-red-500 hover:no-underline"
                    >
                      <HeartIcon className="!w-5 !h-5" />
                      <span>{findLikesByPostId(post.id)?.length}</span>
                    </Button>
                    <Button
                      variant={"link"}
                      className="p-0 hover:text-blue-500 hover:no-underline"
                    >
                      <MessageCircle className="!w-5 !h-5" />
                    </Button>
                    <Button
                      variant={"link"}
                      className="p-0 hover:text-green-500 hover:no-underline"
                    >
                      <Send className="!w-5 !h-5" />
                    </Button>
                  </div>
                  <div className="mt-3">
                    <p className="text-base">
                      <span className="text-base font-semibold">
                        {user?.name}
                      </span>{" "}
                      {post.content}
                    </p>
                    <span className="text-xs text-gray-500">
                      {dateConvert(post.created_at).charAt(0).toUpperCase() +
                        dateConvert(post.created_at).slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  {findCommentsByPostId(post.id)?.map((comment) => {
                    const user = findUserById(comment.author_id);
                    return (
                      <div
                        key={comment.id}
                        className="mt-3 flex items-center space-x-2"
                      >
                        <Image
                          src={`${user?.image}?random=${user?.id}`}
                          alt="user image"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <p>
                            <span className="font-semibold text-base">
                              {user?.username}
                            </span>{" "}
                            <span className="text-sm">{comment.content}</span>
                          </p>
                          <div>
                            <span className="text-xs text-gray-500">
                              {dateConvert(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-b border-gray-600 py-2"></div>
              </div>
            );
          })
        ) : (
          <div>
            <h3>Nenhum post adicionado ainda</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostsList;
