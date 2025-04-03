import { NextFunction, Request, Response } from "express";
import { InventarioGeneral } from "../entities/inventario-general";

export async function getAllInventarioGeneral(req: Request, res: Response, next: NextFunction)  {
 try {
    
    const inventarioGeneral = await InventarioGeneral.find();
    if (inventarioGeneral.length === 0) {
        return res.status(404).json({ message: "No se encontraron registros." });
    }
    res.status(200).json(inventarioGeneral);

 } catch (error) {
    next(error);
 }
}

export async function getInventarioGeneralById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const inventarioGeneral = await InventarioGeneral.findOneBy({ id: Number(id) });
        if (!inventarioGeneral) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }
        res.status(200).json(inventarioGeneral);
    } catch (error) {
        next(error);
    }
    }

export async function getAllInventoryGeneralByHeadquarters(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const query = await InventarioGeneral.createQueryBuilder("inventario")
        .leftJoinAndSelect('inventario.headquartersRelation', 'sede')
        .where("sede.id = :id", { id: Number(id) })
        .getMany();

        if (query.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros." });
        }

        const inventarioGeneralFormated = query.map( i => ({
            id: i.id,
            name: i.name,
            brand: i.brand,
            model: i.model,
            serialNumber: i.serialNumber,
            location: i.location,
            quantity: i.quantity,
            otherDetails: i.otherDetails,
            acquisitionDate: i.acquisitionDate,
            purchaseValue: i.purchaseValue,
            warranty: i.warranty,
            warrantyPeriod: i.warrantyPeriod,
            inventoryNumber: i.inventoryNumber,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt,
            classificationId: i.classificationId,
            headquarters: i.headquartersRelation.name
        }));

        res.status(200).json(inventarioGeneralFormated);

    } catch (error) {
        next(error);
    }
}