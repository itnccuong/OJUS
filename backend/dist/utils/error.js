"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(name, message, status, data) {
        super(message);
        this.status = status;
        this.name = name;
        this.data = data;
    }
}
exports.CustomError = CustomError;
