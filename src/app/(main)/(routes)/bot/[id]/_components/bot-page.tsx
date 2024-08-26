"use client";
import { useState } from "react";
import { AddFilesModal } from "./add-files-modal";
import { toast } from "sonner";
import { uploadFilesToS3 } from "@/lib/storage";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import {} from "@/actions/s3-actions";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export default function BotDetails() {
  //   const { isAuthenticated } = useConvexAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  //   const user = useQuery(
  //     api.users.getCurrentUser,
  //     isAuthenticated ? undefined : "skip"
  //   );

  //   const isUserLoading = !user;

  async function onSubmit() {
    // if (isUserLoading) return;

    if (uploadedFiles.length < 2) {
      toast.error("Please upload at least 2 images");

      return;
    }

    const uploadImageResult = await uploadFilesToS3(
      uploadedFiles,
      "1" as Id<"users">
    );

    if (!uploadImageResult.success || !uploadImageResult.result) {
      toast.error("Failed to upload images");

      return;
    }
  }
  return (
    <div>
      hello from bot page
      <span>bot page</span>
      <AddFilesModal
        setUploadedFiles={setUploadedFiles}
        uploadedFiles={uploadedFiles}
        onSubmit={onSubmit}
      />
    </div>
  );
}
