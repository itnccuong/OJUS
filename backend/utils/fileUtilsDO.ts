import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  endpoint: process.env.DO_ENDPOINT as string,
  forcePathStyle: false,
  region: process.env.DO_REGION as string,
  credentials: {
    accessKeyId: process.env.DO_ACCESS as string,
    secretAccessKey: process.env.DO_SECRET as string,
  },
});

// upload to digitalocean spaces
export const uploadFile = async (
  location: string,
  file: Express.Multer.File,
) => {
  const randomPrefix = crypto.randomBytes(8).toString("hex");
  const randomFilename = `${randomPrefix}_${file.originalname}`;
  let key = `${location}/${randomFilename}`;
  const command = new PutObjectCommand({
    Key: key,
    Body: file.buffer,
    Bucket: process.env.DO_BUCKET as string,
    ACL: "public-read",
    ContentType: file.mimetype,
  });
  await s3.send(command);
  return {
    url: `${process.env.DO_CDN_URL}/${key}`,
    key: key,
  };
};

export const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Key: key,
    Bucket: process.env.DO_BUCKET as string,
  });
  await s3.send(command);
};
