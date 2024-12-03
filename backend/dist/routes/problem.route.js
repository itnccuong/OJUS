"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const problem_controller_1 = require("../controllers/problem.controller");
const verify_token_1 = require("../middlewares/verify-token");
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
router.get("/no-account", (0, asyncErrorHandler_1.default)(problem_controller_1.getAllProblemsNoAccount));
router.get("/with-account", verify_token_1.verifyToken, (0, asyncErrorHandler_1.default)(problem_controller_1.getAllProblemsWithAccount));
router.post("/:problem_id/", verify_token_1.verifyToken, (0, asyncErrorHandler_1.default)(problem_controller_1.submit));
router.get("/:problem_id/no-account", (0, asyncErrorHandler_1.default)(problem_controller_1.getOneProblemNoAccount));
router.get("/:problem_id/with-account", verify_token_1.verifyToken, (0, asyncErrorHandler_1.default)(problem_controller_1.getOneProblemWithAccount));
exports.default = router;
