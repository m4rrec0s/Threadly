"use client";

import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Image from "next/image";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeleton";
import CreatePostForm from "./CreatePostForm";
import { Button } from "./ui/button";
import { Post } from "../types/Posts";
import { useAuth } from "../context/authContext";
import Suggestions from "./Suggestions";
import { Suggestion } from "../types/Feed";
// import { useRouter } from "next/navigation";

interface PostsListProps {
  onPostClick: (postId: string) => void;
}

const PostsList: React.FC<PostsListProps> = ({ onPostClick }) => {
  const {
    feed,
    users,
    error,
    loading,
    getFeed,
    getPostById,
    createComment,
    deleteComment,
    createAnswer,
    toggleLike,
    deletePost,
    setPosts,
  } = useApi();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostCreated, setNewPostCreated] = useState(false);
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  // const router = useRouter();

  useEffect(() => {
    if (user) {
      getFeed(user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return null;
  }

  const handlePostCreated = (newPost: Post) => {
    setNewPosts((prevPosts) => [newPost, ...prevPosts]);
    setNewPostCreated(true);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setNewPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleToggleLike = async (postId: string) => {
    if (!user) return;

    try {
      toggleLike(postId, user.id);
      const updatedPost = await getPostById(postId);
      handlePostUpdated(updatedPost);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handlePostClick = (postId: string) => {
    onPostClick(postId);
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
    <div className="px-3">
      <CreatePostForm
        onPostCreated={handlePostCreated}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      {newPostCreated && (
        <Button
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={() => {
            getFeed(user?.id);
            setNewPosts([]);
            setNewPostCreated(false);
          }}
        >
          Novas publicações
        </Button>
      )}
      <section className="space-y-6 w-full flex flex-col overflow-x-hidden">
        {newPosts.map((post) => (
          <PostSkeleton key={post.id} />
        ))}
        {feed.length > 0 ? (
          feed.map((item, index) =>
            "suggestions" in item ? (
              <Suggestions
                key={index}
                suggestions={item.suggestions as Suggestion[]}
              />
            ) : (
              <div key={(item as unknown as Post).id} className="w-full mb-6">
                <PostItem
                  post={item as unknown as Post}
                  users={users}
                  createComment={createComment}
                  deleteComment={deleteComment}
                  toggleLike={handleToggleLike}
                  deletePost={deletePost}
                  createAnswer={createAnswer}
                  onPostUpdated={handlePostUpdated}
                  getPostById={getPostById}
                  openPostModal={handlePostClick}
                />
              </div>
            )
          )
        ) : (
          <h3>Nenhum post adicionado ainda</h3>
        )}
      </section>
    </div>
  );
};

export default PostsList;
