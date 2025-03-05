import { NextFunction, Request, Response } from "express";
import { EncuestasSatisfaccion } from "../entities/encuestas-satisfaccion";
import { validate } from "class-validator";

export async function getAllSurveySatisfaction(req: Request, res: Response, next: NextFunction){
    try {
        
        const encuestasSatisfaccion = await EncuestasSatisfaccion.find();

        return res.json(encuestasSatisfaccion);

    } catch (error) {
        next(error);
    }
}

export async function getSurveySatisfaction(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const encuestaSatisfaccion = await EncuestasSatisfaccion.findOneBy({id : parseInt(id)});

        if(!encuestaSatisfaccion){
            return res.status(404).json({message: "Encuesta de satisfacción no encontrada"});
        }

        return res.json(encuestaSatisfaccion);

    } catch (error) {
        next(error);
    }
}

export async function createSurveySatisfaction(req: Request, res: Response, next: NextFunction){
    try {
        
        const { ticketId, usuarioId, calificacionGeneral, tiempoRespuesta, conocimientoTecnico, amabilidadSoporte, solucionEfectiva, comentario, recomendariaServicio } = req.body;

        const encuestaSatisfaccion = new EncuestasSatisfaccion();
        encuestaSatisfaccion.ticketId = parseInt(ticketId);
        encuestaSatisfaccion.usuarioId = parseInt(usuarioId);
        encuestaSatisfaccion.calificacionGeneral = parseInt(calificacionGeneral);
        encuestaSatisfaccion.tiempoRespuesta = parseInt(tiempoRespuesta);
        encuestaSatisfaccion.conocimientoTecnico = parseInt(conocimientoTecnico);
        encuestaSatisfaccion.amabilidadSoporte = parseInt(amabilidadSoporte);
        encuestaSatisfaccion.solucionEfectiva = solucionEfectiva === "true" ? true : false;
        encuestaSatisfaccion.comentario = comentario;
        encuestaSatisfaccion.recomendariaServicio = recomendariaServicio === "true" ? true : false;

        const errors = await validate(encuestaSatisfaccion);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json(messages);
        }

        await encuestaSatisfaccion.save();

        return res.json(encuestaSatisfaccion);

    } catch (error) {
        next(error);
    }
}

export async function updateSurveySatisfaction(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { ticketId, usuarioId, calificacionGeneral, tiempoRespuesta, conocimientoTecnico, amabilidadSoporte, solucionEfectiva, comentario, recomendariaServicio } = req.body;

        const encuestaSatisfaccion = await EncuestasSatisfaccion.findOneBy({id : parseInt(id)});

        if(!encuestaSatisfaccion){
            return res.status(404).json({message: "Encuesta de satisfacción no encontrada"});
        }

        encuestaSatisfaccion.ticketId = parseInt(ticketId);
        encuestaSatisfaccion.usuarioId = parseInt(usuarioId);
        encuestaSatisfaccion.calificacionGeneral = parseInt(calificacionGeneral);
        encuestaSatisfaccion.tiempoRespuesta = parseInt(tiempoRespuesta);
        encuestaSatisfaccion.conocimientoTecnico = parseInt(conocimientoTecnico);
        encuestaSatisfaccion.amabilidadSoporte = parseInt(amabilidadSoporte);
        encuestaSatisfaccion.solucionEfectiva = solucionEfectiva === "true" ? true : false;
        encuestaSatisfaccion.comentario = comentario;
        encuestaSatisfaccion.recomendariaServicio = recomendariaServicio === "true" ? true : false;

        const errors = await validate(encuestaSatisfaccion);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json(messages);
        }

        await encuestaSatisfaccion.save();

        return res.json(encuestaSatisfaccion);

    } catch (error) {
        next(error);
    }
}

export async function deleteSurveySatisfaction(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const encuestaSatisfaccion = await EncuestasSatisfaccion.findOneBy({id : parseInt(id)});

        if(!encuestaSatisfaccion){
            return res.status(404).json({message: "Encuesta de satisfacción no encontrada"});
        }

        await encuestaSatisfaccion.remove();

        return res.json({message: "Encuesta de satisfacción eliminada "});

    } catch (error) {
        next(error);
    }
}