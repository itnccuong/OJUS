import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const startUpload = async (file: Express.Multer.File) => {
  const client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const key = `${uuidv4()}/${file.originalname}`;

  const createMultipartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
  });

  const startUploadResponse = await client.send(createMultipartUploadCommand);

  const uploadId = startUploadResponse.UploadId;

  const chunk_size = 50 * 1024 * 1024;
  const expires = 3600;

  const numberOfParts = Math.ceil(file.size / chunk_size);

  let presignedUrls: string[] = [];

  for (let i = 0; i < numberOfParts; i++) {
    const presignedUrl = await getSignedUrl(
      client,
      new UploadPartCommand({
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: i + 1,
      }),
      {},
    );

    presignedUrls.push(presignedUrl);
  }

  return {
    urls: presignedUrls,
    chunk_size: chunk_size,
    key: key,
    upload_id: uploadId,
  };
};

const splitFileIntoChunks = (file: Express.Multer.File, chunkSize: number) => {
  const chunks: Buffer[] = [];
  let start = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push(file.buffer.subarray(start, end));
    start = end;
  }

  return chunks;
};

const uploadChunk = async (url: string, chunk: Buffer) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: chunk,
    });

    if (!response.ok) {
      throw new Error("Failed to upload chunk.");
    }

    const etag = response.headers.get("Etag");
    if (!etag) {
      throw new Error("Failed to get Etag.");
    }

    return etag;
  } catch (error) {
    console.error("Error uploading chunk:", error);
    throw error;
  }
};

export const uploadToS3 = async (
  file: Express.Multer.File,
  chunkSize: number,
  urls: string[],
) => {
  const etags = [];
  const chunks = splitFileIntoChunks(file, chunkSize);

  for (let i = 0; i < chunks.length; i++) {
    try {
      const etag = await uploadChunk(urls[i], chunks[i]);
      etags.push(etag);
      console.log(`Chunk ${i + 1} of ${chunks.length} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading chunk ${i + 1}:`, error);
      throw error;
    }
  }

  return etags;
};

export const completeUpload = async (
  key: string,
  upload_id: string,
  etags: string[],
) => {
  const client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const CompletedParts = etags.map((etag: string, index: number) => ({
    ETag: etag,
    PartNumber: index + 1,
  }));

  const completeUploadInput = {
    Key: key,
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    UploadId: upload_id,
    MultipartUpload: {
      Parts: CompletedParts.map((x: { ETag: string; PartNumber: number }) => {
        return { ETag: x.ETag, PartNumber: x.PartNumber };
      }),
    },
  };

  const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(
    completeUploadInput,
  );

  const completeUploadResponse = await client.send(
    completeMultipartUploadCommand,
  );
  if (!completeUploadResponse.Location) {
    throw new Error("Failed to complete upload.");
  }

  return completeUploadResponse.Location;
};
