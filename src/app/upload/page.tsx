// page.tsx
import { Suspense } from "react";
import SingleImageDropzoneUsage from "./up";

export default function UploadPage() {
  return (
    <div>
      <h1>Upload your image</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Render the client component inside the server component */}
        <SingleImageDropzoneUsage />
      </Suspense>
    </div>
  );
}
