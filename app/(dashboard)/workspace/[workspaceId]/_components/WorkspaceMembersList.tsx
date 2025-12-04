"use client";

import { User } from "@/app/schemas/realtime";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePresence } from "@/hooks/use-presence";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const WorkspaceMembersList = () => {
  const {
    data: { members },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());
  
  const params = useParams();
  const workspaceId = params.workspaceId;

  const { data: workspaceData } = useQuery(orpc.workspace.list.queryOptions());

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

  return (
    <>
      <div className="space-y-0.5">
        {members.map((member) => (
          <div
            key={member.id}
            className="px-3 py-2 cursor-pointer flex items-center space-x-3"
          >
            <div className="relative">
              <Avatar className="size-8 relative">
                <Image
                  src={getAvatar(member.picture ?? null, member.email!)}
                  alt="user"
                  className="object-cover"
                  fill
                  unoptimized
                />
                <AvatarFallback>
                  {member.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Online/Offline status indicator */}
              <div
                className={cn(
                  "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-violet-500",
                  member.id && onlineUserIds.has(member.id)
                    ? "bg-green-500"
                    : "bg-gray-500"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{member.full_name}</p>
              <p className="text-xs font-muted-foreground truncate">
                {member.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkspaceMembersList;
