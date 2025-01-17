"use client";

import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import Image from "next/image";
import { User } from "../types/Users";
import { Post } from "../types/Posts";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeleton";
import CreatePostForm from "./CreatePostForm";

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axiosClient.get("/posts");
      const userResponse = await axiosClient.get("/users");
      const usersData = userResponse.data;
      const postsData = response.data;

      setPosts(postsData);
      setUsers(usersData);
    } catch (error: unknown) {
      setError("Error fetching posts - " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (
    postId: string,
    authorId: string,
    content: string
  ) => {
    try {
      const response = await axiosClient.post("/comments", {
        post_id: postId,
        author_id: authorId,
        content: content,
      });
      const newComment = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (error: unknown) {
      setError("Error creating comment - " + (error as Error).message);
    }
  };

  const toggleLike = async (postId: string, userId: string) => {
    try {
      const post = posts.find((post) => post.id === postId);
      if (!post) return;

      const hasLiked = post.likes.some((like) => like.user_id === userId);

      if (hasLiked) {
        await axiosClient.delete("/likes", {
          data: {
            post_id: postId,
            user_id: userId,
          },
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like.user_id !== userId),
                }
              : post
          )
        );
      } else {
        const response = await axiosClient.post("/likes", {
          post_id: postId,
          user_id: userId,
        });
        const newLike = response.data;

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: [...post.likes, newLike] }
              : post
          )
        );
      }
    } catch (error: unknown) {
      setError("Error toggling like - " + (error as Error).message);
    }
  };

  const handlePostCreated = () => {
    getPosts();
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
      <CreatePostForm
        onPostCreated={handlePostCreated}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      <section className="space-y-6 w-full flex flex-col items-center max-w-3xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              users={users}
              createComment={createComment}
              toggleLike={toggleLike}
            />
          ))
        ) : (
          <h3>Nenhum post adicionado ainda</h3>
        )}
      </section>
    </div>
  );
};

export default PostsList;
