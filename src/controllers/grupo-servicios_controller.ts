import { Request, Response } from "express";
import { GrupoServicios } from "../entities/grupo-servicios";

export async function getAllGruposServicios(req: Request, res: Response) {
  try {
    const gruposServicios = await GrupoServicios.find();
    return res.json(gruposServicios);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}