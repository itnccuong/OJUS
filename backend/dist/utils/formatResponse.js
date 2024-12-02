"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = void 0;
const formatResponse = (res, name, message, status, data) => {
    return res.status(status).json({
        name,
        message,
        data,
    });
};
exports.formatResponse = formatResponse;
