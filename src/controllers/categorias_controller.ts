import { NextFunction, Request, Response } from "express";
import { Categorias } from "../entities/categorias";

export async function getAllCategories(req: Request, res: Response, next: NextFunction){
    try {
        
        const categories = await Categorias.find();

        res.json(categories);

    } catch (error) {
        next(error);
    }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const category = await Categorias.findOneBy({ id: parseInt(id) });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.json(category);

    } catch (error) {
        next(error);
    }
}

export async function createCategory(req: Request, res: Response, next: NextFunction){
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const categoryExist = await Categorias.findOneBy({ name });

        if (categoryExist) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Categorias();
        category.name = name;

        await category.save();

        return res.json(category);

    } catch (error) {
        next(error);
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = await Categorias.findOneBy({ id: parseInt(id) });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name;

        await category.save();

        return res.json(category);

    } catch (error) {
        next(error);
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const category = await Categorias.findOneBy({ id: parseInt(id) });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.remove();

        return res.json({ message: "Category deleted" });

    } catch (error) {
        next(error);
    }
}