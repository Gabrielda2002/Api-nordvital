import { NextFunction, Request, Response } from "express";

export async function sendEmailWorkUs(req: Request, res: Response, next: NextFunction){
    try {
        
        const cv = req.file;

        console.log('se recibe pdf')

        const fileUrl = `${req.protocol}://${req.get('host')}/api/v1/uploads/FilesEmails/${cv?.filename}`;

        console.log('se recibe pdf', fileUrl)

      res.status(200).json({message: "Email enviado correctamente", fileUrl: fileUrl});

    } catch (error) {
        next(error);
    }
}