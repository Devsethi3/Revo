import { ThemeToggle } from "@/components/ui/theme-toggle";
import InviteMember from "./member/InviteMember";
import MembersOverview from "./member/MembersOverview";

interface ChannelHeaderProps {
  channelName: string | undefined;
}

const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between h-14 px-4 border-b">
        <h1 className="text-lg font-semibold"># {channelName}</h1>

        <div className="flex items-center space-x-3">
          <MembersOverview />
          <InviteMember />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default ChannelHeader;
