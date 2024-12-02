"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../utils/error");
const formatResponse_1 = require("../utils/formatResponse");
const constants_1 = require("../utils/constants");
const globalErrorHandler = (err, req, res, next) => {
    console.log("Error in global error handler:", err);
    if (err instanceof error_1.CustomError) {
        return (0, formatResponse_1.formatResponse)(res, err.name, err.message, err.status, err.data);
    }
    return (0, formatResponse_1.formatResponse)(res, "INTERNAL_SERVER_ERROR", "Internal server error", constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR, {});
};
exports.default = globalErrorHandler;
