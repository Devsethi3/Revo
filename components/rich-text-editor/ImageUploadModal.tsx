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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload you image and choose for you workspace channel
            </DialogDescription>
          </DialogHeader>
          <UploadDropzone
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
    </>
  );
};

export default ImageUploadModal;
