import { NextFunction, Request, Response } from "express";
import { SstCategory } from "../entities/sst-category";
import { validateEntity } from "@core/utils/validation-helper";

export async function getAllSstCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;

        let categories;

        if (!name || name === "@") {
            categories = await SstCategory.createQueryBuilder("category")
                .select(["category.id", "category.name", "category.description", "category.priorityId"])
                .orderBy("category.name", "ASC")
                .limit(100)
                .getMany();
        } else {
            categories = await SstCategory.createQueryBuilder("category")
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

export async function getSstCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await SstCategory.findOneBy({ id: parseInt(String(id)) });

        if (!category) {
            return res.status(404).json({ message: "SST category not found" });
        }

        return res.json(category);
    } catch (error) {
        next(error);
    }
}

export async function createSstCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, priorityId } = req.body;

        const categoryExist = await SstCategory.findOneBy({ name });
        if (categoryExist) {
            return res.status(409).json({ message: "An SST category with this name already exists" });
        }

        const category = new SstCategory();
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

export async function updateSstCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, description, priorityId } = req.body;

        const category = await SstCategory.findOneBy({ id: parseInt(String(id)) });
        if (!category) {
            return res.status(404).json({ message: "SST category not found" });
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

export async function deleteSstCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const category = await SstCategory.findOneBy({ id: parseInt(String(id)) });
        if (!category) {
            return res.status(404).json({ message: "SST category not found" });
        }

        await category.remove();

        return res.json({ message: "SST category deleted" });
    } catch (error) {
        next(error);
    }
}
