"use client";

import { useEffect, useState } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await checkSession();

        if (session) {
          const user = await getMe();
          if (user) {
            setUser(user);
          }
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error("Помилка перевірки сесії:", error);
        clearIsAuthenticated();
      } finally {
        setIsChecking(false);
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
