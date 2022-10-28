import { Router } from 'express';

//Controller
import userCtrl from '#controllers/user';

const router = Router();

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

export default router;