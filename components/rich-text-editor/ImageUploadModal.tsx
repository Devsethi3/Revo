import { UploadDropzone } from "@/lib/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (url: string) => void;
}

const ImageUploadModal = ({
  onOpenChange,
  open,
  onUploaded,
}: ImageUploadModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload your image and choose it for your workspace channel
          </DialogDescription>
        </DialogHeader>
        <UploadDropzone
          className="ut-ready:bg-background ut-ready:border-2 ut-ready:border-dashed ut-ready:border-muted-foreground/25 ut-ready:hover:border-primary/50 ut-ready:transition-colors ut-uploading:bg-muted/50 ut-uploading:border-2 ut-uploading:border-primary ut-uploading:animate-pulse ut-label:text-foreground ut-label:font-medium ut-allowed-content:text-muted-foreground ut-allowed-content:text-xs ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:transition-colors ut-button:font-medium rounded-xl p-8"
          appearance={{
            container: "bg-background",
            label: "text-foreground font-medium text-base",
            allowedContent: "text-xs text-muted-foreground mt-2",
            button:
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium px-4 py-2 rounded-md mt-4",
            uploadIcon: "text-muted-foreground w-12 h-12",
          }}
          endpoint={"imageUploader"}
          onClientUploadComplete={(res) => {
            const url = res[0].ufsUrl;

            toast.success("Image uploaded successfully!");
            onUploaded(url);
          }}
          onUploadError={(error) => {
            toast.error(error.message);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
