"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const formatResponse_1 = require("../utils/formatResponse");
const constants_1 = require("../utils/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({
            message: "Access Denied: No token provided",
        });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return (0, formatResponse_1.formatResponse)(res, "UNAUTHORIZED", "Token expired", constants_1.STATUS_CODE.UNAUTHORIZED, {});
            }
            else {
                return (0, formatResponse_1.formatResponse)(res, "UNAUTHORIZED", "Invalid token", constants_1.STATUS_CODE.UNAUTHORIZED, {});
            }
        }
        else {
            req.userId = decoded.userId;
            next();
        }
    });
};
exports.verifyToken = verifyToken;
