"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUpload = exports.startUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const startUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_s3_1.S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        }
    });
    const key = `${(0, uuid_1.v4)()}/${req.body.file_name}`;
    const createMultipartUploadCommand = new client_s3_1.CreateMultipartUploadCommand({
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        ACL: "public-read",
        Key: key,
    });
    const startUploadResponse = yield client.send(createMultipartUploadCommand);
    const uploadId = startUploadResponse.UploadId;
    const chunk_size = 50 * 1024 * 1024;
    const expires = 3600;
    const numberOfParts = Math.ceil(req.body.file_size / chunk_size);
    let presignedUrls = [];
    for (let i = 0; i < numberOfParts; i++) {
        const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(client, new client_s3_1.UploadPartCommand({
            Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            PartNumber: i + 1,
        }), {});
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
});
exports.startUpload = startUpload;
const completeUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_s3_1.S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        }
    });
    const etags = req.body.etags.split(",");
    const CompletedParts = etags.map((etag, index) => ({
        ETag: etag,
        PartNumber: index + 1,
    }));
    const completeUploadInput = {
        Key: req.body.key,
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        UploadId: req.body.upload_id,
        MultipartUpload: {
            Parts: CompletedParts.map((x) => {
                return { ETag: x.ETag, PartNumber: x.PartNumber };
            }),
        },
    };
    const completeMultipartUploadCommand = new client_s3_1.CompleteMultipartUploadCommand(completeUploadInput);
    const completeUploadResponse = yield client.send(completeMultipartUploadCommand);
    res.status(200).json({
        url: completeUploadResponse.Location,
    });
});
exports.completeUpload = completeUpload;
