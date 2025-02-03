import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { User } from "../../types/Users";
import Link from "next/link";

interface ProfileHeaderProps {
  userF: User;
  user: {
    username: string;
  } | null;
  isFollowing: boolean;
  isFollowed: boolean;
  setIsModalFollowersOpen: (value: boolean) => void;
  setIsModalFollowingOpen: (value: boolean) => void;
  setEditProfile: (value: boolean) => void;
  handleFollowUser: () => void;
  handleUnFollowUser: () => void;
}

export default function ProfileHeader({
  userF,
  user,
  isFollowing,
  isFollowed,
  setIsModalFollowersOpen,
  setIsModalFollowingOpen,
  setEditProfile,
  handleFollowUser,
  handleUnFollowUser,
}: ProfileHeaderProps) {
  return (
    <div className="flex gap-6 max-sm:flex-col items-center w-full justify-start mb-6">
      <Avatar className="w-[150px] h-[150px] max-sm:w-[100px] max-sm:h-[100px]">
        <AvatarImage
          src={
            userF.image
              ? `http://localhost:8080/uploads/avatar/${userF.image}`
              : "/usuario-sem-foto-de-perfil.jpg"
          }
          className="object-cover"
        />
        <AvatarFallback>
          <div className="flex-grow bg-slate-500 animate-pulse"></div>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-2xl max-sm:text-xl">{userF.username}</h2>
        <div className="flex items-center gap-6 text-xl max-sm:text-sm font-light">
          <h3>
            <strong className="font-bold">{userF.posts.length}</strong>{" "}
            {userF.posts.length === 1 ? "publicação" : "publicações"}
          </h3>
          <Button
            onClick={() => setIsModalFollowersOpen(true)}
            variant={"link"}
            className="p-0 m-0 text-xl max-sm:text-sm font-light hover:no-underline text-white"
          >
            <strong className="font-bold">
              {userF.followers?.length || 0}
            </strong>{" "}
            {userF.followers?.length === 1 ? "seguidor" : "seguidores"}
          </Button>
          <Button
            onClick={() => setIsModalFollowingOpen(true)}
            variant={"link"}
            className="p-0 m-0 text-xl max-sm:text-sm font-light hover:no-underline text-white"
          >
            <strong className="font-bold">
              {userF.following?.length || 0}
            </strong>{" "}
            seguindo
          </Button>
        </div>
        <h3 className="text-lg font-medium mt-2">{userF.name}</h3>
        <Link href="#" className="text-blue-500 mt-2 text-sm">
          @{userF.username}
        </Link>
        {userF.username === user?.username ? (
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => setEditProfile(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              Editar perfil
            </Button>
            <Button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
              Itens Arquivados
            </Button>
          </div>
        ) : !isFollowing ? (
          <Button
            onClick={() => handleFollowUser()}
            className="mt-4 px-4 py-2 rounded-lg"
          >
            {isFollowed ? "Seguir de volta" : "Seguir"}
          </Button>
        ) : (
          <Button
            onClick={() => handleUnFollowUser()}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Deixar de seguir
          </Button>
        )}
      </div>
    </div>
  );
}
