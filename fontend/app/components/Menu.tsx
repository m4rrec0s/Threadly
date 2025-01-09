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
  SearchIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useAuth } from "../context/authContext";

interface MenuProps {
  user: Pick<User, "id" | "name" | "image" | "username"> | null;
}

const Menu = ({ user }: MenuProps) => {
  const pathename = usePathname();
  const { logout } = useAuth();

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
    <section className="h-screen fixed top-0 left-0 w-56 py-10 border-r border-white/30">
      <div className="flex flex-col justify-between h-full px-6">
        <div className="flex flex-col space-y-20">
          <Link href={"/"}>
            <h1 className="text-xl font-extrabold">Threadly</h1>
          </Link>
          <nav className="flex flex-col gap-8">
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
                  <span className="text-lg">{link.label}</span>
                </Link>
              );
            })}
            <Link
              href={`/${user.username}`}
              className="flex items-center gap-6 hover:text-white/45 transition-colors"
            >
              <Avatar className="h-8 w-7">
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-lg">Profile</span>
            </Link>
          </nav>
        </div>
        <div className="">
          <Button
            variant={"link"}
            className="hover:text-white/55 hover:no-underline text-white flex items-center gap-6"
            onClick={logout}
          >
            <LogOut className="h-6 w-6" />
            <span className="text-lg">Logout</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
