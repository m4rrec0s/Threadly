"use client";

import { useRouter } from "next/navigation";
import PostsList from "./components/PostsList";
import { useAuth } from "./context/authContext";
import { useEffect, useState } from "react";
import { useApi } from "./hooks/useApi";
import { User } from "./types/Users";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import Link from "next/link";
import { Button } from "./components/ui/button";
import PostPage from "./p/[post_id]/page";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userLogged, setUserLogged] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { getUserByUsername } = useApi();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    window.history.pushState(null, "", `/p/${postId}`);
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      const data = await getUserByUsername(user.username);
      setUserLogged(data);
      setLoading(false);
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    interface ProfileUpdateEvent extends Event {
      detail: User;
    }

    const handleProfileUpdate = (event: ProfileUpdateEvent) => {
      if (event.detail.username === user?.username) {
        setUserLogged(event.detail);
      }
    };

    window.addEventListener(
      "profileUpdate",
      handleProfileUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "profileUpdate",
        handleProfileUpdate as EventListener
      );
    };
  }, [user]);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedPostId(null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!user) {
    return null;
  }

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-full max-w-full bg-background overflow-hidden">
        <div className="flex items-center justify-center h-full w-full">
          <h1 className="font-extrabold text-4xl sm:text-6xl animate-pulse">
            Threadly
          </h1>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4">
        <section className="col-span-1 lg:col-span-2 w-full max-w-full">
          <PostsList onPostClick={handlePostClick} />
        </section>
        <section className="hidden lg:flex justify-between items-center h-fit w-full p-4 lg:p-6">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link href={`/${userLogged?.username}`} className="flex-shrink-0">
              {userLogged?.image !== "" ? (
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={`http://localhost:8080/uploads/avatar/${userLogged?.image}`}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <div className="flex-grow bg-slate-500 animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={"/usuario-sem-foto-de-perfil.jpg"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <div className="flex-grow bg-slate-500 animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              )}
            </Link>
            <div className="leading-5 min-w-0 flex-1">
              <Link href={`/${userLogged?.username}`}>
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {userLogged?.username}
                </h3>
              </Link>
              <h5 className="text-gray-400 text-xs sm:text-sm truncate">
                {userLogged?.name}
              </h5>
            </div>
          </div>
          <Button
            variant="link"
            className="text-blue-500 px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-shrink-0"
            onClick={logout}
          >
            Mudar
          </Button>
        </section>
      </div>
      {selectedPostId && (
        <PostPage
          postId={selectedPostId}
          onClose={() => {
            setSelectedPostId(null);
            window.history.pushState(null, "", "/");
          }}
        />
      )}
    </div>
  );
}
