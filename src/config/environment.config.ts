import dotenv from "dotenv";

dotenv.config();



class EnvironmentConfig {
  private validateRequired(key: string, value: string | undefined): string {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  public readonly database = {
    host: this.validateRequired("DB_HOST", process.env.DB_HOST),
    port: parseInt(process.env.DB_PORT || "3306"),
    username: this.validateRequired("DB_USERNAME", process.env.DB_USERNAME),
    password: this.validateRequired("DB_PASSWORD", process.env.DB_PASSWORD),
    database: this.validateRequired("DB_DATABASE", process.env.DB_DATABASE),
    timezone: process.env.DB_TIMEZONE || "-05:00",
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || "20000"),
  };

  public readonly jwt = {
    secret: this.validateRequired("JWT_SECRET", process.env.JWT_SECRET),
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh",
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "4h",
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  public readonly server = {
    port: parseInt(process.env.PORT || "3600"),
    apiPrefix: process.env.API_PREFIX || "/api/v1",
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
  };

  public readonly push = {
    vapidPublicKey: this.validateRequired(
      "VAPID_PUBLIC_KEY",
      process.env.VAPID_PUBLIC_KEY
    ),
    vapidPrivateKey: this.validateRequired(
      "VAPID_PRIVATE_KEY",
      process.env.VAPID_PRIVATE_KEY
    ),
  };

  public readonly logger = {
    level: process.env.LOG_LEVEL || "debug",
  };

  public readonly cors = {
    allowedOrigins: [
      "http://localhost:5173",
      "http://localhost:3600",
      "https://test.nordvitalips.com",
      "https://nordvitalips.com",
      "https://www.nordvitalips.com",
      "https://www.app.nordvitalips.com",
      "https://app.nordvitalips.com",
      "http://localhost:4321",
      "http://localhost:8080", // Moodle dev
    ],
  };

  public readonly moodle = {
    url: process.env.MOODLE_URL || "http://localhost:8080",
    apiToken: this.validateRequired("MOODLE_API_TOKEN", process.env.MOODLE_API_TOKEN),
    ssoSecret: this.validateRequired("MOODLE_SSO_SECRET", process.env.MOODLE_SSO_SECRET),
    ssoTokenExpiry: 300, // 5 minutes in seconds
  };

  public readonly redis = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0"),
  };
}

export const config = new EnvironmentConfig();
