"use client";

import React, { useEffect, useState } from "react";
import { Suggestion } from "../types/Feed";
import { useApi } from "../hooks/useApi";
import { User } from "../types/Users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAuth } from "../context/authContext";
import { Follow } from "../types/Follows";
import Link from "next/link";

interface SuggestionsProps {
  suggestions: Suggestion[];
}

interface SuggestionItemProps {
  user: Pick<User, "image" | "name" | "username" | "id">;
  authUser: User;
  isFollowing: boolean;
  isFollowed: boolean;
  handleFollowUser: () => void;
  handleUnFollowUser: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  user,
  authUser,
  handleFollowUser,
  handleUnFollowUser,
  isFollowed,
  isFollowing,
}) => {
  return (
    <div className="flex flex-col items-center w-[100px] space-y-3">
      <div className="flex flex-col items-center">
        <Avatar className="w-[80px] h-[80px] shadow-md">
          <AvatarImage
            src={
              user.image !== ""
                ? `http://localhost:8080/uploads/avatar/${user.image}`
                : "/usuario-sem-foto-de-perfil.jpg"
            }
            className="object-cover"
          />
          <AvatarFallback>
            <div className="flex-grow bg-slate-500 animate-pulse"></div>
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 w-[100px] text-center">
          <p className="text-sm font-semibold truncate">{user.username}</p>
          <p className="text-xs text-gray-500">{user.name}</p>
        </div>
      </div>
      {user.id === authUser?.id ? (
        <div className="flex gap-4 mt-4">
          <Link href="/account/edit">Editar perfil</Link>
        </div>
      ) : isFollowing ? (
        <Button
          onClick={() => handleUnFollowUser()}
          className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
        >
          Seguindo
        </Button>
      ) : (
        <Button
          onClick={() => handleFollowUser()}
          className="mt-4 px-4 py-2 rounded-lg w-fit"
        >
          {isFollowed ? "Seguir de volta" : "Seguir"}
        </Button>
      )}
    </div>
  );
};

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  const [suggestionUsers, setSuggestionsUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myFollowers, setMyFollowers] = useState<Follow[]>([]);
  const [myFollowing, setMyFollowing] = useState<Follow[]>([]);

  const {
    getUserById,
    getUserByUsername,
    getFollowers,
    getFollowing,
    followUser,
    unFollowUser,
  } = useApi();
  const { user } = useAuth();

  const getUsers = async () => {
    const suggestionUsers = await Promise.all(
      suggestions.map((suggestion) => getUserById(suggestion.following_id))
    );
    setSuggestionsUsers(
      suggestionUsers.filter((user): user is User => user !== null)
    );
  };

  const fetchFollows = async () => {
    setLoading(true);

    if (user) {
      try {
        const userData = await getUserByUsername(user.username);
        const followersData = await getFollowers(userData.id);
        const followingData = await getFollowing(userData.id);

        user.followers = followersData as unknown as Follow[];
        userData.following = followingData as unknown as Follow[];

        setMyFollowers(followersData);
        setMyFollowing(followingData);
      } catch (error) {
        setError("Erro ao buscar usuário - " + (error as Error).message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFollowUser = async (targetUserId: string) => {
    try {
      if (!suggestionUsers || !user?.id) {
        setError("Erro ao seguir usuário - IDs inválidos");
        return;
      }
      await followUser(user.id, targetUserId);

      // Buscar a lista atualizada de seguidos
      const updatedFollowing = await getFollowing(user.id);
      setMyFollowing(updatedFollowing);
    } catch (error) {
      setError("Erro ao seguir usuário - " + (error as Error).message);
    }
  };

  const handleUnFollowUser = async (targetUserId: string) => {
    try {
      if (!suggestionUsers || !user?.id) {
        setError("Erro ao deixar de seguir usuário - IDs inválidos");
        return;
      }
      await unFollowUser(user.id, targetUserId);

      // Buscar a lista atualizada de seguidos
      const updatedFollowing = await getFollowing(user.id);
      setMyFollowing(updatedFollowing);
    } catch (error) {
      setError(
        "Erro ao deixar de seguir usuário - " + (error as Error).message
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
      await fetchFollows(); // Isso garante que myFollowing e myFollowers sejam atualizados
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4 w-full sm:max-w-md max-sm:max-w-sm">
      <h3 className="text-base font-semibold mb-2">Sugestões</h3>
      <div className="p-2 w-full overflow-x-auto">
        <div className="flex items-center space-x-5">
          {suggestionUsers.map((u) => {
            const isFollowing = myFollowing.some(
              (f) => f.following_id === u.id
            );
            const isFollowed = myFollowers.some((f) => f.follower_id === u.id);
            return (
              user && (
                <SuggestionItem
                  key={u.id}
                  user={u}
                  authUser={user}
                  handleFollowUser={() => handleFollowUser(u.id)}
                  handleUnFollowUser={() => handleUnFollowUser(u.id)}
                  isFollowed={isFollowed}
                  isFollowing={isFollowing}
                />
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
