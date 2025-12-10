import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThread } from "@/providers/ThreadProvider";
import { MessageSquareText, MoreVertical, Pencil } from "lucide-react";

interface MessageHoverToolbarProps {
  messageId: string;
  canEdit: boolean;
  onEdit: () => void;
  showMobile?: boolean;
  onClose?: () => void;
}

export function MessageHoverToolbar({
  messageId,
  canEdit,
  onEdit,
  showMobile = false,
  onClose,
}: MessageHoverToolbarProps) {
  const { toggleThread } = useThread();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    onClose?.();
  };

  const handleThread = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleThread(messageId);
    onClose?.();
  };

  return (
    <>
      {/* Desktop: Hover Toolbar */}
      <div className="hidden md:flex absolute -right-2 -top-3 items-center gap-0.5 rounded-md border border-border bg-background/95 backdrop-blur-sm px-1 py-0.5 shadow-sm transition-opacity opacity-0 group-hover:opacity-100">
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit message</span>
          </Button>
        )}
        <Button
          onClick={handleThread}
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <MessageSquareText className="size-4" />
          <span className="sr-only">Reply in thread</span>
        </Button>
      </div>

      {/* Mobile: Popover Menu */}
      <div className="md:hidden absolute right-1 top-1">
        <Popover
          open={showMobile}
          onOpenChange={(open) => !open && onClose?.()}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="size-4" />
              <span className="sr-only">Message options</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-40 p-1"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col">
              <Button
                variant="ghost"
                className="justify-start h-9 px-2 w-full"
                onClick={handleThread}
              >
                <MessageSquareText className="size-4 mr-2" />
                <span className="text-sm">Reply thread</span>
              </Button>
              {canEdit && (
                <>
                  <div className="h-px bg-border my-1" />
                  <Button
                    variant="ghost"
                    className="justify-start h-9 px-2 w-full"
                    onClick={handleEdit}
                  >
                    <Pencil className="size-4 mr-2" />
                    <span className="text-sm">Edit message</span>
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
