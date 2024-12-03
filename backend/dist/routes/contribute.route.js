"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { verifyToken } = require("../middlewares/verify-token");
// const { uploadFile } = require('../upload/upload-file');
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/", storage: multer_1.default.memoryStorage() }); // Specify the destination for uploaded files
const contribute_controller_1 = require("../controllers/contribute.controller");
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
router.use(verifyToken);
// router.get("/search", searchContribute);
router.get("/", (0, asyncErrorHandler_1.default)(contribute_controller_1.getAllContribute));
router.get("/:contribute_id", (0, asyncErrorHandler_1.default)(contribute_controller_1.getOneContribute));
router.post("/", upload.single("file"), (0, asyncErrorHandler_1.default)(contribute_controller_1.submitContribute));
router.post("/accept/:contribute_id", (0, asyncErrorHandler_1.default)(contribute_controller_1.acceptContribute));
router.post("/reject/:contribute_id", (0, asyncErrorHandler_1.default)(contribute_controller_1.rejectContribute));
exports.default = router;
