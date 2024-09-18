import { useState, useEffect, useRef } from "react";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";

export default function SingleImageDropzoneUsage({
  setUrl,
}: {
  setUrl: (url: string | undefined) => void;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState(0);

  // Create a ref to store the previously uploaded file
  const previousFileRef = useRef<File | undefined>(undefined);

  useEffect(() => {
    const handleUpload = async (file: File) => {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress); // Update progress as the file uploads
          },
          input: { type: "books" },
        });

        setUrl(res.url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    // Only trigger the upload if the file has changed
    if (file && file !== previousFileRef.current) {
      handleUpload(file);
      previousFileRef.current = file; // Store the current file in ref to avoid re-upload
    } else {
      setProgress(0); // Reset progress when no file is selected or if it's the same file
    }

    return () => {
      setProgress(0);
    };
  }, [file, edgestore.publicFiles, setUrl]);

  const handleFileChange = (file?: File) => {
    setFile(file); // Set file for upload
  };

  return (
    <div>
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
      {file && progress > 0 && (
        <div className="mt-5">
          <div className="w-full bg-gray-200 rounded">
            <div
              className={`h-2 rounded transition-all duration-300 ${
                progress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${20}%` }}
            />
          </div>
          <p className="text-center mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
}
