import { useState, useCallback } from "react";
import axiosClient from "../services/axiosClient";
import { User } from "../types/Users";
import { Post } from "../types/Posts";
import { Follow } from "../types/Follows";
import axios from "axios";
import { Like } from "../types/Likes";
import { Feed } from "../types/Feed";

export const useApi = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getPosts = useCallback(async (page = 1, perPage = 5) => {
    try {
      const response = await axiosClient.get(
        `/posts?_page=${page}&_per_page=${perPage}`
      );
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
  }, []);

  const getFeed = async (userId: string) => {
    try {
      const response = await axiosClient.get(`/feed?user_id=${userId}`);
      const userResponse = await axiosClient.get("/users");
      const usersData = userResponse.data;
      const feedData = response.data;

      setFeed(feedData);
      setUsers(usersData);
    } catch (error: unknown) {
      setError("Error fetching feed - " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (postId: string) => {
    try {
      const response = await axiosClient.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error: unknown) {
      setError("Erro ao buscar comentários - " + (error as Error).message);
      throw error;
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

  const getPostById = async (postId: string) => {
    try {
      const response = await axiosClient.get(`/posts/${postId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("Post não encontrado - " + (error as Error).message);
      } else {
        setError("Erro ao buscar post - " + (error as Error).message);
      }
      throw error;
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
        content,
      });
      return response.data;
    } catch (error: unknown) {
      setError("Error creating comment - " + (error as Error).message);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await axiosClient.delete(`/comments/${commentId}`);
    } catch (error: unknown) {
      setError("Error deleting comment - " + (error as Error).message);
    }
  };

  const getAnswers = async (commentId: string) => {
    try {
      const response = await axiosClient.get(
        `/answers?comment_id=${commentId}`
      );
      return response.data;
    } catch (error: unknown) {
      setError("Erro ao buscar respostas - " + (error as Error).message);
      throw error;
    }
  };

  const createAnswer = async (
    content: string,
    authorId: string,
    commentId: string
  ) => {
    try {
      const response = await axiosClient.post("/answers", {
        content: content,
        author_id: authorId,
        comment_id: commentId,
      });
      return response.data;
    } catch (error: unknown) {
      setError("Error creating answer - " + (error as Error).message);
      console.log(error);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      await axiosClient.delete(`/answers/${answerId}`);
    } catch (error: unknown) {
      setError("Error deleting answer - " + (error as Error).message);
    }
  };

  const toggleLike = async (postId: string, userId: string) => {
    try {
      // Buscar post do servidor para verificar se já foi curtido
      const postFromServer = await getPostById(postId);
      const hasLiked = postFromServer.likes.some(
        (like: Like) => like.user_id === userId
      );

      if (hasLiked) {
        await axiosClient.delete("/likes", {
          data: {
            post_id: postId,
            user_id: userId,
          },
        });
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: p.likes.filter((like) => like.user_id !== userId),
                }
              : p
          )
        );
      } else {
        const response = await axiosClient.post("/likes", {
          post_id: postId,
          user_id: userId,
        });
        const newLike = response.data;
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId ? { ...p, likes: [...p.likes, newLike] } : p
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

  const getUserByUsername = useCallback(
    async (username: string, addPosts?: boolean) => {
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
    },
    []
  );

  const getUserById = async (userId: string) => {
    try {
      const response = await axiosClient.get(`/users/id/${userId}`);
      return response.data as User;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("Usuário não encontrado - " + (error as Error).message);
        return null;
      } else {
        setError("Erro ao buscar usuário - " + (error as Error).message);
        throw error;
      }
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

  const getLikesByPost = async (postId: string) => {
    try {
      const response = await axiosClient.get(`/posts/${postId}/likes`);
      return response.data;
    } catch (error: unknown) {
      setError("Erro ao buscar likes - " + (error as Error).message);
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
    feed,
    setPosts,
    setFeed,
    users,
    error,
    loading,
    getPosts,
    getFeed,
    getPostByUser,
    createComment,
    deleteComment,
    createAnswer,
    deleteAnswer,
    toggleLike,
    deletePost,
    createPost,
    getUserByUsername,
    getUserById,
    getFollowers,
    getFollowing,
    followUser,
    unFollowUser,
    getComments,
    getAnswers,
    getPostById,
    getLikesByPost,
  };
};
