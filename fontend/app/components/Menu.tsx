"use client";

import Link from "next/link";
import { User } from "../types/Users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Compass,
  HeartIcon,
  Home,
  LogOut,
  MessageCircleMore,
  PlusSquare,
  SearchIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import CreatePostForm from "./CreatePostForm";

interface MenuProps {
  user: Pick<User, "id" | "name" | "image" | "username"> | null;
  horizontal?: boolean;
}

const Menu = ({ user, horizontal }: MenuProps) => {
  const pathename = usePathname();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent<{ username: string }>) => {
      if (event.detail.username === user?.username) {
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

  const links = [
    { href: "/", icon: Home, label: "Feed" },
    { href: "/search", icon: SearchIcon, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/messages", icon: MessageCircleMore, label: "Messages" },
    { href: "/notifications", icon: HeartIcon, label: "Notifications" },
  ];

  if (!user) {
    return null;
  }
  return (
    <section
      className={cn("fixed", {
        "h-screen top-0 left-0 px-3 py-10 border-r border-white/20":
          !horizontal,
        "w-full bottom-0 left-0 h-[8%] border-t border-white/20 flex items-center bg-background z-50":
          horizontal,
      })}
    >
      <div
        className={cn("flex", {
          "flex-col justify-between h-full px-6": !horizontal,
          "w-full": horizontal,
        })}
      >
        <div
          className={cn("flex", {
            "flex-col space-y-14": !horizontal,
            "w-full": horizontal,
          })}
        >
          <Link href={"/"}>
            <h1 className="text-xl font-extrabold max-sm:hidden">Threadly</h1>
          </Link>
          <nav
            className={cn("flex", {
              "flex-col gap-8": !horizontal,
              "justify-between w-full px-6": horizontal,
            })}
          >
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathename === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn("flex items-center gap-6", {
                    "font-extrabold opacity-100": isActive,
                    "font-light opacity-90": !isActive,
                  })}
                >
                  <Icon className="h-8 w-8" />
                  {!horizontal && <span className="text-lg">{link.label}</span>}
                </Link>
              );
            })}
            <Button
              variant={"link"}
              className="hover:no-underline text-white font-light opacity-90 flex justify-start items-center px-0 gap-6"
              id="create-post"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusSquare className="!h-8 !w-8" />
              {!horizontal && <span className="!text-lg">Create</span>}
            </Button>
            <CreatePostForm
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              onPostCreated={() => setIsModalOpen(false)}
            />
            <Link
              href={`/${user.username}`}
              className={cn("flex items-center gap-6 transition-colors", {
                "font-extrabold opacity-100": pathename === `/${user.username}`,
                "font-light opacity-90": pathename !== `/${user.username}`,
              })}
            >
              {user.image !== "" ? (
                <Avatar
                  className={cn("h-8 w-8", {
                    "border-2 border-white": pathename === `/${user.username}`,
                  })}
                >
                  <AvatarImage
                    src={`http://localhost:8080/uploads/avatar/${user.image}`}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <div className="flex-grow bg-slate-500 animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar
                  className={cn("h-8 w-8", {
                    "border-2 border-white": pathename === `/${user.username}`,
                  })}
                >
                  <AvatarImage
                    src={"/usuario-sem-foto-de-perfil.jpg"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <div className="flex-grow bg-slate-500 animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              )}
              {!horizontal && <span className="text-lg">Profile</span>}
            </Link>
          </nav>
        </div>
        <div className="">
          <Button
            variant={"link"}
            className="hover:no-underline text-white font-light opacity-90 flex justify-start items-center px-0 gap-6 max-sm:hidden"
            onClick={logout}
            title="Logout"
          >
            {" "}
            <LogOut className="!h-6 !w-6" />
            {!horizontal && <span className="!text-lg">Logout</span>}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
