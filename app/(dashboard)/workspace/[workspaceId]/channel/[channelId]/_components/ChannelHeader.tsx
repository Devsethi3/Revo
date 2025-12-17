// ChannelHeader.tsx
"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import InviteMember from "./member/InviteMember";
import MembersOverview from "./member/MembersOverview";
import {
  Hash,
  PanelLeftClose,
  PanelLeft,
  UserPlus,
  PanelRight,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/providers/SidebarProvider";
import { useSearch } from "@/providers/SearchProvider";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

interface ChannelHeaderProps {
  channelName: string | undefined;
}

const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  const { isOpen, toggle } = useSidebar();
  const { openSearch } = useSearch();
  const { channelId } = useParams<{ channelId: string }>();

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch(channelId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch, channelId]);

  return (
    <div className="flex items-center justify-between h-12 sm:h-14 px-2 sm:px-3 md:px-4 border-b shrink-0 bg-background">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Sidebar Toggle Button */}
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggle}
                className="size-9 shrink-0"
              >
                <PanelRight className="size-4 sm:size-5 md:hidden" />
                {isOpen ? (
                  <PanelLeftClose className="size-4 sm:size-5 hidden md:block" />
                ) : (
                  <PanelLeft className="size-4 sm:size-5 hidden md:block" />
                )}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isOpen ? "Close sidebar" : "Open sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Channel Name */}
        <div className="flex items-center gap-0.5 sm:gap-1 min-w-0 flex-1">
          <Hash className="size-4 sm:size-5 shrink-0" />
          <h1 className="text-base md:text-lg font-semibold truncate">
            {channelName}
          </h1>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Search Button */}
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openSearch(channelId)}
                className="size-9"
              >
                <SearchIcon className="size-4" />
                <span className="sr-only">Search messages</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="flex items-center gap-2">
                Search
                <kbd className="px-1.5 py-0.5 bg-accent text-primary rounded text-[10px] font-mono">
                  ⌘K
                </kbd>
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Desktop: Show buttons inline */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          <MembersOverview />
          <InviteMember />
        </div>

        <ThemeToggle />

        {/* Mobile: Popover menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden size-9">
              <UserPlus className="size-4" />
              <span className="sr-only">More options</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-2" sideOffset={8}>
            <div className="flex flex-col gap-2">
              <MembersOverview />
              <InviteMember />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ChannelHeader;