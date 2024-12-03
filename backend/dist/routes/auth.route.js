"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth.controller");
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
router.post("/register", (0, asyncErrorHandler_1.default)(auth_controller_1.register));
// router.post("/login", asyncErrorHandler(login));
router.post("/reset-link", (0, asyncErrorHandler_1.default)(auth_controller_1.sendResetLink));
router.post("/change-password", (0, asyncErrorHandler_1.default)(auth_controller_1.changePassword));
exports.default = router;
