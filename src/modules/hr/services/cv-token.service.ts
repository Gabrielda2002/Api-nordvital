import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

interface CVAccessTokenPayload {
    cvFileName: string;        
    originalName: string;      // Nombre original del archivo (para descarga)
    action: 'VIEW' | 'DOWNLOAD';
    clientIP?: string;         
    exp: number;
    iat: number;
    jti: string;               // JWT ID único
    type: 'CV_PUBLIC_ACCESS';  // Tipo de token para diferenciarlo
}

interface CVTokenValidationResult {
    valid: boolean;
    payload?: CVAccessTokenPayload;
    error?: string;
}

/**
 * Servicio para manejo de tokens temporales de acceso público a CVs
 * 
 * Características principales:
 * - Tokens públicos 
 * - Expiración extendida (30 días por defecto)
 * - Seguimiento opcional de IP para auditoría
 * - Acciones VIEW y DOWNLOAD permitidas
 */
export class CVTokenService {
    
    /**
     * Genera un token temporal para acceso público a un CV
     * 
     * @param cvFileName - Nombre del archivo en el servidor (ej: "123456-cv.pdf")
     * @param originalName - Nombre original del archivo (ej: "Juan Perez CV.pdf")
     * @param action - Acción permitida: 'VIEW' para visualizar, 'DOWNLOAD' para descargar
     * @param clientIP - IP del cliente (opcional, para tracking)
     * @param expirationDays - Días hasta expiración (30 por defecto)
     * @returns Token JWT firmado
     */
    static generateCVAccessToken(
        cvFileName: string,
        originalName: string,
        action: 'VIEW' | 'DOWNLOAD' = 'VIEW',
        clientIP?: string,
        expirationDays: number = 30
    ): string {
        
        const now = Math.floor(Date.now() / 1000);
        const expiration = now + (expirationDays * 24 * 60 * 60); // Convertir días a segundos
        
        const payload: CVAccessTokenPayload = {
            cvFileName,
            originalName,
            action,
            clientIP,
            iat: now,
            exp: expiration,
            jti: uuidv4(),
            type: 'CV_PUBLIC_ACCESS'
        };

        return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
    }

    /**
     * @param token - Token JWT a validar
     * @param clientIP - IP del cliente actual (opcional, solo para tracking)
     * @returns Resultado de validación con payload si es válido
     */
    static validateCVAccessToken(token: string, clientIP?: string): CVTokenValidationResult {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as CVAccessTokenPayload;
            
            // Verificar que sea realmente un token de CV
            if (decoded.type !== 'CV_PUBLIC_ACCESS') {
                return {
                    valid: false,
                    error: 'Invalid token type'
                };
            }

            // Para CVs públicos, no validamos IP estrictamente, solo la registramos
            // Esto permite que el token funcione desde diferentes IPs (reenvío de emails, etc.)
            if (clientIP && decoded.clientIP && decoded.clientIP !== clientIP) {
                console.log(`CV Token IP changed: Original: ${decoded.clientIP}, Current: ${clientIP}, Token: ${decoded.jti}`);
            }

            return {
                valid: true,
                payload: decoded
            };
            
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    valid: false,
                    error: 'Token expired - CV access link has expired'
                };
            }
            
            if (error instanceof jwt.JsonWebTokenError) {
                return {
                    valid: false,
                    error: 'Invalid CV access token'
                };
            }

            return {
                valid: false,
                error: 'CV token validation failed'
            };
        }
    }

    /**
     * Extrae información del token sin validarlo (para logging y debugging)
     * 
     * @param token - Token JWT
     * @returns Payload decodificado o null si es inválido
     */
    static decodeCVTokenInfo(token: string): Partial<CVAccessTokenPayload> | null {
        try {
            const decoded = jwt.decode(token) as CVAccessTokenPayload;
            return decoded?.type === 'CV_PUBLIC_ACCESS' ? decoded : null;
        } catch {
            return null;
        }
    }

    /**
     * Genera tanto token de visualización como de descarga para un CV
     * @param cvFileName - Nombre del archivo en el servidor
     * @param originalName - Nombre original del archivo
     * @param clientIP - IP del cliente (opcional)
     * @param expirationDays - Días hasta expiración
     * @returns Objeto con ambos tokens y URLs
     */
    static generateCVTokens(
        cvFileName: string,
        originalName: string,
        clientIP?: string,
        expirationDays: number = 30
    ) {
        const viewToken = this.generateCVAccessToken(cvFileName, originalName, 'VIEW', clientIP, expirationDays);
        const downloadToken = this.generateCVAccessToken(cvFileName, originalName, 'DOWNLOAD', clientIP, expirationDays);
        
        return {
            viewToken,
            downloadToken,
            viewUrl: `/api/v1/public-cv/${viewToken}`,
            downloadUrl: `/api/v1/public-cv/${downloadToken}`,
            expiresInDays: expirationDays
        };
    }
}
