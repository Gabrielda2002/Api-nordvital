import { NextFunction, Request, Response } from "express";

export const parseParentFolderId = (req: Request, res: Response, next: NextFunction) => {
    console.log("reques body middlware parseo",req.body)
    const { parentFolderId } = req.body;
  
    if (parentFolderId) {
      req.parentFolderId = parentFolderId;
    }
  
    next();
  };

