"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedUrl, setStagedUrl] = useState<null | string>(null);

  // Note: UploadThing handles the internal 'isUploading' state via its component,
  // but if you are doing post-processing after upload, you can use this.
  const [isUploading, setIsUploading] = useState(false);

  const onUploaded = useCallback((url: string) => {
    setStagedUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setStagedUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      isUploading,
      setIsUploading,
      clear,
    }),
    [
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      isUploading,
      setIsUploading,
      clear,
    ]
  );
}

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
