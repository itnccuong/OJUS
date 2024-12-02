"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const contribute_route_1 = __importDefault(require("./contribute.route"));
const problem_route_1 = __importDefault(require("./problem.route"));
router.use("/auth", auth_route_1.default);
router.use("/users", user_route_1.default);
router.use("/contributes", contribute_route_1.default);
router.use("/problems", problem_route_1.default);
exports.default = router;
