import { Router } from "express";
import { getStatsTokens, login, logout, logoutAll, refreshToken } from "../controllers/auth.controller";
import { TokenService } from "../services/TokenService";

const router = Router();


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dniNumber
 *               - password
 *             properties:
 *               dniNumber:
 *                 type: string
 *                 description: Número de DNI del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 Municipio:
 *                   type: string
 *                   description: Municipio del usuario
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     dniNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     rol:
 *                       type: string
 *                     date:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     photo:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/login', login);

router.post('/refresh', refreshToken);

router.post('/logout', logout);

router.post('/logout-all', logoutAll);

router.get('/statistics/tokens', getStatsTokens)

export default router;