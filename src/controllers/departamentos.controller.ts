import { NextFunction, Request, Response } from "express"
import { departamentos } from "../entities/departamentos"
import { validate } from "class-validator"

export async function getAllDepartments(req: Request, res: Response, next: NextFunction){
    try {
        const departments = await departamentos.find()

        if (departments.length < 0) {
            return res.status(404).json({
                message: "No se encontraron departamentos"
            })
        }

        return res.json(departments)
    } catch (error) {
        next(error)
    }
}

export async function getDepartment(req: Request, res: Response, next: NextFunction){
    try {
        const id = req.params.id
        const department = await departamentos.findOneBy({id: parseInt(id)})
        if (!department) {
            return res.status(404).json({
                message: "Departamento no encontrado"
            })
        }

        return res.json(department)

    }
    catch (error) {
        next(error)
    }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction){
    try {
        const { name } = req.body

        const departmentExist = await departamentos.findOneBy({name: name})

        if (departmentExist) {
            return res.status(400).json({
                message: "El departamento ya existe"
            })
        }

        const department = new departamentos()

        department.name = name

        const errors = await validate(department)
        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message})
        }

        await department.save()

        return res.json(department)
    } catch (error) {
        next(error)
    }
}

export async function updateDepartment(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params

        const { name } = req.body

        const department = await departamentos.findOneBy({id: parseInt(id)})

        if (!department) {
            return res.status(404).json({
                message: "Departamento no encontrado"
            })
        }

        department.name = name

        const errors = await validate(department)
        if (errors.length > 0) {
            const message = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({message})
        }

        await department.save()

        return res.json(department)
    } catch (error) {
        next(error)
    }
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params

        const department = await departamentos.findOneBy({id: parseInt(id)})

        if (!department) {
            return res.status(404).json({
                message: "Departamento no encontrado"
            })
        }

        await department.remove()

        return res.json({
            message: "Departamento eliminado"
        })

    }

    catch (error) {
        next(error)
    }

}