"use client";
import { useState } from "react";
import { AddFilesModal } from "./add-files-modal";

export default function BotDetails() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  return (
    <div>
      hello from bot page
      <span>bot page</span>
      <AddFilesModal
        setUploadedFiles={setUploadedFiles}
        uploadedFiles={uploadedFiles}
      />
    </div>
  );
}
