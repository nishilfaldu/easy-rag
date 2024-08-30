import { toast } from "sonner";

import { computeSHA256 } from "./utils";
import type { Id } from "../../convex/_generated/dataModel";
import { getSignedURLForUpload } from "@/actions/s3-actions";




interface UploadImageResult {
  success: boolean;
  message?: string;
  result?: string[];
}

export async function uploadFilesToS3(
  files: File[],
  userId: Id<"users">
): Promise<UploadImageResult> {
  try {
    // Step 1: Generate signed URLs and upload each image
    const uploadPromises = files.map(async file => {
      let fileType = file.type;
      const fileSize = file.size;

      // Check if fileType is empty or undefined, and assign a default type based on file extension
      if (!fileType) {
        const fileExtension = file.name.split(".").pop();
        switch (fileExtension) {
          case "mdx":
            fileType = "text/markdown"; // or use 'text/mdx' if that's preferred
            break;
          case "md":
            fileType = "text/markdown";
            break;
          // Add more cases as needed
          default:
            fileType = "application/octet-stream"; // fallback for unknown types
        }
      }

      // Optionally, generate a checksum if needed for the file
      const checksum = await computeSHA256(file); // Add your logic for generating checksum

      const signedUrlResponse = await getSignedURLForUpload({
        fileType,
        fileSize,
        checksum,
        userId,
      });

      if (!signedUrlResponse.success) {
        throw new Error(signedUrlResponse.message);
      }

      // Upload the file to S3
      if (!signedUrlResponse.result) {
        throw new Error("Signed URL not found");
      }

      await fetch(signedUrlResponse.result, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: file,
      });

      // Extract the S3 key from the URL
      const fileUrl = signedUrlResponse.result.split("?")[0];
      // FIXME: remove the exclamation
      const fileName = fileUrl.split("/").pop()!;

      return fileName;
    });

    // Wait for all files to be uploaded
    const fileKeys = await Promise.all(uploadPromises);

    // Display success toast
    toast.success(`${fileKeys.length} files uploaded successfully!`);

    return {
      success: true,
      result: fileKeys,
    };
  } catch (error) {
    console.error("Error uploading files:", error);

    // Display error toast
    toast.error("An error occurred during file upload.");

    return {
      success: false,
      message: "An error occurred during file upload.",
      result: undefined,
    };
  }
}
