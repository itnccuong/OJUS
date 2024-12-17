import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { digitalOceanConfig } from "./constants";

// connect to digitalocean spaces
const s3 = new S3Client({
  endpoint: digitalOceanConfig.endpoint,
  forcePathStyle: false,
  region: digitalOceanConfig.region,
  credentials: {
    accessKeyId: process.env.DO_ACCESS as string,
    secretAccessKey: process.env.DO_SECRET as string,
  },
});

// upload to digitalocean spaces
export const uploadFile = async (
  bucket: string,
  location: string,
  file: Express.Multer.File,
) => {
  const randomPrefix = crypto.randomBytes(8).toString("hex");
  const randomFilename = `${randomPrefix}_${file.originalname}`;
  let key = `${location}/${randomFilename}`;
  const command = new PutObjectCommand({
    Key: key,
    Body: file.buffer,
    Bucket: bucket,
    ACL: "public-read",
    ContentType: file.mimetype,
  });
  await s3.send(command);
  return { url: `${digitalOceanConfig.location}/${key}`, key: key };
};

export const deleteFile = async (bucket: string, key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await s3.send(command);
};
