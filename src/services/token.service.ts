import jwk from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../entities/refresh-tokens";
import dotenv from "dotenv";

dotenv.config();

const JWK_secret = process.env.JWT_SECRET || "default_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key";

export class TokenService {

  static genereteAccessTocken(user: {
    id: number;
    dniNumber: number;
    rol: number;
  }) {
    return jwk.sign(
      {
        id: user.id,
        dniNumber: user.dniNumber,
        rol: user.rol,
      },
      JWK_secret,
      {
        expiresIn: "4h",
      }
    );
  }

  // generar refresh token
  static generateRefreshToken(userId: number): string {
    return crypto.randomBytes(64).toString("hex");
  }

  static async saveRefreshToken(
    userId: number,
    token: string
  ): Promise<RefreshToken> {


    await RefreshToken.createQueryBuilder()
      .update(RefreshToken)
      .set({ isRevoked: true })
      .where("userId = :userId AND isRevoked = false", { userId })
      .execute();

    const refreshToken = new RefreshToken();
    refreshToken.token = token;
    refreshToken.userId = userId;
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 30 días
    refreshToken.isRevoked = false;

    return await refreshToken.save();
  }

  static async verifyAccessToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await RefreshToken.createQueryBuilder("refreshToken")
      .leftJoinAndSelect("refreshToken.userRelation", "user")
      .where("refreshToken.token = :token", { token })
      .andWhere("refreshToken.isRevoked = false")
      .andWhere("refreshToken.expiresAt > :now", { now: new Date() })
      .getOne();
    return refreshToken;
  }

  static async clearExpiredTokens(): Promise<void> {
    await RefreshToken.createQueryBuilder()
      .delete()
      .where("expiresAt < :now OR isRevoked = true", { now: new Date() })
      .execute();
  }

  static async revokeAllUserTokens(userId: number): Promise<void> {
    await RefreshToken.createQueryBuilder()
      .update(RefreshToken)
      .set({ isRevoked: true })
      .where("userId = :userId", { userId })
      .execute();
  }

  static async getTokensStats(): Promise<{total: number, expired: number, active: number}> {
    const now = new Date();

    const [total, expired, active] = await Promise.all([
      RefreshToken.count(),
      RefreshToken.createQueryBuilder()
      .where("expires_at < :now OR is_revoked = true", { now })
      .getCount(),
      RefreshToken.createQueryBuilder()
      .where("expires_at > :now AND is_revoked = false", { now })
      .getCount()
    ]);

    return {
      total,
      expired,
      active
    };

  }
}
