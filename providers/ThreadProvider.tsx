"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ThreadContextType {
  selectedThreadId: string | null;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  toggleThread: (messageId: string) => void;
  isThreadOpen: boolean;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  const openThread = (messageId: string) => {
    setSelectedThreadId(messageId);
    setIsThreadOpen(true);
  };

  const closeThread = () => {
    setSelectedThreadId(null);
    setIsThreadOpen(false);
  };

  const toggleThread = (messageId: string) => {
    if (selectedThreadId === messageId && isThreadOpen) {
      closeThread();
    } else {
      openThread(messageId);
    }
  };

  const value: ThreadContextType = {
    selectedThreadId,
    openThread,
    closeThread,
    toggleThread,
    isThreadOpen,
  };

  return (
    <>
      <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
    </>
  );
}

export function useThread() {
  const context = useContext(ThreadContext);

  if (context === undefined) {
    throw new Error("useThread must be used withing a ThreadProvider");
  }

  return context;
}
