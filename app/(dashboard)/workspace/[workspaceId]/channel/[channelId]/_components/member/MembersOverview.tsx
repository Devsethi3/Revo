// MembersOverview.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MemberItem from "./MemberItem";
import { usePresence } from "@/hooks/use-presence";
import { useParams } from "next/navigation";
import { User } from "@/app/schemas/realtime";
import { cn } from "@/lib/utils";

const MembersOverview = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const params = useParams();
  const workspaceId = params.workspaceId;

  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions()
  );

  const { data: workspaceData } = useQuery(orpc.workspace.list.queryOptions());

  const members = data ?? [];
  const query = search.trim().toLowerCase();

  const filteredMembers = useMemo(() => {
    if (!query) return members;
    return members.filter((m) => {
      const name = m.full_name?.toLowerCase() ?? "";
      const email = m.email?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query);
    });
  }, [members, query]);

  const currentUser = useMemo(() => {
    if (!workspaceData?.user) return null;
    return {
      id: workspaceData.user.id,
      full_name: workspaceData.user.given_name,
      email: workspaceData.user.email,
      picture: workspaceData.user.picture,
    } satisfies User;
  }, [workspaceData?.user]);

  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  });

  const onlineUserIds = useMemo(
    () => new Set(onlineUsers.map((u) => u.id)),
    [onlineUsers]
  );

  const onlineCount = members.filter(
    (m) => m.id && onlineUserIds.has(m.id)
  ).length;

  if (error) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="size-4" />
          <span>Members</span>
          {onlineCount > 0 && (
            <span className="size-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
              {onlineCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0" sideOffset={8}>
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Members</h3>
            <span className="text-xs text-muted-foreground">
              {members.length} total
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "h-8 pl-8 text-sm",
                "bg-muted/50 border-transparent",
                "focus-visible:bg-background focus-visible:border-input"
              )}
              placeholder="Search..."
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Member List */}
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {query ? "No members found" : "No members yet"}
              </p>
            </div>
          ) : (
            <div className="p-1">
              {filteredMembers.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  isOnline={member.id ? onlineUserIds.has(member.id) : false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Online indicator */}
        {!isLoading && members.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>{onlineCount} online now</span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MembersOverview;
