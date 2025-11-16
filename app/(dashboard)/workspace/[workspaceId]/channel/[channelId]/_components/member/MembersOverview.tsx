import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import MemberItem from "./MemberItem";

const MembersOverview = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions()
  );

  const members = data ?? [];
  const query = search.trim().toLowerCase();

  const filterMembers = query
    ? members.filter((m) => {
        const name = m.full_name?.toLowerCase();
        const email = m.email?.toLowerCase();

        return name?.includes(query) || email?.includes(query);
      })
    : members;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Users />
            <span>Members</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-[300px]">
          <div className="p-0">
            {/* Header */}
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">Workspace Members</h3>
              <p className="text-muted-foreground text-sm">Members</p>
            </div>

            {/* Search */}

            <div className="p-3 border-b">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8"
                  placeholder="Search Members..."
                />
              </div>
            </div>

            {/* Members */}

            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <p>Loading</p>
              ) : filterMembers.length === 0 ? (
                <p>No Members Found</p>
              ) : (
                filterMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MembersOverview;
