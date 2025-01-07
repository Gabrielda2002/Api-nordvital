import { NextFunction, Request, Response } from "express";
import { ServiciosGenerales } from "../entities/servicios-generales";
import { validate } from "class-validator";

export async function getServicioGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        
        const servicios = await ServiciosGenerales.find();

        return res.json(servicios);

    } catch (error) {
        next(error);
    }
}

export async function getServicioGeneralById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const servicio = await ServiciosGenerales.findOneBy({ id: parseInt(id) });

        if (!servicio) {
            return res.status(404).json({ message: "Servicio not found" });
        }

        return res.json(servicio);

    } catch (error) {
        next(error);
    }
}

export async function createServicioGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { code, description} = req.body;

        const servicioExist = await ServiciosGenerales.createQueryBuilder("servicios_generales")
        .where("servicios_generales.code = :code", { code })
        .getOne();

        if (servicioExist) {
            return res.status(400).json({ message: "Servicio already exists" });
        }

        const servicio = new ServiciosGenerales();
        servicio.code = code;
        servicio.description = description;

        const errors = await validate(servicio);
        
        if (errors.length > 0 ) {
            const errorMensage = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({mesage : "error creating servicio" , errors: errorMensage});
        }

        await servicio.save();

        return res.status(201).json(servicio);

    } catch (error) {
        next(error);
    }
}

export async function updateServicioGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const { code, description} = req.body;

        const servicio = await ServiciosGenerales.createQueryBuilder("servicios_generales")
        .where("servicios_generales.id = :id", { id: parseInt(id) })
        .getOne();

        if (!servicio) {
            return res.status(404).json({ message: "Servicio not found" });
        }

        servicio.code = code;
        servicio.description = description;

        const errors = await validate(servicio);
        
        if (errors.length > 0 ) {
            const errorMensage = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({mesage : "error updating servicio" , errors: errorMensage});
        }

        await servicio.save();

        return res.json(servicio);

    } catch (error) {
        next(error);
    }
}

export async function deleteServicioGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const servicio = await ServiciosGenerales.findOneBy({ id: parseInt(id) });

        if (!servicio) {
            return res.status(404).json({ message: "Servicio not found" });
        }

        await servicio.remove();

        return res.json({ message: "Servicio deleted" });

    } catch (error) {
        next(error);
    }
}

// controlador para consultar servicios contratados 
export async function getServicioContratado(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {code} = req.body;

        const servicios = await ServiciosGenerales.createQueryBuilder("servicios_generales")
        .leftJoinAndSelect("servicios_generales.notasTecnicasRelation", "notas_tecnicas")
        .leftJoinAndSelect("notas_tecnicas.convenioRelation", "convenio")
        .leftJoinAndSelect("notas_tecnicas.placeRelation", "sede")
        .leftJoinAndSelect("sede.municipioRelation", "municipio")
        .andWhere("servicios_generales.code = :code", { code })
        .getMany();

        console.log(servicios)

        if (servicios.length === 0) {
            return res.status(404).json({ message: "Servicio not found" });
        }

        const result = servicios.map(servicio => {
            const isContrated = servicio.notasTecnicasRelation.length > 0;
            return {
                id: servicio.id || "N/A",
                code: servicio.code || "N/A",
                description: servicio.description || "N/A",
                Relations: servicio.notasTecnicasRelation.map((nota) => ({
                    nameConvenio: nota.convenioRelation?.name,
                    nameSede: nota.placeRelation?.name,
                    isContrated
                })  ) || [],
            }
        });

        return res.json(result);

    } catch (error) {
        next(error);
    }
}