"use client";

import { ReactNode } from "react";
import Menu from "./components/Menu";
import { useAuth } from "./context/authContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-[18%_80%] w-screen h-screen relative items-stretch">
      <div className="col-span-1 fixed top-0 left-0 h-full">
        <Menu user={user} />
      </div>
      <div className="col-span-1 col-start-2 w-full">{children}</div>
    </div>
  );
}
