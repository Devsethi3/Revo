import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { organization_user } from "@kinde/management-api-js";
import Image from "next/image";

interface MemberItemProps {
  member: organization_user;
}

const MemberItem = ({ member }: MemberItemProps) => {
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
              />
              <AvatarFallback>
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div>
              <p className="text-sm font-medium truncate">{member.full_name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberItem;
