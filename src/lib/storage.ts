import { toast } from "sonner";

import { computeSHA256 } from "./utils";
import { getSignedURLForUpload } from "@/actions/s3-actions";
import { Id } from "../../convex/_generated/dataModel";

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
    const uploadPromises = files.map(async (image) => {
      const fileType = image.type;
      const fileSize = image.size;

      // Optionally, generate a checksum if needed for the image
      const checksum = await computeSHA256(image); // Add your logic for generating checksum

      const signedUrlResponse = await getSignedURLForUpload({
        fileType,
        fileSize,
        checksum,
        userId,
      });

      if (!signedUrlResponse.success) {
        throw new Error(signedUrlResponse.message);
      }

      // Upload the image to S3
      if (!signedUrlResponse.result) {
        throw new Error("Signed URL not found");
      }

      await fetch(signedUrlResponse.result, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: image,
      });

      // Extract the S3 key from the URL
      const imageUrl = signedUrlResponse.result.split("?")[0];
      // FIXME: remove the exclamation
      const imageName = imageUrl.split("/").pop()!;

      return imageName;
    });

    // Wait for all files to be uploaded
    const imageKeys = await Promise.all(uploadPromises);

    // Display success toast
    toast.success(`${imageKeys.length} files uploaded successfully!`);

    return {
      success: true,
      result: imageKeys,
    };
  } catch (error) {
    console.error("Error uploading files:", error);

    // Display error toast
    toast.error("An error occurred during image upload.");

    return {
      success: false,
      message: "An error occurred during image upload.",
      result: undefined,
    };
  }
}
