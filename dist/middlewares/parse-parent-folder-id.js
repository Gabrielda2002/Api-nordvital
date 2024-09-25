"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParentFolderId = void 0;
const parseParentFolderId = (req, res, next) => {
    console.log("reques body middlware parseo", req.body);
    const { parentFolderId } = req.body;
    if (parentFolderId) {
        req.parentFolderId = parentFolderId;
    }
    next();
};
exports.parseParentFolderId = parseParentFolderId;
