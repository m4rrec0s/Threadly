"use client";

import { AuthProvider } from "./context/authContext";

function Providers(props: React.PropsWithChildren) {
  return <AuthProvider>{props.children}</AuthProvider>;
}

export default Providers;
