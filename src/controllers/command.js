import _ from 'lodash';
import shell from 'shelljs';
import { check, validationResult } from 'express-validator';
/** Import Config Settings */
import appConfig from '#config';

/** Logger */
import logger from '#utils/logger';

const run = async (req, res) => {
    await check('command', 'Command(s) is required').not().isEmpty().run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ err: true, errors: result.array() });
    }

    const { command } = req.body;

    let commandList = _.split(_.toLower(command), ' ');
    
    /** You can define unauthorized commands in the config section */
    if(appConfig.unauthorizedCommands.status && _.size(appConfig.unauthorizedCommands.command) > 0){
        let searchUnauthorizedCommand = _.find(commandList, (command) => {
            return _.includes(appConfig.unauthorizedCommands.command, _.trim(command));
        });

        if (searchUnauthorizedCommand) {
            logger.command.error('Command Run', { command, userId : req.user.id, userName: req.user.username });

            return res.status(400).json({ err: true, errors: [{ msg: 'UnauthorizedCommand' }] });
        }
    }

    if(appConfig.authorizedCommands.status && _.size(appConfig.authorizedCommands.command) > 0){
        let searchAuthorizedCommand = _.find(commandList, (command) => {
            return _.includes(appConfig.authorizedCommands.command, _.trim(command));
        });

        if (!searchAuthorizedCommand) {
            logger.command.error('Command Run', { command, userId : req.user.id, userName: req.user.username });

            return res.status(400).json({ err: true, errors: [{ msg: 'UnauthorizedCommand' }] });
        }
    }

    const start = Date.now();

    const execResult = shell.exec(command, { silent: true });

    const stop = Date.now();

    const executionTime = (stop - start) / 1000;

    if (execResult.code !== 0) {
        return res.status(400).json({ err: true, errors: [{ msg: 'execCommandFailed', error: execResult.stderr }] });
    }

    logger.command.info('Command Run', { command, userId : req.user.id, userName: req.user.username, runTime: executionTime });

    res.json({ status: true, msg: 'Command executed successfully', data: execResult.stdout });
};

export default {
    run
}