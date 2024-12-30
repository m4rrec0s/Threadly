"use client";

import { useRouter } from "next/navigation";
import PostsList from "./components/postsList";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col w-screen h-screen">
      <header className="p-5 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Threadly</h1>
        <nav className="flex items-center space-x-5">
          <Link
            className="text-gray-500 hover:text-white transition-colors"
            href={"#"}
          >
            Feed
          </Link>
          <Link
            className="text-gray-500 hover:text-white transition-colors"
            href={"#"}
          >
            Search
          </Link>
          <Link
            className="text-gray-500 hover:text-white transition-colors"
            href={"#"}
          >
            Profile
          </Link>
          <Link href={`/profile/14`}>
            <Image
              src="https://picsum.photos/200?random=18"
              width={40}
              height={40}
              alt={`${user.name} avatar`}
              className="rounded-full"
              title={user.name}
            />
          </Link>
        </nav>
      </header>
      <PostsList />
    </main>
  );
}
