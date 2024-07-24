import { Request, Response } from "express";
import { GrupoServicios } from "../entities/grupo-servicios";
import { validate } from "class-validator";

export async function getAllGruposServicios(req: Request, res: Response) {
  try {
    const gruposServicios = await GrupoServicios.find();
    return res.json(gruposServicios);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getGrupoServicios(req: Request, res: Response){
  try {
    const { id } = req.params;

    const grupoServiciosId = parseInt(id);

    if (isNaN(grupoServiciosId)) {
      return res.status(400).json({ message: "Id must be a number" });
    }

    const grupoServicios = await GrupoServicios.findOneBy({ id: grupoServiciosId });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    return res.json(grupoServicios);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createGrupoServicios(req: Request, res: Response){
  try {
    
    const {name} = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const grupoServiciosExist = await GrupoServicios.findOneBy({ name });

    if (grupoServiciosExist) {
      return res.status(400).json({ message: "Grupo de servicios ya existe" });
    }

    const grupoServicios = new GrupoServicios();
    grupoServicios.name = name;
    grupoServicios.status = true;

    const errors = await validate(grupoServicios);

    if (errors.length > 0) {

      const errorsMessage = errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }))

      return res.status(400).json({ message: "Error creating grupo de servicios", errors: errorsMessage });

    }

    await grupoServicios.save();

    return res.status(201).json(grupoServicios);

  } catch (error) {
  
    console.error(error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
      
    }

    return res.status(500).json({ message: "Internal Server Error" });

  }
}

export async function updateGrupoServicios(req: Request, res: Response){
  try {
    
    const { id } = req.params;
    const { name, status } = req.body;

    const grupoServiciosId = parseInt(id);

    if (isNaN(grupoServiciosId)) {
      return res.status(400).json({ message: "Id must be a number" });
    }

    const grupoServicios = await GrupoServicios.findOneBy({ id: grupoServiciosId });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    grupoServicios.name = name;
    grupoServicios.status = status;

    const errors = await validate(grupoServicios);

    if (errors.length > 0) {

      const errorsMessage = errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }))

      return res.status(400).json({ message: "Error updating grupo de servicios", errors: errorsMessage });

    }

    await grupoServicios.save();

    return res.json(grupoServicios);

  } catch (error) {
    
    console.error(error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });

  }
}

export async function deleteGrupoServicios(req: Request, res: Response) {
  try {
    
    const { id } = req.params;

    const grupoServiciosId = parseInt(id);

    if (isNaN(grupoServiciosId)) {
      return res.status(400).json({ message: "Id must be a number" });
    }

    const grupoServicios = await GrupoServicios.findOneBy({ id: grupoServiciosId });

    if (!grupoServicios) {
      return res.status(404).json({ message: "Grupo de servicios no encontrado" });
    }

    await grupoServicios.remove();

    return res.json({ message: "Grupo de servicios eliminado" });

  } catch (error) {
    
    console.error(error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });

  }
}