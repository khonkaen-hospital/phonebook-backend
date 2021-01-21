import httpStatus from 'http-status-codes';
import { MettingModel } from '../models/metting';

const metting = new MettingModel();

async function routes(app: any, opts: any, next: any) {

    const options = {
        preHandler: [app.authenticate]
    }

    app.post('/list', async (req: any, res: any) => {
        let data = req.body.data;
        try {
            let result = await metting.list(app.knex, data);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, rows: result[0], page: result[1], totalpage: result[2] });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error });
        }
    })

    app.post('/', async (req: any, res: any) => {
        const data = req.body.data;
        try {
            let result = await metting.add(app.knex, data);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, result: 'ok' });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, result: 'error', error: error });
        }
    })

    app.patch('/', async (req: any, res: any) => {
        const data = req.body.data;
        try {
            let result = await metting.edit(app.knex, data);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, result: 'ok' });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, result: 'error', error: error });
        }
        let results = await metting.edit(app.knex, data);
        res.status(200).send({ status: 'ok', result: results });
    })

    app.delete('/:id', async (req: any, res: any) => {
        const id = req.params.id;
        try {
            let result = await metting.delete(app.knex, id);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, result: 'ok' });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, result: 'error', error: error });
        }
    })

    app.get('/level/:id', async (req: any, res: any) => {
        const id = req.params.id;
        try {
            let result = await metting.level(app.knex, id);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, rows: result[0] });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, result: 'error', error: error });
        }
    })

    app.get('/status', async (req: any, res: any) => {
        try {
            let result = await metting.status(app.knex);
            res.status(httpStatus.OK).send({ status: httpStatus.OK, rows: result[0] });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: httpStatus.INTERNAL_SERVER_ERROR, result: 'error', error: error });
        }
    })
}
module.exports = routes;