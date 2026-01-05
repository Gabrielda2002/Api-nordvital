import { Router } from "express";
import { generateSSOToken, syncUserToMoodle, validateSSOToken } from "../controllers/moodle.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

/**
 * @swagger
 * /moodle/sso-token:
 *   get:
 *     summary: Generate SSO token for Moodle
 *     tags: [Moodle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSO token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 moodleUrl:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 */
router.get("/moodle/sso-token", authenticate, generateSSOToken);

/**
 * @swagger
 * /moodle/validate-sso:
 *   get:
 *     summary: Validate SSO token (called by Moodle)
 *     tags: [Moodle]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token validation result
 */
router.get("/moodle/validate-sso", validateSSOToken);

/**
 * @swagger
 * /moodle/sync-user:
 *   post:
 *     summary: Sync current user to Moodle
 *     tags: [Moodle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User synced successfully
 */
router.post("/moodle/sync-user", authenticate, syncUserToMoodle);

export default router;
