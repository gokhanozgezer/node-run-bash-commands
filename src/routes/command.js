import { Router } from 'express';

//Controller
import commandCtrl from '#controllers/command';

const router = Router();

router.post('/run', commandCtrl.run);

export default router;