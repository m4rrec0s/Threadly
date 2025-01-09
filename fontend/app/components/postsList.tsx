"use client";

import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import Image from "next/image";
import { User } from "../types/Users";
import { Post } from "../types/Posts";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeleton";

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
        <PostSkeleton />
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
    <div className="">
      <section className="space-y-6 w-full flex flex-col items-center max-w-3xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post.id} post={post} users={users} />
          ))
        ) : (
          <h3>Nenhum post adicionado ainda</h3>
        )}
      </section>
    </div>
  );
};

export default PostsList;
