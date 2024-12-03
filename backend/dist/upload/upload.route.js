"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload = express_1.default.Router();
const upload_controller_1 = require("./upload.controller");
upload.post("/start-upload", upload_controller_1.startUpload);
upload.post("/complete-upload", upload_controller_1.completeUpload);
exports.default = upload;
