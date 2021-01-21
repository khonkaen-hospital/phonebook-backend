require('dotenv').config();

import fastify from 'fastify';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';
import httpStatus from 'http-status-codes';

const app = fastify({ logger: true });

app.register(helmet);
app.register(cors);
app.register(require('fastify-rate-limit'), {
	max: +process.env.MAX_CONNECTION_PER_MINUTE || 1000,
	timeWindow: '1 minute'
});
app.register(require('./plugins/knex'), {
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		port: +process.env.DB_PORT,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	},
	pool: {
		min: 0,
		max: 7,
		afterCreate: (conn, done) => {
			conn.query('SET NAMES utf8', (err) => {
				done(err, conn);
			});
		}
	},
	debug: false,
	acquireConnectionTimeout: 5000
});

app.register(require('fastify-jwt'), { secret: process.env.SECRET_KEY });
app.decorate("authenticate", async (request: any, reply: any) => {
	let token = null;
	if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
		token = request.headers.authorization.split(' ')[1];
	}
	try {
		const decoded = await request.jwtVerify(token);
	} catch (err) {
		reply.status(httpStatus.UNAUTHORIZED).send({
			statusCode: httpStatus.UNAUTHORIZED,
			error: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
			message: `${httpStatus.UNAUTHORIZED} ${httpStatus.getStatusText(httpStatus.UNAUTHORIZED)}`
		})
	}
});

app.register(require('./controllers/default'));
app.register(require('./controllers/index'), { prefix: '/phone' });
app.register(require('./controllers/metting'), { prefix: '/metting' });

const start = async () => {
	const port = +process.env.PORT || 3000;
	try {
		// const address = await app.listen(port, '0.0.0.0');
		const address = await app.listen(port);
		console.log(`Server listening on ${address}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
