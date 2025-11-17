import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";

const ThreadSidebar = () => {
  return (
    <>
      <div className="w-120 border-l flex flex-col h-full">
        {/* Header */}
        <div className="border-b h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <span>Thread</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size={"icon"}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
            
        </div>
      </div>
    </>
  );
};

export default ThreadSidebar;
