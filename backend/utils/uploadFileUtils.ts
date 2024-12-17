import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DO_endpoint, DO_location, DO_region } from "./constants";
import crypto from "crypto";

// connect to digitalocean spaces
const s3 = new S3Client({
  endpoint: DO_endpoint,
  forcePathStyle: false,
  region: DO_region,
  credentials: {
    accessKeyId: process.env.DO_ACCESS as string,
    secretAccessKey: process.env.DO_SECRET as string,
  },
});

// upload to digitalocean spaces
export async function uploadFile(
  bucket: string,
  location: string,
  file: Express.Multer.File,
): Promise<string> {
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
  return `${DO_location}/${key}`;
}
