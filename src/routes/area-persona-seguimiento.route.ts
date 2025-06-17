import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/authorize-roles';
import { getAllAreaPerson, getAreaPersonByName } from '../controllers/area-persona-seguimiento.controller';

const router = Router();

router.get('/area-persona/demanda-inducida', authenticate, authorizeRoles(['1']), getAllAreaPerson);

router.post('/area-persona/demanda-inducida/buscar', authenticate, authorizeRoles(['1']), getAreaPersonByName);

export default router;