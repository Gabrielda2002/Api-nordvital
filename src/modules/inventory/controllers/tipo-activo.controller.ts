import { NextFunction, Request, Response } from "express";
import { TipoActivo } from "../entities/tipo-activo";

export async function getAllAssetTypes(req: Request, res: Response, next: NextFunction) {
    try {
        const assetTypes = await TipoActivo.createQueryBuilder("ta")
            .getMany();

        const formattedAssetTypes: { id: number; name: string }[] = assetTypes.map((ta) => ({
            id: ta.id,
            name: ta.name,
        }));

        res.status(200).json(formattedAssetTypes);

    } catch (error) {
        next(error);
    }
}