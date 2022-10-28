import express from "express";
import http from 'http';
import https from 'https';
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

/** Import Config Settings */
import appConfig from '#config';

/** Logger */
import logger from '#utils/logger';

/** Routes */
import apiRoutes from '#routes';

const PORT = process.env.PORT || appConfig.ports.http;
const securePORT = process.env.SECURE_PORT || appConfig.ports.https;

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limit
app.use(
	rateLimit({
		windowMs: 60 * 1000,
		max: 1000,
		delayMs: 0,
		handler: function (req, res) {
			res.status(429).json({status: false, msg: 'TOO_MANY_REQUESTS'})
		}
	})
)

app.use('/', apiRoutes);

app.use((req, res, next) => {
	res.status(404).json({status: false, msg: 'Not Found'});
    next(false);
})

const server = http.createServer(app).listen(PORT, () => {
    const { address, port } = server.address();
	console.log(`Host: http://${address}:${port}/`)

	logger.server.info('Http server started');
})

if(appConfig.certificate.key && appConfig.certificate.cert){
    // I added a certificate for the localhost to enable HTTPS
    const secureServer = https.createServer({key: appConfig.certificate.key, cert: appConfig.certificate.cert}, app).listen(securePORT, () => {
        const { address, port } = secureServer.address();
        console.log(`Secure Host: https://${address}:${port}/`)

        logger.server.info('Https server started');
    })
}