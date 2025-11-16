import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Users } from "lucide-react";
import { useState } from "react";

const MembersOverview = () => {
  const [open, setOpen] = useState(false);
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
                <Input className="pl-9 h-8" placeholder="Search Members..." />
              </div>
            </div>

            {/* Members */}

            <div className="max-h-80 overflow-y-auto">

            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MembersOverview;
