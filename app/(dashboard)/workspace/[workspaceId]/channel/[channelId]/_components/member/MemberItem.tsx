import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { cn } from "@/lib/utils";
import { organization_user } from "@kinde/management-api-js";
import Image from "next/image";

interface MemberItemProps {
  member: organization_user;
  isOnline?: boolean;
}

const MemberItem = ({ member, isOnline }: MemberItemProps) => {
  const isAdmin = member.roles?.includes("admin");
  return (
    <>
      <div className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="size-8">
              <Image
                src={getAvatar(member.picture ?? null, member.email!)}
                alt="Member Avatar"
                fill
                unoptimized
              />
              <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white">
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online/Offline status indicator */}
            <div
              className={cn(
                "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-violet-500",
                isOnline ? "bg-green-500" : "bg-gray-500"
              )}
            />
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            {isAdmin ? (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">
                  {member.full_name}
                </p>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                  Admin
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">
                  {member.full_name}
                </p>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                  Member
                </span>
              </div>
            )}

            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberItem;
