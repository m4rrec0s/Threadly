"use client";

import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Image from "next/image";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeleton";
import CreatePostForm from "./CreatePostForm";
import { Button } from "./ui/button";
import { Post } from "../types/Posts";

const PostsList = () => {
  const {
    posts,
    users,
    error,
    loading,
    getPosts,
    createComment,
    deleteComment,
    createAnswer,
    toggleLike,
    deletePost,
  } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostCreated, setNewPostCreated] = useState(false);
  const [newPosts, setNewPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handlePostCreated = (newPost: Post) => {
    setNewPosts((prevPosts) => [newPost, ...prevPosts]);
    setNewPostCreated(true);
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
      {newPostCreated && (
        <Button
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={() => {
            getPosts();
            setNewPosts([]);
            setNewPostCreated(false);
          }}
        >
          Novas publicações
        </Button>
      )}
      <section className="space-y-6 w-full flex flex-col items-center max-w-3xl mx-auto">
        {newPosts.map((post) => (
          <PostSkeleton key={post.id} />
        ))}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              users={users}
              createComment={createComment}
              deleteComment={deleteComment}
              toggleLike={toggleLike}
              deletePost={deletePost}
              createAnswer={createAnswer}
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
