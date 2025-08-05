import { NextFunction, Request, Response } from "express";
import { Convenio } from "../entities/convenio";
import { validate } from "class-validator";

export async function getAllConvenio(req: Request, res: Response, next: NextFunction){
    try {
        
        const convenio = await Convenio.find();
        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a convenio by its ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The JSON representation of the convenio.
 */
export async function getConvenioById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const convenio = await Convenio.findOneBy({ id: parseInt(id) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}

/**
 * Creates a new convenio.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created convenio object or an error message.
 */
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

            const errorMensage = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({mesage : "error creating convenio" , errors: errorMensage});
        }

        await convenio.save();

        return res.status(201).json(convenio);

    } catch (error) {
        next(error);
    }
}

/**
 * Updates a convenio (agreement) based on the provided ID.
 * @param req - The request object containing the ID parameter and the new name in the request body.
 * @param res - The response object used to send the updated convenio or error messages.
 * @returns The updated convenio if successful, or an error message if there was an error.
 */
export async function updateConvenio(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name } = req.body;


        const convenio = await Convenio.findOneBy({ id: parseInt(id) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }

        convenio.name = name;

        const errors = await validate(convenio);

        if (errors.length > 0) {
            const errorMensage = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({mesage : "error updating convenio" , errors: errorMensage});
        }

        await convenio.save();

        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}

/**
 * Deletes a convenio (agreement) by its ID.
 * 
 * @param req - The request object containing the ID of the convenio to be deleted.
 * @param res - The response object used to send the result of the operation.
 * @returns A JSON response indicating the result of the operation.
 */
export async function deleteConvenio(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const convenio = await Convenio.findOneBy({ id: parseInt(id) });

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

        const convenio = await Convenio.findOneBy({ id: parseInt(id) });

        if (!convenio) {
            return res.status(404).json({ message: "Convenio not found" });
        }


        if (name) {
            convenio.name = name;
        }

        if (status !== undefined && status !== "") {
            convenio.status = status == "1";
        }

        const errors = await validate(convenio);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating status convenio", messages });
        }

        await convenio.save();

        return res.json(convenio);

    } catch (error) {
        next(error);
    }
}