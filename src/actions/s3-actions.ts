"use server";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrlS3 } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { Id } from "../../convex/_generated/dataModel";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME!;

// Allowed file types: PDFs, DOC/DOCX, TXT, MD/MDX, CSV
const ALLOWED_FILE_TYPES = [
  "application/pdf", // PDF files
  "application/msword", // DOC files
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX files
  "text/plain", // TXT files
  "text/markdown", // MD files
  "text/x-markdown", // MDX files
  "text/csv", // CSV files
];
const MAX_FILE_SIZE = 1048576 * 10; // 10 MB

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  userId: Id<"users">;
};

export async function getSignedURLForUpload({
  fileType,
  fileSize,
  checksum,
  userId,
}: GetSignedURLParams) {
  console.log("filetype:", fileType);
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    return {
      success: false,
      message: "File type not allowed",
      result: undefined,
    };
  }

  if (fileSize > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "File size too large. It cannot be more than 10MB",
      result: undefined,
    };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uuidv4(),
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userId.toString(),
    },
  });

  try {
    const url = await getSignedUrlS3(s3Client, putObjectCommand, {
      expiresIn: 60,
    }); // 60 seconds

    return {
      success: true,
      result: url,
      message: "A signed url for file upload for generated successfully.",
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);

    return {
      success: false,
      message: "Failed to generate signed URL",
      result: undefined,
    };
  }
}

type DeleteS3ObjectParams = {
  key: string;
};

export async function deleteS3Object({
  key,
}: DeleteS3ObjectParams): Promise<void> {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    throw new Error("Failed to delete object from S3");
  }
}
