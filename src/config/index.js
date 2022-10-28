/**
If we want Production and Development separation, we can add it with the env control.
const env = process.env.NODE_ENV || 'production'
import developmentConfig from './development';
import productionConfig from './production';
const config = {
    development: developmentConfig,
    production: productionConfig
};

export default config[env];
*/

import fs from 'fs';
import path from 'path';

const appRoot = path.join(process.cwd());

export default {
    jwt: {
		secret: 'A03IvqpuOYP7lmjQbqsQDpYPv955FdO1',
		expires: 36000
	},
    certificate: {
        key: fs.existsSync(`${appRoot}/certificates/localhost-key.pem`) ? fs.readFileSync(`${appRoot}/certificates/localhost-key.pem`) : false,
        cert: fs.existsSync(`${appRoot}/certificates/localhost.pem`) ? fs.readFileSync(`${appRoot}/certificates/localhost.pem`) : false
    },
    ports : {
        http: 8686,
        https: 9292
    },
    unauthorizedCommands : {
        status : true,
        command : ['rm', 'mkdir', 'cp', 'mv', 'ssh']
    },
    authorizedCommands : {
        status : false,
        command : ['ls']
    }
}