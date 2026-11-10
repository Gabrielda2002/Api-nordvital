import { BadRequestError, ForbiddenError } from "@core/utils/custom-errors";

export interface GeoValidationResult {
  isWithinRadius: boolean;
  distanceInMeters: number;
  maxAllowedMeters: number;
}

export class TurnoGeoService {
  private static readonly EARTH_RADIUS_METERS = 6371000;

  static validateRequest(
    input: { userLatitude?: unknown; userLongitude?: unknown; skipGeolocation?: unknown },
    target: { latitude: number; longitude: number; geoRadiusMeters: number },
    isDevelopment: boolean
  ): void {
    if (input.skipGeolocation !== undefined && typeof input.skipGeolocation !== "boolean") {
      throw new BadRequestError("skipGeolocation debe ser un valor booleano");
    }
    if (input.skipGeolocation === true) {
      if (!isDevelopment) throw new ForbiddenError("Solo se puede omitir la ubicación en desarrollo");
      return;
    }
    const coords = [input.userLatitude, input.userLongitude];
    if (coords.some((value) => value === undefined || value === null || String(value).trim() === "")) {
      throw new BadRequestError("Las coordenadas de geolocalización son requeridas");
    }
    if (coords.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
      throw new BadRequestError("Las coordenadas deben ser números válidos");
    }
    const result = this.isWithinRadius(
      Number(input.userLatitude), Number(input.userLongitude), target.latitude, target.longitude, target.geoRadiusMeters
    );
    if (!result.isWithinRadius) {
      throw new ForbiddenError(`Debes encontrarte en la sede para solicitar un turno. Distancia: ${result.distanceInMeters}m (máximo: ${result.maxAllowedMeters}m)`);
    }
  }

  /**
   * Calcula la distancia geodésica en metros entre dos pares de coordenadas
   * utilizando la fórmula de Haversine.
   */
  static calculateDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    this.validateCoordinate(lat1, lon1, "origen (usuario)");
    this.validateCoordinate(lat2, lon2, "destino (sede)");

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const radLat1 = this.toRadians(lat1);
    const radLat2 = this.toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(this.EARTH_RADIUS_METERS * c * 100) / 100;
  }

  /**
   * Valida si la ubicación del usuario se encuentra dentro del radio permitido
   * respecto a la sede.
   */
  static isWithinRadius(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    radiusMeters: number = 150
  ): GeoValidationResult {
    if (radiusMeters <= 0) {
      throw new BadRequestError("El radio de tolerancia debe ser mayor a 0 metros");
    }

    const distanceInMeters = this.calculateDistanceInMeters(
      userLat,
      userLon,
      targetLat,
      targetLon
    );

    return {
      isWithinRadius: distanceInMeters <= radiusMeters,
      distanceInMeters,
      maxAllowedMeters: radiusMeters,
    };
  }

  private static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private static validateCoordinate(lat: number, lon: number, label: string): void {
    if (typeof lat !== "number" || isNaN(lat) || lat < -90 || lat > 90) {
      throw new BadRequestError(
        `Latitud inválida para ${label}. Debe ser un número entre -90 y 90`
      );
    }
    if (typeof lon !== "number" || isNaN(lon) || lon < -180 || lon > 180) {
      throw new BadRequestError(
        `Longitud inválida para ${label}. Debe ser un número entre -180 y 180`
      );
    }
  }
}
