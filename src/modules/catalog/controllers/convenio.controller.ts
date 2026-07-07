import { NextFunction, Request, Response } from "express";
import { Convenio } from "../entities/convenio";
import { validate } from "class-validator";

export async function getAllConvenio(req: Request, res: Response, next: NextFunction) {
    try {

        const convenio = await Convenio.find();
        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}

export async function getConvenioById(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const convenio = await Convenio.findOneBy({ id: parseInt(String(id)) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}
export async function createConvenio(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const convenioExist = await Convenio.findOneBy({ name });
        if (convenioExist) {
            return res.status(400).json({ message: "Convenio already exists" });
        }

        const convenio = new Convenio();
        convenio.name = name;
        convenio.status = true;

        const errors = await validate(convenio);

        if (errors.length > 0) {

            const errorMensage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ mesage: "error creating convenio", errors: errorMensage });
        }

        await convenio.save();

        return res.status(201).json(convenio);

    } catch (error) {
        next(error);
    }
}

export async function updateConvenio(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name } = req.body;


        const convenio = await Convenio.findOneBy({ id: parseInt(String(id)) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        convenio.name = name;

        const errors = await validate(convenio);

        if (errors.length > 0) {
            const errorMensage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ mesage: "error updating convenio", errors: errorMensage });
        }

        await convenio.save();

        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}

export async function deleteConvenio(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const convenio = await Convenio.findOneBy({ id: parseInt(String(id)) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        await convenio.remove();

        return res.json({ message: "Convenio deleted" });

    } catch (error) {
        next(error);
    }
}


// actualizar el estado de los convenios
export async function updateStatusConvenio(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const { status, name } = req.body;

        const convenioExist = await Convenio.findOneBy({ id: parseInt(String(id)) });

        if (!convenioExist) {
            return res.status(404).json({ message: "Convenio no encontrado" });
        }
        console.log(status, name);
        console.log(`${status == "1"}`);
        convenioExist.status = status == "1";
        convenioExist.name = name;

        const errors = await validate(convenioExist);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: messages });
        }

        await convenioExist.save();

        return res.json(convenioExist);

    } catch (error) {
        next(error);
    }
}

export async function getAgreementByName(req: Request, res: Response, next: NextFunction) {
    try {

        const { name } = req.body;

        let convenio;

        if (name === '@') {
            convenio = await Convenio.createQueryBuilder("convenio")
                .limit(100)
                .getMany();
        } else {
            convenio = await Convenio.createQueryBuilder("convenio")
                .where("convenio.name LIKE :name", { name: `%${name}%` })
                .getMany();
        }


        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        return res.status(200).json(convenio);

    } catch (error) {
        next(error);
    }
}