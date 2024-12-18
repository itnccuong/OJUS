import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { digitalOceanConfig } from "./constants";

// upload to digitalocean spaces
export const uploadFile = async (
  location: string,
  file: Express.Multer.File,
) => {
  const s3 = new S3Client({
    endpoint: process.env.DO_ENDPOINT as string,
    forcePathStyle: false,
    region: process.env.DO_REGION as string,
    credentials: {
      accessKeyId: process.env.DO_ACCESS as string,
      secretAccessKey: process.env.DO_SECRET as string,
    },
  });

  const randomPrefix = crypto.randomBytes(8).toString("hex");
  const randomFilename = `${randomPrefix}_${file.originalname}`;
  let key = `${location}/${randomFilename}`;
  const bucket = digitalOceanConfig.bucket;
  const command = new PutObjectCommand({
    Key: key,
    Body: file.buffer,
    Bucket: process.env.DO_BUCKET as string,
    ACL: "public-read",
    ContentType: file.mimetype,
  });
  await s3.send(command);
  return {
    url: `${digitalOceanConfig.location}/${key}`,
  };
};
