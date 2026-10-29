import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ROLE_IDS } from '@core/constants/roles';
import { config } from '@core/config/environment.config';

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
     * Determina si un archivo es de tipo PDF por su mimeType o por su extensión de nombre.
     */
    static isPdfDocument(file: { mimeType?: string | null; name?: string | null }): boolean {
        const mime = file.mimeType?.toLowerCase() || '';
        const name = file.name?.toLowerCase() || '';
        return mime === 'application/pdf' || name.endsWith('.pdf');
    }

    /**
     * Valida si un rol tiene autorización para descargar un archivo.
     * Si el archivo es PDF, únicamente los roles ADMINISTRADOR (1) y CALIDAD (4) están permitidos.
     * Los archivos que no sean PDF pueden ser descargados por cualquier rol autenticado.
     */
    static canDownloadDocument(
        file: { mimeType?: string | null; name?: string | null },
        userRole: string | number | undefined | null
    ): boolean {
        if (!this.isPdfDocument(file)) {
            return true;
        }

        if (userRole === undefined || userRole === null) {
            return false;
        }

        const roleStr = String(userRole);
        return roleStr === ROLE_IDS.ADMINISTRADOR || roleStr === ROLE_IDS.CALIDAD;
    }
    
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

        return jwt.sign(payload, config.jwt.secret, { algorithm: 'HS256' });
    }

    /**
     * Valida un token de acceso a archivo
     */
    static validateFileAccessToken(token: string, clientIP: string): TokenValidationResult {
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as FileAccessTokenPayload;
            
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
