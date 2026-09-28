import { NextFunction, Request, Response } from "express";
import { Componentes } from "../entities/componentes";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllComponents(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const components = await Componentes.find();

        if (components.length === 0) {
            throw new NotFoundError("Component not found")
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
        const id = String(req.params.id);
        const component = await Componentes.findOneBy({ id: parseInt(id) });

        if (!component) {
            throw new NotFoundError("Componente not found")
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

        component.idEquipments = parseInt(String(equipmentId));
        component.name = name;
        component.brand = brand;
        component.capacity = capacity;
        component.speed = speed;
        component.otherData = otherData;
        component.model = model;
        component.serial = serial;

        await validateEntity(component);

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
        const { name, brand, capacity, speed, otherData, model, serial } = req.body;

        const component = await Componentes.findOneBy({ id: parseInt(String(id)) });

        if (!component) {
            throw new NotFoundError("Component not found");
        }

        component.name = name;
        component.brand = brand;
        component.capacity = capacity;
        component.speed = speed;
        component.otherData = otherData;
        component.model = model;
        component.serial = serial;

        await validateEntity(component);

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

        const component = await Componentes.findOneBy({ id: parseInt(String(id)) });

        if (!component) {
            throw new NotFoundError("Componente not found")
        }

        await component.remove();

        return res.json({
            message: "Componente eliminado",
        });
    } catch (error) {
        next(error);
    }
}
