"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ContributionController = void 0;
const uploadFile_service_1 = require("../services/contribution.services/uploadFile.service");
const tsoa_1 = require("tsoa");
const verify_token_1 = require("../middlewares/verify-token");
const client_1 = __importDefault(require("../prisma/client"));
const findContribution_services_1 = require("../services/contribution.services/findContribution.services");
let ContributionController = class ContributionController extends tsoa_1.Controller {
    submitContribute(req, title, description, difficulty, tags, timeLimit, memoryLimit, file) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Start file upload process
            const details = yield (0, uploadFile_service_1.startUpload)(file);
            // Step 2: Upload chunks to S3
            const etags = yield (0, uploadFile_service_1.uploadToS3)(file, details.chunk_size, details.urls);
            // Step 3: Complete file upload and get the file URL
            const url = yield (0, uploadFile_service_1.completeUpload)(details.key, details.upload_id, etags);
            // Step 4: Save file information to the database
            const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}`;
            const createFile = yield client_1.default.files.create({
                data: {
                    filename: filename,
                    location: url,
                    filesize: file.size,
                    fileType: file.mimetype,
                },
            });
            // Step 5: Save contribution details to the database
            const contribution = yield client_1.default.problem.create({
                data: {
                    title: title,
                    description: description,
                    difficulty: parseInt(difficulty, 10),
                    tags: tags,
                    timeLimit: parseInt(timeLimit, 10),
                    memoryLimit: parseInt(memoryLimit, 10),
                    authorId: req.userId, // Accessing the user's ID from the request
                    fileId: createFile.fileId,
                },
            });
            // Step 6: Return a success response
            return {
                message: "Contribute submitted successfully",
                data: { contribution: contribution },
            };
        });
    }
    getAllContribute() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all pending contributions
            const contributions = yield (0, findContribution_services_1.findAllPendingContributions)();
            // Return a success response with the fetched contributions
            return {
                message: "Get all contributions successfully",
                data: { contributions: contributions },
            };
        });
    }
    getOneContribute(contribute_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the pending contribution using the provided ID
            const contribution = yield (0, findContribution_services_1.findPendingContribution)(contribute_id);
            // Return a success response with the fetched contribution
            return {
                message: "Contribute fetched successfully",
                data: { contribution: contribution },
            };
        });
    }
    acceptContribution(contribute_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that the contribution exists and is pending
            yield (0, findContribution_services_1.findPendingContribution)(contribute_id);
            // Update the contribution status to 'accepted' (e.g., status = 2)
            const updateContribution = yield client_1.default.problem.update({
                where: {
                    problemId: contribute_id,
                },
                data: {
                    status: 2,
                },
            });
            // Return success response
            return {
                message: "Contribute accepted successfully",
                data: { contribution: updateContribution },
            };
        });
    }
    rejectContribution(contribute_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that the contribution exists and is pending
            yield (0, findContribution_services_1.findPendingContribution)(contribute_id);
            // Update the contribution status to 'rejected' (e.g., status = 1)
            const updateContribution = yield client_1.default.problem.update({
                where: {
                    problemId: contribute_id,
                },
                data: {
                    status: 1,
                },
            });
            // Return success response
            return {
                message: "Contribute rejected successfully",
                data: { contribution: updateContribution },
            };
        });
    }
};
exports.ContributionController = ContributionController;
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Contribute submitted successfully"),
    (0, tsoa_1.Post)(""),
    (0, tsoa_1.Middlewares)(verify_token_1.verifyToken) // Middleware to verify the user's token
    ,
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.FormField)()),
    __param(2, (0, tsoa_1.FormField)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.FormField)()),
    __param(6, (0, tsoa_1.FormField)()),
    __param(7, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ContributionController.prototype, "submitContribute", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.SuccessResponse)("200", "All contributions fetched successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContributionController.prototype, "getAllContribute", null);
__decorate([
    (0, tsoa_1.Get)("{contribute_id}"),
    (0, tsoa_1.SuccessResponse)("200", "Contribute fetched successfully"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionController.prototype, "getOneContribute", null);
__decorate([
    (0, tsoa_1.Put)("{contribute_id}/accept"),
    (0, tsoa_1.SuccessResponse)("200", "Contribution accepted successfully"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionController.prototype, "acceptContribution", null);
__decorate([
    (0, tsoa_1.Put)("{contribute_id}/reject"),
    (0, tsoa_1.SuccessResponse)("200", "Contribution rejected successfully"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContributionController.prototype, "rejectContribution", null);
exports.ContributionController = ContributionController = __decorate([
    (0, tsoa_1.Route)("/api/contributions") // Base path for contribution-related routes
    ,
    (0, tsoa_1.Tags)("Contributions") // Group this endpoint under "Contributions" in Swagger
], ContributionController);
