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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectContribute = exports.acceptContribute = exports.submitContribute = exports.getAllContribute = exports.getOneContribute = exports.searchContribute = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const formatResponse_1 = require("../utils/formatResponse");
const constants_1 = require("../utils/constants");
const uploadFile_service_1 = require("../services/contribute.services/uploadFile.service");
const prisma = new client_1.PrismaClient();
const submitContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, difficulty, tags, timeLimit, memoryLimit } = req.body;
    const file = req.file;
    if (!file) {
        console.log("No file");
        return null;
    }
    const details = yield (0, uploadFile_service_1.startUpload)(file);
    console.log("Details", details);
    const etags = yield (0, uploadFile_service_1.uploadToS3)(file, details.chunk_size, details.urls);
    const url = yield (0, uploadFile_service_1.completeUpload)(details.key, details.upload_id, etags);
    const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}`;
    const createFile = yield prisma.files.create({
        data: {
            filename: filename,
            location: url,
            filesize: file.size,
            fileType: file.mimetype,
        },
    });
    const contribute = yield prisma.problem.create({
        data: {
            title: title,
            description: description,
            difficulty: parseInt(difficulty, 10),
            tags: tags,
            timeLimit: parseInt(timeLimit, 10),
            memoryLimit: parseInt(memoryLimit, 10),
            authorId: req.userId,
            fileId: createFile.fileId,
        },
    });
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Contribute submitted successfully", constants_1.STATUS_CODE.SUCCESS, { contribute });
});
exports.submitContribute = submitContribute;
const searchContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.searchContribute = searchContribute;
const getOneContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contribute_id } = req.params;
    const contribute = yield prisma.problem.findUnique({
        where: {
            problemId: parseInt(contribute_id, 10),
            status: 0,
        },
    });
    if (!contribute) {
        return (0, formatResponse_1.formatResponse)(res, "NOT_FOUND", "Contribute not found", constants_1.STATUS_CODE.NOT_FOUND, {});
    }
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Contribute fetch successfully", constants_1.STATUS_CODE.SUCCESS, { contribute });
});
exports.getOneContribute = getOneContribute;
const getAllContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Lấy tất cả các contribute với status 0 (chưa được duyệt)
    const contributions = yield prisma.problem.findMany({
        where: {
            status: 0,
        },
    });
    // Kiểm tra nếu không có kết quả nào
    if (!contributions || contributions.length === 0) {
        return (0, formatResponse_1.formatResponse)(res, "NOT_FOUND", "No contributions found", constants_1.STATUS_CODE.NOT_FOUND, {});
    }
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Get all contributions successfully", constants_1.STATUS_CODE.SUCCESS, { contributions });
});
exports.getAllContribute = getAllContribute;
const acceptContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contribute_id } = req.params;
    const existingContribute = yield prisma.problem.findUnique({
        where: {
            problemId: parseInt(contribute_id, 10),
        },
    });
    if ((existingContribute === null || existingContribute === void 0 ? void 0 : existingContribute.status) !== 0) {
        return (0, formatResponse_1.formatResponse)(res, "BAD_REQUEST", "Contribution is not in pending state", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    const contribute = yield prisma.problem.update({
        where: {
            problemId: parseInt(contribute_id, 10),
        },
        data: {
            status: 2,
        },
    });
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Contribute accepted successfully", constants_1.STATUS_CODE.SUCCESS, { contribute });
});
exports.acceptContribute = acceptContribute;
const rejectContribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contribute_id } = req.params;
    const existingContribute = yield prisma.problem.findUnique({
        where: {
            problemId: parseInt(contribute_id, 10),
        },
    });
    if ((existingContribute === null || existingContribute === void 0 ? void 0 : existingContribute.status) !== 0) {
        return (0, formatResponse_1.formatResponse)(res, "BAD_REQUEST", "Contribution is not in pending state", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    const contribute = yield prisma.problem.update({
        where: {
            problemId: parseInt(contribute_id, 10),
        },
        data: {
            status: 1,
        },
    });
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Contribute rejected successfully", constants_1.STATUS_CODE.SUCCESS, { contribute });
});
exports.rejectContribute = rejectContribute;
