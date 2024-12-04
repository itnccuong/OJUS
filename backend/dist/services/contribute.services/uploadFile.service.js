"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUpload = exports.uploadToS3 = exports.startUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const startUpload = (file) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_s3_1.S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
    const key = `${(0, uuid_1.v4)()}/${file.originalname}`;
    const createMultipartUploadCommand =
      new client_s3_1.CreateMultipartUploadCommand({
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        ACL: "public-read",
        Key: key,
      });
    const startUploadResponse = yield client.send(createMultipartUploadCommand);
    const uploadId = startUploadResponse.UploadId;
    const chunk_size = 50 * 1024 * 1024;
    const expires = 3600;
    const numberOfParts = Math.ceil(file.size / chunk_size);
    let presignedUrls = [];
    for (let i = 0; i < numberOfParts; i++) {
      const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(
        client,
        new client_s3_1.UploadPartCommand({
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
  });
exports.startUpload = startUpload;
const splitFileIntoChunks = (file, chunkSize) => {
  const chunks = [];
  let start = 0;
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push(file.buffer.subarray(start, end));
    start = end;
  }
  return chunks;
};
const uploadChunk = (url, chunk) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield fetch(url, {
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
  });
const uploadToS3 = (file, chunkSize, urls) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const etags = [];
    const chunks = splitFileIntoChunks(file, chunkSize);
    for (let i = 0; i < chunks.length; i++) {
      try {
        const etag = yield uploadChunk(urls[i], chunks[i]);
        etags.push(etag);
        console.log(`Chunk ${i + 1} of ${chunks.length} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading chunk ${i + 1}:`, error);
        throw error;
      }
    }
    return etags;
  });
exports.uploadToS3 = uploadToS3;
const completeUpload = (key, upload_id, etags) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_s3_1.S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
    const CompletedParts = etags.map((etag, index) => ({
      ETag: etag,
      PartNumber: index + 1,
    }));
    const completeUploadInput = {
      Key: key,
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      UploadId: upload_id,
      MultipartUpload: {
        Parts: CompletedParts.map((x) => {
          return { ETag: x.ETag, PartNumber: x.PartNumber };
        }),
      },
    };
    const completeMultipartUploadCommand =
      new client_s3_1.CompleteMultipartUploadCommand(completeUploadInput);
    const completeUploadResponse = yield client.send(
      completeMultipartUploadCommand,
    );
    if (!completeUploadResponse.Location) {
      throw new Error("Failed to complete upload.");
    }
    return completeUploadResponse.Location;
  });
exports.completeUpload = completeUpload;
