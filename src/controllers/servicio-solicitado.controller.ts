import { NextFunction, Request, Response } from "express";
import { ServiciosSolicitados } from "../entities/servicios-solicitados";
import { validate } from "class-validator";

export async function getAllServiciosSolicitados(req: Request, res: Response, next: NextFunction){

    try {
        
        const serviciosSolicitados = await ServiciosSolicitados.find();
        return res.json(serviciosSolicitados);

    } catch (error) {
        next(error);
    }

}

export async function getServicioSolicitado(req: Request, res: Response, next: NextFunction){

    try {
        
        const { id } = req.params;

        const servicioSolicitado = await ServiciosSolicitados.findOneBy({id: parseInt(id)});

        if(!servicioSolicitado){
            return res.status(404).json({message: "Servicio solicitado no encontrado"});
        }

        return res.json(servicioSolicitado);


    } catch (error) {
        next(error);
    }

}

export async function createServicioSolicitado(req: Request, res: Response, next: NextFunction){

    try {
        
        const { code, description } = req.body;

        const codeExists = await ServiciosSolicitados.findOneBy({code});

        if (codeExists) {
            return res.status(409).json({message: "El CUPS ya existe"});   
        }

        const servicioSolicitado =  new ServiciosSolicitados();

        servicioSolicitado.code = code;
        servicioSolicitado.name = description.toUpperCase();
        servicioSolicitado.status = true;

        const errors = await validate(servicioSolicitado);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                constraint: err.constraints,
                property: err.property
            }))

            return res.status(400).json({"messages":"Ocurrio un error: ", message});
        }

        await servicioSolicitado.save();

        return res.json(servicioSolicitado);

    } catch (error) {
        next(error);
    }

}

export async function updateServicioSolicitado(req: Request, res: Response, next: NextFunction){

    try {
        
        const { id } = req.params;

        const { code, name, status } = req.body;

        const servicioSolicitado = await ServiciosSolicitados.findOneBy({id: parseInt(id)});

        if (!servicioSolicitado) {
            return res.status(404).json({message: "Servicio solicitado no encontrado"});
        }

        servicioSolicitado.code = code;
        servicioSolicitado.name = name;
        servicioSolicitado.status = status;

        const errors = await validate(servicioSolicitado);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                constraint: err.constraints,
                property: err.property
            }))

            return res.status(400).json({"messages":"Ocurrio un error: ", message});
        }

        await servicioSolicitado.save();

        return res.json(servicioSolicitado);

    } catch (error) {
        next(error);
    }

}

export async function deleteServicioSolicitado(req: Request, res: Response, next: NextFunction){

    try {
        
        const { id } = req.params;

        const servicioSolicitado = await ServiciosSolicitados.findOneBy({id: parseInt(id)});

        if (!servicioSolicitado) {
            return res.status(404).json({message: "Servicio solicitado no encontrado"});
        }

        await servicioSolicitado.remove();

        return res.json({message: "Servicio solicitado eliminado"});

    } catch (error) {
        next(error);
    }

}

export async function getServiciosSolicitadosByCode(req: Request, res: Response, next: NextFunction){

    try {
        
        const { code } = req.body;

        const servicioSolicitado = await ServiciosSolicitados.createQueryBuilder("servicios_solicitados")
        .where("servicios_solicitados.code = :code", {code})
        .getOne();

        if (!servicioSolicitado) {
            return res.status(404).json({message: "Servicio solicitado no encontrado"});
        }

        return res.json(servicioSolicitado);

    } catch (error) {
        next(error);
    }

}

export async function updateServicioSolicitadoTable(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { description, status } = req.body;
  
      const servicioSolicitado = await ServiciosSolicitados.findOneBy({ id: parseInt(id) });
  
      if (!servicioSolicitado) {
        return res.status(404).json({ message: "Servicio solicitado not found" });
      }

      servicioSolicitado.name =  description.toUpperCase();
      servicioSolicitado.status = status === "1" ? true : false;

      const errors = await validate(servicioSolicitado);
      if (errors.length > 0) {
        const message = errors.map(err => (
            Object.values(err.constraints || {}).join(", ")
        ));
        return res.status(400).json({ message: message });
      }
  
      await servicioSolicitado.save();
  
      return res.status(200).json({ message: "Servicio solicitado actualizado" });
    } catch (error) {
      next(error);
    }
  }
  