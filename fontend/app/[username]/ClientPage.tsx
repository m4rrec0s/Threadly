"use client";

import { useEffect, useState } from "react";
import { User } from "../types/Users";
import { useAuth } from "../context/authContext";
import { useApi } from "../hooks/useApi";
import { Follow } from "../types/Follows";
import ProfileHeader from "./components/ProfileHeader";
import ProfilePosts from "./components/ProfilePosts";
import { Button } from "../components/ui/button";
import ModalFollowers from "./components/ModalFollowers";
import ModalFollowing from "./components/ModalFollowing";
import PostPage from "@/app/p/[post_id]/page";
import { useRouter } from "next/navigation";

export default function ClientPage({ username }: { username: string }) {
  const [userF, setUserF] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isModalFollowersOpen, setIsModalFollowersOpen] = useState(false);
  const [isModalFollowingOpen, setIsModalFollowingOpen] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const {
    getUserByUsername,
    getFollowers,
    getFollowing,
    followUser,
    unFollowUser,
  } = useApi();
  const router = useRouter();

  const handleEditProfileClick = () => {
    router.push("/account/edit");
  };

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
        }
      } catch (error) {
        setError("Erro ao buscar usuário - " + (error as Error).message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    window.history.pushState(null, "", `/p/${postId}`);
  };

  // const handleEditProfile = async (e: React.FormEvent) => {
  //   // Remover lógica de edição de perfil
  // };

  const handleFollowUser = async () => {
    try {
      if (!userF?.id || !user?.id) {
        setError("Erro ao seguir usuário - IDs inválidos");
        return;
      }
      await followUser(user.id, userF.id);
      const updatedFollowers = await getFollowers(userF.id);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: updatedFollowers as unknown as Follow[],
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
      const updatedFollowers = await getFollowers(userF.id);
      setUserF((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: updatedFollowers as unknown as Follow[],
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

  if (error) return <p>{error}</p>;

  return (
    <section className="col-span-1 col-start-2 w-full flex justify-center gap-16 py-6 px-2 max-sm:flex-col max-sm:gap-2">
      <div className="flex flex-col gap-4 w-full py-6 max-w-5xl max-sm:py-3">
        <ProfileHeader
          userF={userF}
          user={user}
          isFollowing={isFollowing}
          isFollowed={isFollowed}
          setIsModalFollowersOpen={setIsModalFollowersOpen}
          setIsModalFollowingOpen={setIsModalFollowingOpen}
          handleFollowUser={handleFollowUser}
          handleUnFollowUser={handleUnFollowUser}
        />
        {userF.id === user?.id && userF.image === "" && (
          <div className="w-full flex justify-center">
            <Button variant={"outline"} onClick={handleEditProfileClick}>
              Adicione uma foto de perfil
            </Button>
          </div>
        )}
        <div className="w-full border border-white/10"></div>
        <ProfilePosts posts={userF.posts} onPostClick={handlePostClick} />
      </div>
      {/* {editProfile && (
        <ProfileEditDialog
          // Remover lógica de edição de perfil
        />
      )} */}

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
      {selectedPostId && (
        <PostPage
          postId={selectedPostId}
          onClose={() => {
            setSelectedPostId(null);
            window.history.pushState(null, "", "/");
          }}
        />
      )}
    </section>
  );
}
