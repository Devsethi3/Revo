import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon, Loader2 } from "lucide-react";

interface DeleteMessageProps {
  messageId: string;
  onDelete: (messageId: string) => Promise<void>;
  onClose?: () => void;
  variant?: "icon" | "full";
}

export function DeleteMessage({
  messageId,
  onDelete,
  onClose,
  variant = "icon",
}: DeleteMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    try {
      await onDelete(messageId);
      setIsOpen(false);
      onClose?.();
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      setIsOpen(open);
      if (!open) {
        onClose?.();
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 border-t text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2Icon className="size-4" />
            <span className="sr-only">Delete message</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="justify-start h-9 px-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2Icon className="size-4 mr-2" />
            <span className="text-sm">Delete message</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-[90vw] sm:max-w-[425px] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Delete message?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. This message will be permanently
            deleted from the conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            className="mt-0 w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
