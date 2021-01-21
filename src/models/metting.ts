import Knex from "knex";

export class MettingModel {

    private tableName = 'metting_conf';
    private primaryKey = 'id';

    private perPage: number = 15;

    async items(db: Knex, where: any, table: any) {
        let _where = '';
        if (where != '') {
            _where = where;
        }
        let sql = `select count(*) as total from ${table} ${_where} `;
        return await db.raw(sql);
    }

    async list(db: Knex, data: any) {
        let table = 'metting_conf a';
        let _page = (data.page - 1);
        let page = (data.page == 0) ? (_page * 1) : (_page * this.perPage);
        let search = data.search;
        let date = data.date;
        let where = `where a.id is not null `;
        let order = `order by a.date desc, a.time_hour limit ${page}, ${this.perPage}`;
        if (search != '') {
            where += `and (a.metting_name like '%${search}%' or a.time_hour like '%${search}%') `;
        }
        if (date != null) {
            where += `and date (a.date) = '${date.slice(0, 10)}' `;
        }
        let sql = `select a.*, DATE_FORMAT(a.date, '%Y-%m-%d') as date, b.id as status_id,b.name as status_name,
            CONCAT(c.name, ' ',c.surname) as req_name, d.name as department_name from ${table} 
            inner join metting_conf_status b on a.status = b.id 
            left join hospdata.employee as c on a.uid = c.code 
            left join hospdata.lib_office as d on c.department = d.ref ${where} ${order}; `;
        let result = await db.raw(sql);
        let allitems = await this.items(db, where, table);
        let _total = Math.ceil(parseInt(allitems[0][0]['total']) / this.perPage)
        return [result[0], data.page, _total]
    }

    async add(db: Knex, data: any) {
        let row = data;
        return db(this.tableName)
            .insert(row);
    }

    async edit(db: Knex, data: any) {
        let id = data.id;
        let row = data;
        return db(this.tableName)
            .where(this.primaryKey, id)
            .update(row);
    }

    async delete(db: Knex, id: number) {
        return db(this.tableName)
            .where(this.primaryKey, id)
            .del();
    }

    async level(db: Knex, id: number) {
        let sql = `select * from metting_conf_level where uid = ${id}`;
        let result = await db.raw(sql);
        return [result[0][0]];
    }

    async status(db: Knex) {
        let sql = `select * from metting_conf_status order by seq`;
        let result = await db.raw(sql);
        return [result[0]];
    }

}