// providers/SearchProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface SearchNavigationTarget {
  messageId: string;
  channelId: string;
  threadId?: string | null;
}

interface SearchContextType {
  isOpen: boolean;
  openSearch: (channelId?: string) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  currentChannelId: string | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  // New: Navigation target for highlighting
  navigationTarget: SearchNavigationTarget | null;
  setNavigationTarget: (target: SearchNavigationTarget | null) => void;
  clearNavigationTarget: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationTarget, setNavigationTarget] = useState<SearchNavigationTarget | null>(null);

  const openSearch = useCallback((channelId?: string) => {
    setCurrentChannelId(channelId);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearNavigationTarget = useCallback(() => {
    setNavigationTarget(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openSearch,
      closeSearch,
      toggleSearch,
      currentChannelId,
      searchQuery,
      setSearchQuery,
      clearSearch,
      navigationTarget,
      setNavigationTarget,
      clearNavigationTarget,
    }),
    [
      isOpen,
      openSearch,
      closeSearch,
      toggleSearch,
      currentChannelId,
      searchQuery,
      clearSearch,
      navigationTarget,
      clearNavigationTarget,
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}