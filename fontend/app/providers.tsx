"use client";

import { AuthProvider } from "./context/authContext";
import { useEffect, useState } from "react";
import Router from "next/router";

function Providers(props: React.PropsWithChildren) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);
    Router.events.on("routeChangeError", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
      Router.events.off("routeChangeError", stopLoading);
    };
  }, []);

  return (
    <AuthProvider>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-6 bg-blue-500 z-50 animate-pulse"></div>
      )}
      {props.children}
    </AuthProvider>
  );
}

export default Providers;
