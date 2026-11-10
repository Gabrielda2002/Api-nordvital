import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export class TurnoDayService {
  static readonly timeZone = "America/Bogota";

  static getRange(now: Date = new Date()): { start: Date; end: Date } {
    const day = formatInTimeZone(now, this.timeZone, "yyyy-MM-dd");
    const start = fromZonedTime(`${day}T00:00:00`, this.timeZone);
    // Colombia no cambia de horario durante el año.
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { start, end };
  }
}
