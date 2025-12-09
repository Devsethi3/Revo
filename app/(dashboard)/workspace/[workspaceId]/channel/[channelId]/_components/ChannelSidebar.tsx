"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSidebar } from "@/providers/SidebarProvider";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkspaceHeader from "../../../_components/WorkspaceHeader";
import CreateNewChannel from "../../../_components/CreateNewChannel";
import ChannelList from "../../../_components/ChannelList";
import WorkspaceMembersList from "../../../_components/WorkspaceMembersList";
import WorkspaceList from "@/app/(dashboard)/workspace/_components/WorkspaceList";
import CreateWorkspace from "@/app/(dashboard)/workspace/_components/CreateWorkspace";
import UserNav from "@/app/(dashboard)/workspace/_components/UserNav";

const ChannelSidebar = () => {
  const { isOpen } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-full flex-col bg-sidebar border-r border-border shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-60 lg:w-72 xl:w-80" : "w-0"
        )}
      >
        <div
          className={cn(
            "flex flex-col h-full min-w-60 lg:min-w-[288px] xl:min-w-[320px]",
            !isOpen && "invisible"
          )}
        >
          {/* Header */}
          <div className="flex items-center px-3 lg:px-4 h-12 lg:h-14 border-b border-border shrink-0">
            <WorkspaceHeader />
          </div>

          {/* Create Channel Button */}
          <div className="px-3 lg:px-4 py-2 shrink-0">
            <CreateNewChannel />
          </div>

          {/* Channel List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-2 lg:px-4 min-h-0">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs lg:text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
                Channels
                <ChevronDown className="size-3.5 lg:size-4 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ChannelList />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Members List */}
          <div className="px-2 lg:px-4 py-2 border-t border-border shrink-0 max-h-48 lg:max-h-64 overflow-y-auto">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs lg:text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
                Members
                <ChevronUp className="size-3.5 lg:size-4 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <WorkspaceMembersList />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Mobile Overlay Sidebar */}
      {isOpen && <MobileSidebarOverlay />}
    </>
  );
};

// Mobile sidebar with workspace navigation included
const MobileSidebarOverlay = () => {
  const { close } = useSidebar();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={close}
      />

      {/* Sidebar Container */}
      <div className="fixed inset-y-0 left-0 z-50 flex md:hidden animate-in slide-in-from-left duration-300">
        {/* Workspace Sidebar (Left Strip) */}
        <div className="w-14 h-full flex flex-col items-center bg-sidebar py-2 px-1.5 border-r border-border shrink-0">
          <ScrollArea className="flex-1 w-full">
            <div className="flex flex-col items-center gap-2">
              <WorkspaceList />
            </div>
          </ScrollArea>

          <div className="mt-3 shrink-0">
            <CreateWorkspace />
          </div>

          <div className="mt-auto pt-3 shrink-0">
            <UserNav />
          </div>
        </div>

        {/* Channel Sidebar (Right Panel) */}
        <div className="w-64 sm:w-72 h-full flex flex-col bg-sidebar border-r border-border">
          {/* Header */}
          <div className="flex items-center px-3 h-12 border-b border-border shrink-0">
            <WorkspaceHeader />
          </div>

          {/* Create Channel Button */}
          <div className="px-3 py-2 shrink-0">
            <CreateNewChannel />
          </div>

          {/* Channel List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-2 min-h-0">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
                Channels
                <ChevronDown className="size-3.5 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ChannelList />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Members List */}
          <div className="px-2 py-2 border-t border-border shrink-0 max-h-40 overflow-y-auto">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
                Members
                <ChevronUp className="size-3.5 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <WorkspaceMembersList />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelSidebar;
