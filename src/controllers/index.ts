import { PhonesModel } from '../models/phones';
const phones = new PhonesModel();

async function routes(app: any, opts: any, next: any) {

    app.post('/', async (req: any, res: any) => {
        const data = req.body.data;
        let numberType = data.numberType;
        let results = [];
        if (numberType == '2') {
            results = await phones.findTelemed(app.knex, data);
        } else if (numberType == '1') {
            results = await phones.find(app.knex, data);
        }
        res.status(200).send({ status: 'ok', result: results[0], page: results[1], totalpage: results[2] });
    });

    app.get('/department', async (req: any, res: any) => {
        let results = await phones.getDepartment(app.knex);
        res.status(200).send({ status: 'ok', result: results[0] });
    })

    app.post('/info', async (req: any, res: any) => {
        let data = req.body.data;
        let result = await phones.getInfo(app.knex, data);
        res.status(200).send({ status: 'ok', result: result[0] });
    })

    app.get('/cNumber/:no', async (req: any, res: any) => {
        let no = req.params.no;
        let result = await phones.getCheckNumber(app.knex, no);
        res.status(200).send({ status: 'ok', result: result[0] });
    })

    app.get('/build', async (req: any, res: any) => {
        let result = await phones.getBuild(app.knex);
        res.status(200).send({ status: 'ok', result: result[0] });
    })
}
module.exports = routes;