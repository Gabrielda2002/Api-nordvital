import { NextFunction, Request, Response } from "express";
import { InfrastructureCategory } from "../entities/infrastructure-category";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllInfrastructureCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;

        let categories;

        if (!name || name === "@") {
            categories = await InfrastructureCategory.createQueryBuilder("category")
                .select(["category.id", "category.name", "category.description", "category.priorityId"])
                .orderBy("category.name", "ASC")
                .limit(100)
                .getMany();
        } else {
            categories = await InfrastructureCategory.createQueryBuilder("category")
                .select(["category.id", "category.name", "category.description", "category.priorityId"])
                .where("category.name LIKE :name", { name: `%${name}%` })
                .orderBy("category.name", "ASC")
                .limit(50)
                .getMany();
        }

        return res.json(categories);
    } catch (error) {
        next(error);
    }
}

export async function getInfrastructureCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await InfrastructureCategory.findOneBy({ id: parseInt(String(id)) });

        if (!category) {
            return res.status(404).json({ message: "Infrastructure category not found" });
        }

        return res.json(category);
    } catch (error) {
        next(error);
    }
}

export async function createInfrastructureCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, priorityId } = req.body;

        const categoryExist = await InfrastructureCategory.findOneBy({ name });
        if (categoryExist) {
            return res.status(409).json({ message: "An infrastructure category with this name already exists" });
        }

        const category = new InfrastructureCategory();
        category.name = name;
        if (description) category.description = description;
        if (priorityId) category.priorityId = parseInt(String(priorityId));

        await validateEntity(category);
        await category.save();

        return res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

export async function updateInfrastructureCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, description, priorityId } = req.body;

        const category = await InfrastructureCategory.findOneBy({ id: parseInt(String(id)) });
        if (!category) {
            return res.status(404).json({ message: "Infrastructure category not found" });
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (priorityId !== undefined) category.priorityId = priorityId ? parseInt(String(priorityId)) : undefined;

        await validateEntity(category);
        await category.save();

        return res.json(category);
    } catch (error) {
        next(error);
    }
}

export async function deleteInfrastructureCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const category = await InfrastructureCategory.findOneBy({ id: parseInt(String(id)) });
        if (!category) {
            return res.status(404).json({ message: "Infrastructure category not found" });
        }

        await category.remove();

        return res.json({ message: "Infrastructure category deleted" });
    } catch (error) {
        next(error);
    }
}
