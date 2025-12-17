"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (url: string) => void;
}

const ImageUploadModal = ({
  open,
  onOpenChange,
  onUploaded,
}: ImageUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]
          max-w-md
          rounded-xl
          sm:w-full
        "
      >
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Choose an image to represent your workspace or channel.
            <br />
            Supported formats: JPG, PNG, GIF. Maximum size: 4MB.
          </DialogDescription>
        </DialogHeader>

        <UploadDropzone
          endpoint="imageUploader"
          className="
            rounded-xl
            p-6
            sm:p-8
            ut-ready:bg-background
            ut-ready:border-2
            ut-ready:border-dashed
            ut-ready:border-muted-foreground/30
            ut-ready:hover:border-primary/50
            ut-ready:transition-colors
            ut-uploading:bg-muted/50
            ut-uploading:border-primary
            ut-uploading:animate-pulse
            ut-label:text-foreground
            ut-label:font-medium
            ut-allowed-content:text-muted-foreground
            ut-allowed-content:text-xs
            ut-button:bg-primary
            ut-button:text-primary-foreground
            ut-button:hover:bg-primary/90
            ut-button:transition-colors
            ut-button:font-medium
          "
          appearance={{
            uploadIcon: "text-muted-foreground w-10 h-10",
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.ufsUrl;

            if (!url) {
              toast.error("Upload failed. Please try again.");
              setIsUploading(false);
              return;
            }

            toast.success("Image uploaded successfully");
            onUploaded(url);
            setIsUploading(false);
          }}
          onUploadError={() => {
            setIsUploading(false);
            toast.error(
              "We couldn't upload your image. Please check the file size and format."
            );
          }}
        />

        {isUploading && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Uploading image… please don&apos;t close this window.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
