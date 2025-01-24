"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/app/services/axiosClient";
import { User } from "../types/Users";
import { useAuth } from "../context/authContext";
import { useToast } from "../hooks/use-toast";
import { useApi } from "../hooks/useApi";
import { Follow } from "../types/Follows";
import ProfileHeader from "./components/ProfileHeader";
import ProfileEditDialog from "./components/ProfileEditDialog";
import ProfilePosts from "./components/ProfilePosts";
import { Button } from "../components/ui/button";
import ModalFollowers from "./components/ModalFollowers";
import ModalFollowing from "./components/ModalFollowing";

export default function ClientPage({ username }: { username: string }) {
  const [userF, setUserF] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [isModalFollowersOpen, setIsModalFollowersOpen] = useState(false);
  const [isModalFollowingOpen, setIsModalFollowingOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | "">("");
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const {
    getUserByUsername,
    getFollowers,
    getFollowing,
    followUser,
    unFollowUser,
  } = useApi();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByUsername(username, true);
        const followersData = await getFollowers(userData.id);
        const followingData = await getFollowing(userData.id);

        userData.followers = followersData as unknown as Follow[];
        userData.following = followingData as unknown as Follow[];

        if (user) {
          const isFollowingUser = followersData.some(
            (follower) => follower.follower_id === user.id
          );
          setIsFollowing(isFollowingUser);

          const isFollowedByUser = followingData.some(
            (following) => following.following_id === user.id
          );
          setIsFollowed(isFollowedByUser);

          setUserF(userData);
          setLoading(false);
          setCurrentImage(userData.image);
        }
      } catch (error) {
        setError("Erro ao buscar usuário - " + (error as Error).message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, getUserByUsername, getFollowers, getFollowing, user]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", newUsername);
    if (profileImage !== "") {
      formData.append("image", profileImage);
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosClient.put(`/users/${userF?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = response.data;
      setEditProfile(false);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: updatedUser.name,
          username: updatedUser.username,
          image: updatedUser.image,
        };
      });
      setError("");
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
      window.dispatchEvent(
        new CustomEvent("profileUpdate", { detail: updatedUser })
      );
      updateUser(updatedUser);
    } catch (error: unknown) {
      setError("Erro ao editar perfil - " + (error as Error).message);
    }
  };

  const handleFollowUser = async () => {
    try {
      if (!userF?.id || !user?.id) {
        setError("Erro ao seguir usuário - IDs inválidos");
        return;
      }
      const response = await followUser(user.id, userF.id);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: response as unknown as Follow[],
        };
      });
      setIsFollowing(true);
    } catch (error) {
      setError("Erro ao seguir usuário - " + (error as Error).message);
    }
  };

  const handleUnFollowUser = async () => {
    try {
      if (!userF?.id || !user?.id) {
        setError("Erro ao deixar de seguir usuário - IDs inválidos");
        return;
      }
      await unFollowUser(user.id, userF.id);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: prev.followers.filter(
            (follower) => follower.follower_id !== user.id
          ),
        };
      });
      setIsFollowing(false);
    } catch (error) {
      setError(
        "Erro ao deixar de seguir usuário - " + (error as Error).message
      );
    }
  };

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-[2px] bg-blue-500 z-50 animate-pulse"></div>
    );

  if (!userF) return <p>Usuário não encontrado</p>;

  return (
    <section className="col-span-1 col-start-2 w-full flex justify-center gap-16 py-6 px-2">
      <div className="flex flex-col gap-4 w-full py-6 max-w-5xl">
        <ProfileHeader
          userF={userF}
          user={user}
          isFollowing={isFollowing}
          isFollowed={isFollowed}
          setIsModalFollowersOpen={setIsModalFollowersOpen}
          setIsModalFollowingOpen={setIsModalFollowingOpen}
          setEditProfile={setEditProfile}
          handleFollowUser={handleFollowUser}
          handleUnFollowUser={handleUnFollowUser}
        />
        {userF.id === user?.id && userF.image === "" && (
          <div className="w-full flex justify-center">
            <Button variant={"outline"} onClick={() => setEditProfile(true)}>
              Adicione uma foto de perfil
            </Button>
          </div>
        )}
        <div className="w-full border border-white/10"></div>
        <ProfilePosts posts={userF.posts} />
      </div>
      {editProfile && (
        <ProfileEditDialog
          name={name}
          setName={setName}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          handleEditProfile={handleEditProfile}
          error={error}
          setEditProfile={setEditProfile}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />
      )}

      {isModalFollowersOpen && (
        <ModalFollowers
          users={userF.followers.map((follower) => follower.follower)}
          setIsModalFollowersOpen={setIsModalFollowersOpen}
        />
      )}

      {isModalFollowingOpen && (
        <ModalFollowing
          users={userF.following.map((following) => following.following)}
          setIsModalFollowingOpen={setIsModalFollowingOpen}
        />
      )}
    </section>
  );
}
