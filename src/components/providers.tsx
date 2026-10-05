"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AdminAuthor } from "@/lib/admin/types";
import { StoreProvider } from "@/context/store-context";

const AuthorsContext = createContext<AdminAuthor[]>([]);

export function useAuthors() {
  return useContext(AuthorsContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);

  useEffect(() => {
    fetch("/api/authors", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as { authors: AdminAuthor[] };
          setAuthors(data.authors);
        }
      })
      .catch(() => setAuthors([]));
  }, []);

  return (
    <AuthorsContext.Provider value={authors}>
      <StoreProvider>{children}</StoreProvider>
    </AuthorsContext.Provider>
  );
}
