import { PhonesModel } from '../models/phones';
const phones = new PhonesModel();

async function routes(app: any, opts: any, next: any) {

	app.get('/', async (req: any, res: any) => {
		res.status(200).send({ status: 'ok', message: 'Phone api' });
	})
}
module.exports = routes;
