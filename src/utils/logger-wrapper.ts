import logger from "./logger";

export class Logger {
  static info(message: string, meta?: any): void {
    if (meta) {
      logger.info(message, meta);
    } else {
      logger.info(message);
    }
  }

  static error(message: string, error?: Error | any, meta?: any): void {
    if (error instanceof Error) {
      logger.error(message, {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...meta,
      });
    } else if (error) {
      logger.error(message, { error, ...meta });
    } else {
      logger.error(message, meta);
    }
  }

  static warn(message: string, meta?: any): void {
    if (meta) {
      logger.warn(message, meta);
    } else {
      logger.warn(message);
    }
  }

  static debug(message: string, meta?: any): void {
    if (meta) {
      logger.debug(message, meta);
    } else {
      logger.debug(message);
    }
  }

  static http(message: string, meta?: any): void {
    if (meta) {
      logger.http(message, meta);
    } else {
      logger.http(message);
    }
  }
}

export default Logger;
