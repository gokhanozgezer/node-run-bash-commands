import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
/** Import Config Settings */
import appConfig from '#config';

/** Logger */
import logger from '#utils/logger';

/** Database */
import db from '#middleware/db';

await db.read();
db.data = db.data || { users: [] };

const register = async (req, res) => {
    try {
        await check('username', 'User Name is required').not().isEmpty().run(req);
        await check('password', 'Please write a password of at least 6 characters.').isLength({ min: 6 }).run(req);

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { username, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const cryptedPassword = await bcrypt.hash(password, salt);

        // Username exists control
        const user = db.data.users.find(user => user.username === username);
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        db.data.users.push({
            id: uuidv4(),
            username,
            password: cryptedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await db.write();
        
        logger.user.info('User Register', { username });

        res.json({ status: true, msg: 'User registered successfully' });
    } catch (error) {
        res.status(401).json({ err: true, errors: [{ msg: error.message }] });
    }
}

const login = async (req, res) => {
    try {
        await check('username', 'User Name is required').not().isEmpty().run(req);
        await check('password', 'Please write a password of at least 6 characters.').isLength({ min: 6 }).run(req);

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { username, password } = req.body;

        // Username exists control
        const user = db.data.users.find(user => user.username === username);
        if (!user) {
            logger.user.error('User Login', { username });

            return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, appConfig.jwt.secret, {expiresIn : appConfig.jwt.expires});

        logger.user.info('User Login', { username });

        res.json({ status: true, token });
    } catch (error) {
        res.status(401).json({ err: true, errors: [{ msg: error.message }] });
    }
}

export default {
    register,
    login
}