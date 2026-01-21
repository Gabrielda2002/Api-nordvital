import Redis from "ioredis";
import Logger from "../utils/logger-wrapper";
import { config } from "../config/environment.config";

class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      retryStrategy: (times: any) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on("connect", () => {
      Logger.info("Redis connected successfully");
    });

    this.client.on("error", (error: any) => {
      Logger.error("Redis connection error", error);
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  /**
   * Guardar token SSO con expiración automática
   */
  public async saveSSOToken(token: string, userId: number, expirySeconds: number): Promise<void> {
    const key = `sso:token:${token}`;
    await this.client.setex(key, expirySeconds, userId.toString());
    Logger.debug(`SSO token saved in Redis: ${key} (expires in ${expirySeconds}s)`);
  }

  /**
   * Obtener y eliminar token SSO (uso único)
   */
  public async consumeSSOToken(token: string): Promise<number | null> {
    const key = `sso:token:${token}`;
    
    // Obtener valor
    const userId = await this.client.get(key);
    
    if (!userId) {
      return null;
    }

    // Eliminar token (uso único)
    await this.client.del(key);
    
    Logger.debug(`SSO token consumed from Redis: ${key}`);
    return parseInt(userId, 10);
  }

  /**
   * Verificar si token existe sin consumirlo
   */
  public async checkSSOToken(token: string): Promise<number | null> {
    const key = `sso:token:${token}`;
    const userId = await this.client.get(key);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Cerrar conexión Redis
   */
  public async disconnect(): Promise<void> {
    await this.client.quit();
    Logger.info("Redis disconnected");
  }
}

export default RedisService.getInstance();
