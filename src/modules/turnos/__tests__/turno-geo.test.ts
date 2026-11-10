import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TurnoGeoService } from "../services/turno-geo.service";
import { BadRequestError } from "@core/utils/custom-errors";

describe("TurnoGeoService", () => {
  // Coordenadas de prueba en Bogotá (ej. Sede Calle 100)
  const sedeBogota = { lat: 4.6865, lon: -74.0538 };

  describe("calculateDistanceInMeters", () => {
    it("debe retornar 0 metros si las coordenadas son idénticas", () => {
      const distance = TurnoGeoService.calculateDistanceInMeters(
        sedeBogota.lat,
        sedeBogota.lon,
        sedeBogota.lat,
        sedeBogota.lon
      );
      assert.equal(distance, 0);
    });

    it("debe calcular correctamente una distancia corta conocida (~100m)", () => {
      // Coordenada desplazada aprox 100m al norte (+0.0009 grados lat)
      const pacienteCerca = { lat: 4.6874, lon: -74.0538 };
      const distance = TurnoGeoService.calculateDistanceInMeters(
        pacienteCerca.lat,
        pacienteCerca.lon,
        sedeBogota.lat,
        sedeBogota.lon
      );

      assert.ok(distance > 90 && distance < 110, `Distancia esperada ~100m, obtenida: ${distance}`);
    });

    it("debe calcular distancias largas intermunicipales (Bogotá a Medellín ~240 km)", () => {
      const medellin = { lat: 6.2442, lon: -75.5812 };
      const distance = TurnoGeoService.calculateDistanceInMeters(
        sedeBogota.lat,
        sedeBogota.lon,
        medellin.lat,
        medellin.lon
      );

      // 230 km - 260 km
      assert.ok(
        distance > 230000 && distance < 260000,
        `Distancia Bogotá-Medellín esperada ~240km, obtenida: ${distance}`
      );
    });

    it("debe lanzar BadRequestError ante latitud inválida", () => {
      assert.throws(
        () => TurnoGeoService.calculateDistanceInMeters(95, -74, sedeBogota.lat, sedeBogota.lon),
        BadRequestError
      );
    });

    it("debe lanzar BadRequestError ante longitud inválida", () => {
      assert.throws(
        () => TurnoGeoService.calculateDistanceInMeters(4.5, -190, sedeBogota.lat, sedeBogota.lon),
        BadRequestError
      );
    });
  });

  describe("isWithinRadius", () => {
    it("debe retornar isWithinRadius=true si el paciente está a menos de 150m", () => {
      // Aprox 80 metros
      const pacienteEnSede = { lat: 4.6871, lon: -74.0538 };
      const result = TurnoGeoService.isWithinRadius(
        pacienteEnSede.lat,
        pacienteEnSede.lon,
        sedeBogota.lat,
        sedeBogota.lon,
        150
      );

      assert.equal(result.isWithinRadius, true);
      assert.ok(result.distanceInMeters <= 150);
      assert.equal(result.maxAllowedMeters, 150);
    });

    it("debe retornar isWithinRadius=false si el paciente supera los 150m de distancia", () => {
      // Aprox 350 metros (+0.003 grados)
      const pacienteLejos = { lat: 4.6896, lon: -74.0538 };
      const result = TurnoGeoService.isWithinRadius(
        pacienteLejos.lat,
        pacienteLejos.lon,
        sedeBogota.lat,
        sedeBogota.lon,
        150
      );

      assert.equal(result.isWithinRadius, false);
      assert.ok(result.distanceInMeters > 150);
    });

    it("debe respetar un radio personalizado pasado como argumento", () => {
      const pacienteA50m = { lat: 4.6869, lon: -74.0538 };
      const result = TurnoGeoService.isWithinRadius(
        pacienteA50m.lat,
        pacienteA50m.lon,
        sedeBogota.lat,
        sedeBogota.lon,
        30 // Umbral estricto de 30m
      );

      assert.equal(result.isWithinRadius, false);
      assert.equal(result.maxAllowedMeters, 30);
    });

    it("debe rechazar un radio menor o igual a cero", () => {
      assert.throws(
        () =>
          TurnoGeoService.isWithinRadius(
            sedeBogota.lat,
            sedeBogota.lon,
            sedeBogota.lat,
            sedeBogota.lon,
            0
          ),
        BadRequestError
      );
    });
  });
});

