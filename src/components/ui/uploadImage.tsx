import { useState, useEffect, useRef, useCallback } from "react";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";

export default function SingleImageDropzoneUsage({
  setUrl,
}: {
  setUrl: (url: string | undefined) => void;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Create a ref to store the previously uploaded file
  const previousFileRef = useRef<File | undefined>(undefined);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress);
            // console.log(progress);
          },
          input: { type: "books" },
        });

        setUrl(res.url);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [edgestore.publicFiles, setUrl]
  );

  useEffect(() => {
    // Only trigger the upload if the file has changed
    if (file && file !== previousFileRef.current) {
      handleUpload(file);
      previousFileRef.current = file; // Store the current file in ref to avoid re-upload
    }
  }, [file, handleUpload]);

  const handleFileChange = (file?: File) => {
    setFile(file); // Set file for upload
  };

  return (
    <div className="space-y-4">
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={handleFileChange}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1, // 1MB
          maxFiles: 1,
        }}
      />
      {isUploading && (
        <div className="w-[200px]">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Uploading: {progress.toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
}
