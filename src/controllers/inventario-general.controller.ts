import { NextFunction, Request, Response } from "express";
import { InventarioGeneral } from "../entities/inventario-general";
import { validate } from "class-validator";
import { addMonths, differenceInDays, subYears } from "date-fns";
import { Between, LessThan, MoreThan } from "typeorm";

export async function getAllInventarioGeneral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const inventarioGeneral = await InventarioGeneral.find();
    if (inventarioGeneral.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros." });
    }
    res.status(200).json(inventarioGeneral);
  } catch (error) {
    next(error);
  }
}

export async function getInventarioGeneralById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const inventarioGeneral = await InventarioGeneral.findOneBy({
      id: Number(id),
    });
    if (!inventarioGeneral) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }
    res.status(200).json(inventarioGeneral);
  } catch (error) {
    next(error);
  }
}

export async function getAllInventoryGeneralByHeadquarters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const query = await InventarioGeneral.createQueryBuilder("inventario")
      .leftJoinAndSelect("inventario.headquartersRelation", "sede")
      .leftJoinAndSelect('inventario.responsibleRelation', 'responsable')
      .leftJoinAndSelect('inventario.classificationRelation', 'clasificacion')
      .leftJoinAndSelect('inventario.assetRelation', 'activo')
      .leftJoinAndSelect('inventario.materialRelation', 'material')
      .leftJoinAndSelect('inventario.statusRelation', 'estado')
      .leftJoinAndSelect('inventario.areaTypeRelation', 'tipoArea')
      .leftJoinAndSelect('inventario.dependencyAreaRelation', 'areaDependencia')
      .leftJoinAndSelect('inventario.assetTypeRelation', 'tipoActivo')
      .leftJoinAndSelect('inventario.seguimiento', 'seguimiento')
      .leftJoinAndSelect('seguimiento.usuario', 'usuario')
      .where("sede.id = :id", { id: Number(id) })
      .getMany();

    if (query.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros." });
    }

    const inventarioGeneralFormated = query.map((i) => ({
      id: i.id,
      name: i.name,
      brand: i.brand,
      model: i.model,
      serialNumber: i.serialNumber,
      location: i.location,
      quantity: i.quantity,
      otherDetails: i.otherDetails,
      acquisitionDate: i.acquisitionDate,
      purchaseValue: i.purchaseValue,
      warranty: i.warranty,
      warrantyPeriod: i.warrantyPeriod,
      inventoryNumber: i.inventoryNumber,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      classificationId: i.classificationId,
      headquartersId: i.headquartersId,
      headquarters: i.headquartersRelation?.name,
      responsable: i.responsibleRelation?.name,
      classification: i.classificationRelation?.name,
      asset: i.assetRelation?.name, 
      assetId: i.assetId,
      material: i.materialRelation?.name,
      materialId: i.materialId,
      statusId: i.statusId,
      status: i.statusRelation?.name,
      areaType: i.areaTypeRelation?.name,
      areaTypeId: i.areaTypeId,
      assetType: i.assetTypeRelation?.name,
      assetTypeId: i.assetTypeId,
      dependencyAreaId: i.dependencyAreaId,
      dependencyArea: i.dependencyAreaRelation?.name,
      seguimiento: i.seguimiento.map((s) => ({
        id: s.id,
        eventDate: s.fecha_evento,
        typeEvent: s.typeEvent,
        description: s.description,
        responsableName: s.usuario?.name,
        responsableLastName: s.usuario?.lastName,
      })),
    }));

    res.status(200).json(inventarioGeneralFormated);
  } catch (error) {
    next(error);
  }
}

export async function createInventoryGeneral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      brand,
      model,
      serialNumber,
      location,
      quantity,
      otherDetails,
      acquisitionDate,
      purchaseValue,
      warranty,
      warrantyPeriod,
      inventoryNumber,
      classificationId,
      headquartersId,
      statusId,
      assetId,
      materialId,
      areaTypeId,
      assetTypeId,
      responsableId,
      dependencyAreaId,
    } = req.body;

    const newInventarioGeneral = new InventarioGeneral();
    newInventarioGeneral.name = name;
    newInventarioGeneral.brand = brand;
    newInventarioGeneral.model = model;
    newInventarioGeneral.serialNumber = serialNumber;
    newInventarioGeneral.location = location;
    newInventarioGeneral.quantity = quantity;
    newInventarioGeneral.otherDetails = otherDetails;
    newInventarioGeneral.acquisitionDate = acquisitionDate;
    newInventarioGeneral.purchaseValue = purchaseValue;
    newInventarioGeneral.warranty = warranty === "true" ? true : false;
    newInventarioGeneral.warrantyPeriod = warrantyPeriod;
    newInventarioGeneral.inventoryNumber = inventoryNumber;
    newInventarioGeneral.classificationId = parseInt(classificationId);
    newInventarioGeneral.headquartersId = parseInt(headquartersId);
    newInventarioGeneral.statusId = parseInt(statusId); 
    newInventarioGeneral.assetId = parseInt(assetId);
    newInventarioGeneral.materialId = parseInt(materialId);
    newInventarioGeneral.areaTypeId = parseInt(areaTypeId);
    newInventarioGeneral.assetTypeId = parseInt(assetTypeId);
    newInventarioGeneral.responsableId = parseInt(responsableId);
    newInventarioGeneral.dependencyAreaId = parseInt(dependencyAreaId);

    const errors = await validate(newInventarioGeneral);
    if (errors.length > 0) {
      const messages = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: messages });
    }

    await newInventarioGeneral.save();

    res.status(201).json(newInventarioGeneral);
  } catch (error) {
    next(error);
  }
}

// controller para actualizar un inventario general
export async function updateInventoryGeneral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      model,
      serialNumber,
      location,
      quantity,
      otherDetails,
      acquisitionDate,
      purchaseValue,
      warranty,
      warrantyPeriod,
      inventoryNumber,
      classificationId,
      headquartersId,
      statusId,
      assetId,
      materialId,
      areaTypeId,
      assetTypeId,
      responsableId,
      dependencyAreaId,
    } = req.body;

    const inventarioGeneral = await InventarioGeneral.findOneBy({
      id: Number(id),
    });

    if (!inventarioGeneral) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    inventarioGeneral.name = name;
    inventarioGeneral.brand = brand;
    inventarioGeneral.model = model;
    inventarioGeneral.serialNumber = serialNumber;
    inventarioGeneral.location = location;
    inventarioGeneral.quantity = quantity;
    inventarioGeneral.otherDetails = otherDetails;
    inventarioGeneral.acquisitionDate = acquisitionDate;
    inventarioGeneral.purchaseValue = purchaseValue;
    inventarioGeneral.warranty = warranty === "1" ? true : false;
    inventarioGeneral.warrantyPeriod = warrantyPeriod;
    inventarioGeneral.inventoryNumber = inventoryNumber;
    inventarioGeneral.classificationId = parseInt(classificationId);
    inventarioGeneral.headquartersId = parseInt(headquartersId);
    inventarioGeneral.statusId = parseInt(statusId); 
    inventarioGeneral.assetId = parseInt(assetId);
    inventarioGeneral.materialId = parseInt(materialId);
    inventarioGeneral.areaTypeId = parseInt(areaTypeId);
    inventarioGeneral.assetTypeId = parseInt(assetTypeId);
    inventarioGeneral.responsableId = parseInt(responsableId);
    inventarioGeneral.dependencyAreaId = parseInt(dependencyAreaId);

    const errors = await validate(inventarioGeneral);
    if (errors.length > 0) {
      const messages = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: messages });
    }

    await InventarioGeneral.save(inventarioGeneral);
    
    res.status(200).json(inventarioGeneral);
  }
  catch (error) {
    next(error);
  }
}

// estadisticas sobre garantia
export async function getInvetoryGeneralWarrantyStatitics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    const { id } = req.params;

     const totalIvGeneral =  await InventarioGeneral.count({ where: { headquartersId: Number(id) }});
        const generalInWarranty = await InventarioGeneral.count({ where: { warranty: true, headquartersId: Number(id) }});
    
        // obtener InventarioGeneral con garantia para calcular fecha de vencimiento
        const generalWithWarranty =  await InventarioGeneral.find({
          where: { warranty: true, headquartersId: Number(id) },
          select: ["id" ,'acquisitionDate', 'warrantyPeriod']
        });
    
        const expiringWarranties = generalWithWarranty.filter(e => {
          const warrantyMonths = parseInt(e.warrantyPeriod.match(/\d+/)?.[0] || '0');
          if (warrantyMonths > 0) {
            const expirationDate = addMonths(new Date(e.acquisitionDate), warrantyMonths);
            const expiresSoon =  expirationDate > new Date() && expirationDate < addMonths(new Date(), 3);
            return expiresSoon;
          }
          return false;
        });
    
        return res.json({
          total: totalIvGeneral,
          inWarranty: generalInWarranty,
          percentage: ((generalInWarranty / totalIvGeneral) * 100).toFixed(2),
          expiringSoon: {
            count: expiringWarranties.length,
            equiment: expiringWarranties
          }
        })

  } catch (error) {
    next(error);
  }
}

// estadisticas sobre edad
export async function getInventoryGeneralAgeStatistics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

      const { id } = req.params;

      const now = new Date();
      const oneYearAgo = subYears(now, 1);
      const twoYearsAgo = subYears(now, 2);
      const threeYearsAgo = subYears(now, 3);
      
      const lessThanOneYear = await InventarioGeneral.count({ where: { acquisitionDate: MoreThan(oneYearAgo), headquartersId: parseInt(id) } });
      const betweenOneAndTwoYears = await InventarioGeneral.count({ 
        where: { 
          acquisitionDate: Between(twoYearsAgo, oneYearAgo), headquartersId: parseInt(id)
        } 
      });
      const betweenTwoAndThreeYears = await InventarioGeneral.count({ 
        where: { 
          acquisitionDate: Between(threeYearsAgo, twoYearsAgo), headquartersId: parseInt(id)
        } 
      });
      const moreThanThreeYears = await InventarioGeneral.count({ 
        where: { 
          acquisitionDate: LessThan(threeYearsAgo), headquartersId: parseInt(id)
        } 
      });
      
      // Cálculo de la edad promedio en días
      const inventoryGeneral = await InventarioGeneral.find({ select: ["acquisitionDate"], where: { headquartersId: parseInt(id) } });
      let totalAge = 0;
      inventoryGeneral.forEach(equipment => {
        if (equipment.acquisitionDate) {
          const age = differenceInDays(now, new Date(equipment.acquisitionDate));
          totalAge += age;
        }
      });
      const averageAgeInDays = totalAge / inventoryGeneral.length || 0;
      const averageAgeInMonths = averageAgeInDays / 30;
      const averageAgeInYears = averageAgeInMonths / 12;
      
      return res.json({
        distribution: [
          { label: "Menos de 1 año", value: lessThanOneYear },
          { label: "Entre 1 y 2 años", value: betweenOneAndTwoYears },
          { label: "Entre 2 y 3 años", value: betweenTwoAndThreeYears },
          { label: "Más de 3 años", value: moreThanThreeYears },
        ],
        averageAge: {
          days: Math.round(averageAgeInDays),
          months: Math.round(averageAgeInMonths),
          years: averageAgeInYears.toFixed(1)
        }
      });
    } catch (error) {
      next(error);
    }
}

// estadisticas de cantidad por sede
export async function getInventoryGeneralByHeadquartersStatistics(req: Request, res: Response, next: NextFunction){
  try {
    
    const { id } = req.params;

    const headquarters = await InventarioGeneral.createQueryBuilder("inventario")
      .select("sede.name", "sedeName")
      .addSelect("COUNT(inventario.id)", "count")
      .leftJoin("inventario.headquartersRelation", "sede")
      .where("inventario.headquartersId = :id", { id: Number(id) })
      .groupBy("sede.name")
      .getRawMany();

    if (headquarters.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros." });
    }

    res.status(200).json(headquarters);

  } catch (error) {
    next(error);
  }
}

// busqueda global de inventario general
export async function searchInventoryGeneral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return res.status(400).json({
        message: "La consulta debe tener al menos 2 caracteres.",
      });
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const ItemsGeneral = await InventarioGeneral.createQueryBuilder("inventario")
      .leftJoinAndSelect("inventario.headquartersRelation", "sede")
      .leftJoinAndSelect('inventario.responsibleRelation', 'responsable')
      .leftJoinAndSelect('inventario.classificationRelation', 'clasificacion')
      .leftJoinAndSelect('inventario.assetRelation', 'activo')
      .leftJoinAndSelect('inventario.materialRelation', 'material')
      .leftJoinAndSelect('inventario.statusRelation', 'estado')
      .leftJoinAndSelect('inventario.areaTypeRelation', 'tipoArea')
      .leftJoinAndSelect('inventario.dependencyAreaRelation', 'areaDependencia')
      .leftJoinAndSelect('inventario.assetTypeRelation', 'tipoActivo')
      .leftJoinAndSelect('inventario.seguimiento', 'seguimiento')
      .leftJoinAndSelect('inventario.headquartersRelation', 'sedeInventario')
      .leftJoinAndSelect('sedeInventario.municipioRelation', 'municipio')
      .leftJoinAndSelect('municipio.departmentRelation', 'departamento')
      .leftJoinAndSelect('seguimiento.usuario', 'usuario')
      .where(
        `(
          LOWER(inventario.name) LIKE :searchTerm OR
          LOWER(inventario.serialNumber) LIKE :searchTerm OR
          LOWER(responsable.name) LIKE :searchTerm OR
          LOWER(inventario.inventoryNumber) LIKE :searchTerm
        )`, 
        { searchTerm }
      )
      .orderBy("inventario.name", "ASC")
      .limit(50)
      .getMany();

    if (ItemsGeneral.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros." });
    }

    const inventarioGeneralFormated = ItemsGeneral.map((i) => ({
      item: {
        id: i.id,
        name: i.name,
        brand: i.brand,
        model: i.model,
        serialNumber: i.serialNumber,
        location: i.location,
        quantity: i.quantity,
        otherDetails: i.otherDetails,
        acquisitionDate: i.acquisitionDate,
        purchaseValue: i.purchaseValue,
        warranty: i.warranty,
        warrantyPeriod: i.warrantyPeriod,
        inventoryNumber: i.inventoryNumber,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        classificationId: i.classificationId,
        headquarters: i.headquartersRelation?.name,
        responsable: i.responsibleRelation?.name,
        classification: i.classificationRelation?.name,
        asset: i.assetRelation?.name, 
        assetId: i.assetId,
        material: i.materialRelation?.name,
        materialId: i.materialId,
        statusId: i.statusId,
        status: i.statusRelation?.name,
        areaType: i.areaTypeRelation?.name,
        areaTypeId: i.areaTypeId,
        assetType: i.assetTypeRelation?.name,
        assetTypeId: i.assetTypeId,
        dependencyAreaId: i.dependencyAreaId,
        dependencyArea: i.dependencyAreaRelation?.name,
        seguimiento: i.seguimiento.map((s) => ({
          id: s.id,
          eventDate: s.fecha_evento,
          typeEvent: s.typeEvent,
          description: s.description,
          responsableName: s.usuario?.name,
          responsableLastName: s.usuario?.lastName,
        })),
      },
      departmentId: i.headquartersRelation?.municipioRelation?.departmentRelation?.id || 0,
      departmentRelationName: i.headquartersRelation?.municipioRelation?.departmentRelation?.name || "N/A",
      sedeName: i.headquartersRelation?.name || "N/A",
      sedeId: i.headquartersRelation.id || 0
    }));

    res.status(200).json(inventarioGeneralFormated);

  } catch (error) {
    next(error);
  }
}