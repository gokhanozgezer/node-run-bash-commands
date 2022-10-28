import jwt from 'jsonwebtoken';
import appConfig from '#config';

/** Database */
import db from '#middleware/db';

export default () => {
    return async (req, res, next) => {
        if(req?.headers.authorization){
            try {
                const method = req.headers.authorization.split(' ')[0];
                if (method === 'Bearer') {
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded = jwt.verify(token, appConfig.jwt.secret);
                    if(decoded){
                        const user = db.data.users.find(user => user.id === decoded.user.id);
                        if(user){
                            req.user = user;
                            next();
                        }else{
                            return res.status(401).json({ err: true, errors: [{ msg: 'UserNotFound' }] });
                        }
                    }else{
                        return res.status(401).json({ err: true, errors: [{ msg: 'InvalidToken' }] });
                    }
                }else{
                    return res.status(401).json({ err: true, errors: [{ msg: 'notFoundBearer' }] }); 
                }
            } catch (error) {
                return res.status(401).send({ err: true, errors: [{ msg: 'authorizationFailed', error: error.message }] });
            }
        }else{
            return res.status(401).send({ err: true, errors: [{ msg: 'authorizationFailed' }] });
        }
    };
};