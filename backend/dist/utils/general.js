"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURL = exports.parseFilename = void 0;
require("dotenv").config();
const parseFilename = (filename) => {
    let type = "";
    let number = 0;
    let i = 0;
    // Extract type (e.g., "input" or "output")
    while (i < filename.length && isNaN(Number(filename[i]))) {
        type += filename[i];
        i++;
    }
    // Extract number
    while (i < filename.length && !isNaN(Number(filename[i]))) {
        number = number * 10 + Number(filename[i]);
        i++;
    }
    return { type, number };
};
exports.parseFilename = parseFilename;
const getURL = (api) => {
    return "http://localhost:" + process.env.PORT + api;
};
exports.getURL = getURL;
