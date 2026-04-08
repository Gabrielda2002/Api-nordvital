import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

interface FileAccessTokenPayload {
    fileId: number;
    userId: number;
    userRole: string;
    action: 'VIEW' | 'DOWNLOAD';
    clientIP: string;
    exp: number;
    iat: number;
    jti: string; // JWT ID único
}

interface TokenValidationResult {
    valid: boolean;
    payload?: FileAccessTokenPayload;
    error?: string;
}

export class FileTokenService {
    
    /**
     * Genera un token temporal para acceso a archivo
     */
    static generateFileAccessToken(
        fileId: number,
        userId: number,
        userRole: string,
        action: 'VIEW' | 'DOWNLOAD',
        clientIP: string,
        expirationMinutes: number = 15
    ): string {
        
        const now = Math.floor(Date.now() / 1000);
        const expiration = now + (expirationMinutes * 60);
        
        const payload: FileAccessTokenPayload = {
            fileId,
            userId,
            userRole,
            action,
            clientIP,
            iat: now,
            exp: expiration,
            jti: uuidv4()
        };

        return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
    }

    /**
     * Valida un token de acceso a archivo
     */
    static validateFileAccessToken(token: string, clientIP: string): TokenValidationResult {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as FileAccessTokenPayload;
            
            // Verificar que la IP coincida (opcional, para mayor seguridad)
            if (decoded.clientIP !== clientIP) {
                return {
                    valid: false,
                    error: 'IP address mismatch'
                };
            }

            return {
                valid: true,
                payload: decoded
            };
            
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    valid: false,
                    error: 'Token expired'
                };
            }
            
            if (error instanceof jwt.JsonWebTokenError) {
                return {
                    valid: false,
                    error: 'Invalid token'
                };
            }

            return {
                valid: false,
                error: 'Token validation failed'
            };
        }
    }

    /**
     * Extrae información del token sin validarlo (para logging)
     */
    static decodeTokenInfo(token: string): Partial<FileAccessTokenPayload> | null {
        try {
            return jwt.decode(token) as FileAccessTokenPayload;
        } catch {
            return null;
        }
    }
}
