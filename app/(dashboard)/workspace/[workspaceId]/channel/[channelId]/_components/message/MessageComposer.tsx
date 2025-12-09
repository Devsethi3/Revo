import RichTextEditor from "@/components/rich-text-editor/Editor";
import ImageUploadModal from "@/components/rich-text-editor/ImageUploadModal";
import { Button } from "@/components/ui/button";
import { useAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { ImageIcon, Loader2, Send } from "lucide-react";
import AttachmentChip from "./AttachmentChip";

interface MessageComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: useAttachmentUploadType;
}

const MessageComposer = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  upload,
}: MessageComposerProps) => {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button
            disabled={isSubmitting}
            type="button"
            size="sm"
            onClick={onSubmit}
            className="h-8 sm:h-9 px-2 sm:px-3"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                <span className="hidden sm:inline ml-1.5">Send</span>
              </>
            )}
          </Button>
        }
        footerLeft={
          upload.stagedUrl ? (
            <AttachmentChip url={upload.stagedUrl} onRemove={upload.clear} />
          ) : (
            <Button
              onClick={() => upload.setIsOpen(true)}
              type="button"
              size="sm"
              variant="outline"
              className="h-8 sm:h-9 px-2 sm:px-3"
            >
              <ImageIcon className="size-4" />
              <span className="hidden sm:inline ml-1.5">Attach</span>
            </Button>
          )
        }
      />

      <ImageUploadModal
        onUploaded={(url) => upload.onUploaded(url)}
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
      />
    </>
  );
};

export default MessageComposer;