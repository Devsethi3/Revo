// hooks/use-search-shortcut.ts
"use client";

import { useEffect } from "react";
import { useSearch } from "@/providers/SearchProvider";

export function useSearchShortcut(channelId?: string) {
  const { openSearch, isOpen, closeSearch } = useSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch(channelId);
        }
      }

      // Cmd/Ctrl + F for search in current channel
      if ((e.metaKey || e.ctrlKey) && e.key === "f" && channelId) {
        e.preventDefault();
        openSearch(channelId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch, closeSearch, isOpen, channelId]);
}
