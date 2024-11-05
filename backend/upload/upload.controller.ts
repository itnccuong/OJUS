import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';



import { Request, Response, RequestHandler } from "express";



export const startUpload: RequestHandler = async (req: Request, res: Response) => {

  const client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', 
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', 
      }
  });

  const key = `${uuidv4()}/${req.body.file_name}`;

  const createMultipartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
  });

  const startUploadResponse = await client.send(createMultipartUploadCommand);

  const uploadId = startUploadResponse.UploadId;

  const chunk_size = 50 * 1024 * 1024;
  const expires=3600;

  const numberOfParts = Math.ceil(req.body.file_size / chunk_size);

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

  res.status(200).json({
    urls: presignedUrls,
    chunk_size: chunk_size,
    key: key,
    upload_id: uploadId,
    fields: {
        "Content-Type": req.body.content_type,
        "Key": key,
    },
  });

};



export const completeUpload: RequestHandler = async (req: Request, res: Response) => {
  const client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', 
    }
  });

  const etags = req.body.etags.split(",");

  const CompletedParts = etags.map((etag: string, index: number) => ({
    ETag: etag,
    PartNumber: index + 1,
  }));

  const completeUploadInput = {
    Key: req.body.key,
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    UploadId: req.body.upload_id,
    MultipartUpload: {
        Parts: CompletedParts.map((x: { ETag: string; PartNumber: number }) => {
            return { ETag: x.ETag, PartNumber: x.PartNumber };
        }),
    },
  };

  const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(completeUploadInput);

  const completeUploadResponse = await client.send(completeMultipartUploadCommand);

  res.status(200).json({
    url: completeUploadResponse.Location,
  });
};
