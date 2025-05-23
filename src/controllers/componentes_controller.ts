import { NextFunction, Request, Response } from "express";
import { Componentes } from "../entities/componentes";
import { validate } from "class-validator";

export async function getAllComponents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const components = await Componentes.find();

    if (!components) {
      return res.status(404).json({
        message: "No se encontraron componentes",
      });
        
    }

    return res.json(components);
  } catch (error) {
    next(error);
  }
}

export async function getComponent(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const id = req.params.id;
        const component = await Componentes.findOneBy({ id: parseInt(id) });
    
        if (!component) {
        return res.status(404).json({
            message: "Componente no encontrado",
        });
        }
    
        return res.json(component);
    } catch (error) {
        next(error);
    }
}

export async function createComponent(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const {
            equipmentId,
            name,
            brand,
            capacity,
            speed,
            otherData,
            model,
            serial,
        } = req.body;
    
        const component = new Componentes()

        component.idEquipments = parseInt(equipmentId);
        component.name = name;
        component.brand = brand;
        component.capacity = capacity;
        component.speed = speed;
        component.otherData = otherData;
        component.model = model;
        component.serial = serial;
    
        const errors = await validate(component);
    
        if (errors.length > 0) {
            const messageErrors = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            return res.status(400).json(messageErrors);
        }
    
        await component.save();
    
        return res.json(component);
    } catch (error) {
        next(error);
    }
}

export async function updateComponent(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { id } = req.params;
        const {
            name,
            brand,
            capacity,
            speed,
            description,
            model,
            serial,
        } = req.body;
    
        const component = await Componentes.findOneBy({ id: parseInt(id) });
    
        if (!component) {
            return res.status(404).json({
                message: "Componente no encontrado",
            });
        }
    
        component.name = name;
        component.brand = brand;
        component.capacity = capacity;
        component.speed = speed;
        component.otherData = description;
        component.model = model;
        component.serial = serial;
    
        const errors = await validate(component);
    
        if (errors.length > 0) {
            const messageErrors = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            return res.status(400).json(messageErrors);
        }
    
        await component.save();
    
        return res.json(component);
    } catch (error) {
        next(error);
    }
}

export async function deleteComponent(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { id } = req.params;
    
        const component = await Componentes.findOneBy({ id: parseInt(id) });
    
        if (!component) {
            return res.status(404).json({
                message: "Componente no encontrado",
            });
        }
    
        await component.remove();
    
        return res.json({
            message: "Componente eliminado",
        });
    } catch (error) {
        next(error);
    }
}
