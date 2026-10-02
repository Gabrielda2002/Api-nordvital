import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { Sedes } from "../entities/sedes";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllLugaresRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const lugaresRadicacion = await Sedes.createQueryBuilder("lugar_radicacion")
        .leftJoinAndSelect("lugar_radicacion.municipioRelation", "municipio")
        .leftJoinAndSelect("municipio.departmentRelation", "department")
        .getMany();

        if (!lugaresRadicacion) {
            throw new NotFoundError("Sede not found");
        }

        const lugaresFormat = lugaresRadicacion.map(lugar => ({
            id: lugar.id,
            name: lugar.name,
            address: lugar.address,
            status: lugar.status,
            departmentId: lugar.municipioRelation?.departmentRelation?.id,
            cityId: lugar.municipioRelation.id,
            department: lugar.municipioRelation?.departmentRelation?.name,
            city: lugar.municipioRelation.name,
            licenseCode: lugar.licenseCode,
            headquartersNumber: lugar.numeroSede,
        }));

        return res.json(lugaresFormat);
    } catch (error) {
        next(error);
    }
}

export async function getLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const lugarRadicacion = await Sedes.findOneBy({ id: parseInt(String(id))  });

        if (!lugarRadicacion) {
            throw new NotFoundError("Sede not found");
        }

        return res.json(lugarRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function createLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const { name, address, cityId, headquartersNumber, licenseCode } = req.body;

        const lugarRadicacionExist = name ? await Sedes.findOneBy({ name }) : null;

        if (lugarRadicacionExist) {
            throw new ConflictError("Ya existe una sede con ese nombre");
        }

        const lugarRadicacion = new Sedes();
        lugarRadicacion.name = name;
        lugarRadicacion.status = true;
        lugarRadicacion.address = address;
        lugarRadicacion.municipalityId = parseInt(cityId);
        lugarRadicacion.numeroSede = headquartersNumber;
        lugarRadicacion.licenseCode = licenseCode;

       await validateEntity(lugarRadicacion);

        await lugarRadicacion.save();

        return res.json(lugarRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function deleteLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const lugarRadicacion = await Sedes.findOneBy({ id: parseInt(String(id)) });

        if (!lugarRadicacion) {
            throw new NotFoundError("Sede not found");
        }

        await lugarRadicacion.remove();

        return res.json({ message: "Sede deleted" });
    } catch (error) {
        next(error);
    }
}

export async function getLugaresRadicacionByName(req: Request, res: Response, next: NextFunction){
    try {
        const { name } = req.body;

        let lugaresRadicacion;
        
        if (name === "@") {
            lugaresRadicacion = await Sedes.createQueryBuilder("lugar_radicacion")
            .limit(100)
            .getMany();
            
        }else{
            lugaresRadicacion = await Sedes.createQueryBuilder("lugar_radicacion")
            .where("lugar_radicacion.name LIKE :name", { name: `%${name}%` })
            .getMany();
        }

        if (!lugaresRadicacion) {
            throw new NotFoundError("Sede not found")
        }

        return res.json(lugaresRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function updateHeadquarters(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { status, name, address, cityId, headquartersNumber, licenseCode } = req.body;

        const lugarRadicacion = await Sedes.findOneBy({ id: parseInt(String(id)) });

        if (!lugarRadicacion) {
            throw new NotFoundError("Sede not found");
        }

        lugarRadicacion.name = name;
        lugarRadicacion.status = status == "1";
        lugarRadicacion.address = address;
        lugarRadicacion.municipalityId = parseInt(cityId);
        lugarRadicacion.numeroSede = headquartersNumber;
        lugarRadicacion.licenseCode = licenseCode;

        await validateEntity(lugarRadicacion);

        await lugarRadicacion.save();

        return res.json(lugarRadicacion);

    } catch (error) {
        next(error);
    }
}

// buscar sede por id departamento
export async function getLugaresRadicacionByDepartment(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const lugaresRadicacion = await Sedes.createQueryBuilder("lugar_radicacion")
        .leftJoinAndSelect("lugar_radicacion.municipioRelation", "municipio")
        .leftJoinAndSelect("municipio.departmentRelation", "department")
        .where("department.id = :id", { id: parseInt(String(id)) })
        .getMany();

        if (!lugaresRadicacion) {
            throw new NotFoundError("Sede not found");
        }

        return res.json(lugaresRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function getHeadquartersList(req: Request, res: Response, next: NextFunction) {
    try {
        
        const headquarters = await Sedes.createQueryBuilder("lugar_radicacion")
        .select(["lugar_radicacion.id", "lugar_radicacion.name"])
        .getMany()
        
        res.json(headquarters);

    } catch (error) {
        next(error);
    }
}