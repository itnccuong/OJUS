"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
router.get("/:username", (0, asyncErrorHandler_1.default)(user_controller_1.getProfileByName));
exports.default = router;
