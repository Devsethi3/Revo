"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = "sidebar-state";

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export const SidebarProvider = ({
  children,
  defaultOpen = true,
}: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultOpen;

    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored !== null ? stored === "true" : defaultOpen;
  });

  // Persist state to localStorage (this IS a valid effect)
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
