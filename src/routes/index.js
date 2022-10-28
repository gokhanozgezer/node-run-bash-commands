import { Router } from 'express';
import auth from '#middleware/auth';

const router = Router();

router.get('/', (req, res) => {
	res.send('Node run bash commands REST API v1');
});

import user from '#routes/user';
router.use('/user', user);

import command from '#routes/command';
router.use('/command', auth(), command);

export default router;