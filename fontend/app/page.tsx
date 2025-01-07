"use client";

import { useRouter } from "next/navigation";
import PostsList from "./components/postsList";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import Header from "./components/header";

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

  user.image = `https://avatars.githubusercontent.com/u/147518177?v=4`;
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header user={user} />
      <PostsList />
    </div>
  );
}
