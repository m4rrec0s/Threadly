"use client";

import { ReactNode } from "react";
import Menu from "./components/Menu";
import { useAuth } from "./context/authContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="w-screen h-screen relative sm:grid sm:grid-cols-[18%_82%] items-stretch flex flex-col">
      <div className="hidden sm:block">
        <Menu user={user} />
      </div>
      <div className="row-span-1 sm:col-span-1">{children}</div>
      <div className="block sm:hidden w-full h-fit">
        <Menu user={user} horizontal />
      </div>
    </div>
  );
}
