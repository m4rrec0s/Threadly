import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { User } from "../../types/Users";

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
    <div className="flex gap-16 items-center w-full justify-center mb-6">
      {userF.image !== "" ? (
        <Avatar className="w-[150px] h-[150px]">
          <AvatarImage
            src={`http://localhost:8080/uploads/avatar/${userF.image}`}
            className="object-cover"
          />
          <AvatarFallback>
            <div className="flex-grow bg-slate-500 animate-pulse"></div>
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-[150px] h-[150px]">
          <AvatarImage
            src={"/usuario-sem-foto-de-perfil.jpg"}
            className="object-cover"
          />
          <AvatarFallback>
            <div className="flex-grow bg-slate-500 animate-pulse"></div>
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex space-x-6 items-center">
          <h2 className="text-2xl">{userF.username}</h2>
          <div className="flex items-center">
            {userF.username === user?.username ? (
              <>
                <Button
                  onClick={() => setEditProfile(true)}
                  className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                >
                  Editar perfil
                </Button>
                <Button className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                  Itens Arquivados
                </Button>
              </>
            ) : !isFollowing ? (
              <Button
                onClick={() => handleFollowUser()}
                className="ml-4 px-4 py-2 rounded-lg"
              >
                {isFollowed ? "Seguir de volta" : "Seguir"}
              </Button>
            ) : (
              <Button
                onClick={() => handleUnFollowUser()}
                className="ml-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Deixar de seguir
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-6 my-4">
          <h3 className="text-xl font-light">
            <strong className="font-bold">{userF.posts.length}</strong>{" "}
            {userF.posts.length === 1 ? "publicação" : "publicações"}
          </h3>
          <Button
            onClick={() => setIsModalFollowersOpen(true)}
            variant={"link"}
            className="p-0 m-0 justify-start items-start text-xl font-light hover:no-underline text-white"
          >
            <strong className="font-bold">
              {userF.followers?.length || 0}
            </strong>{" "}
            {userF.followers?.length === 1 ? "seguidor" : "seguidores"}
          </Button>
          <Button
            onClick={() => setIsModalFollowingOpen(true)}
            variant={"link"}
            className="p-0 m-0 justify-start items-start text-xl font-light hover:no-underline text-white"
          >
            <strong className="font-bold">
              {userF.following?.length || 0}
            </strong>{" "}
            seguindo
          </Button>
        </div>
        <h3 className="text-lg font-medium">{userF.name}</h3>
      </div>
    </div>
  );
}
