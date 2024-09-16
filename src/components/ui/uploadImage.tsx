"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

type UploadResult = {
  response: any; // Replace `any` with actual types if known
  url: string;
  metadata: any;
};

type SingleImageDropzoneUsageProps = {
  onUploadComplete?: (result: UploadResult) => void; // Make this optional if not required
};

export default function SingleImageDropzoneUsage({
  onUploadComplete,
}: SingleImageDropzoneUsageProps) {
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });

      // Trigger the callback on successful upload if provided
      if (onUploadComplete) {
        onUploadComplete({
          response: res,
          url: res.url,
          metadata: res.metadata,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFile(file);
      handleUpload(file);
    } else {
      setFile(null);
    }
  };

  return (
    <SingleImageDropzone
      width={200}
      height={200}
      value={file}
      onChange={handleFileChange}
    />
  );
}
