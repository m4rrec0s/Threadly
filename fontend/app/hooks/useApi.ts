import { useState } from "react";
import axiosClient from "../services/axiosClient";
import { User } from "../types/Users";
import { Post } from "../types/Posts";
import { Follow } from "../types/Follows";

export const useApi = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const getPostByUser = async (userId: string) => {
    try {
      const response = await axiosClient.get(`/posts?user_id=${userId}`);
      const postsData = response.data;
      return postsData;
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

  const deleteComment = async (commentId: string) => {
    try {
      await axiosClient.delete(`/comments/${commentId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        }))
      );
    } catch (error: unknown) {
      setError("Error deleting comment - " + (error as Error).message);
    }
  };

  const createAnswer = async (
    commentId: string,
    authorId: string,
    content: string
  ) => {
    try {
      const response = await axiosClient.post("/answers", {
        comment_id: commentId,
        author_id: authorId,
        content: content,
      });
      const newAnswer = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, answers: [...comment.answers, newAnswer] }
              : comment
          ),
        }))
      );
    } catch (error: unknown) {
      setError("Error creating answer - " + (error as Error).message);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      await axiosClient.delete(`/answers/${answerId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) => ({
            ...comment,
            answers: comment.answers.filter((answer) => answer.id !== answerId),
          })),
        }))
      );
    } catch (error: unknown) {
      setError("Error deleting answer - " + (error as Error).message);
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

  const deletePost = async (postId: string) => {
    try {
      await axiosClient.delete(`/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      getPosts();
    } catch (error: unknown) {
      setError("Error deleting post - " + (error as Error).message);
    }
  };

  const createPost = async (formData: FormData) => {
    try {
      const response = await axiosClient.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      setError("Erro ao criar post - " + (error as Error).message);
      throw error;
    }
  };

  const getUserByUsername = async (username: string, addPosts?: boolean) => {
    try {
      const response = await axiosClient.get(`/users?username=${username}`);
      let userData: User = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (addPosts) {
        const postsResponse = await axiosClient.get(
          `/posts?user_id=${userData.id}`
        );
        userData = { ...userData, posts: postsResponse.data };
      }
      return userData;
    } catch (error: unknown) {
      setError("Error fetching user - " + (error as Error).message);
      throw error;
    }
  };

  const getFollowers = async (userId: string) => {
    try {
      const response = await axiosClient.get(`/followers/${userId}`);
      return response.data as Follow[];
    } catch (error: unknown) {
      setError("Error fetching followers - " + (error as Error).message);
      throw error;
    }
  };

  const getFollowing = async (userId: string) => {
    try {
      const response = await axiosClient.get(`/following/${userId}`);
      return response.data as Follow[];
    } catch (error: unknown) {
      setError("Error fetching following - " + (error as Error).message);
      throw error;
    }
  };

  const followUser = async (followerId: string, followingId: string) => {
    try {
      await axiosClient.post("/follow", {
        follower_id: followerId,
        following_id: followingId,
      });
    } catch (error: unknown) {
      setError("Error following user - " + (error as Error).message);
      throw error;
    }
  };

  const unFollowUser = async (followerId: string, followingId: string) => {
    try {
      await axiosClient.post("/unfollow", {
        follower_id: followerId,
        following_id: followingId,
      });
    } catch (error: unknown) {
      setError("Error unfollowing user - " + (error as Error).message);
      throw error;
    }
  };

  return {
    posts,
    users,
    error,
    loading,
    getPosts,
    getPostByUser,
    createComment,
    deleteComment,
    createAnswer,
    deleteAnswer,
    toggleLike,
    deletePost,
    createPost,
    getUserByUsername,
    getFollowers,
    getFollowing,
    followUser,
    unFollowUser,
  };
};
