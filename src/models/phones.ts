
import Knex from "knex";
import { compileFunction } from "vm";

export class PhonesModel {

    public perPage: number = 25;

    async items(db: Knex, where: any, table: any) {
        let _where = '';
        if (where != '') {
            _where = where;
        }
        let sql = `select count(*) as total from ${table} ${_where} `;
        return await db.raw(sql);
    }

    async find(db: Knex, data: any) {
        let table = 'phone_internal';
        let _page = (data.page - 1);
        let page = (data.page == 0) ? (_page * 1) : (_page * this.perPage);
        let search = data.search;
        let where = '';
        let order = `order by no limit ${page}, ${this.perPage}`;
        if (search != '') {
            where = `where (no like '${search}%' or room like '%${search}%' or build like '%${search}%')`;
            order = ``;
        }
        let sql = `select * from ${table} ${where} ${order};`;
        let result = await db.raw(sql);
        let allitems = await this.items(db, where, table);
        let _total = Math.ceil(parseInt(allitems[0][0]['total']) / this.perPage)
        return [result[0], data.page, _total]
    }

    async findTelemed(db: Knex, data: any) {
        let table = 'telemedicine.telephone';
        let _page = (data.page - 1);
        let page = (data.page == 0) ? (_page * 1) : (_page * this.perPage);
        let search = data.search;
        let where = `where isactive = '1'`;
        let order = `order by telephone limit ${page}, ${this.perPage}`;
        if (search != '') {
            let word = search.split(' ');
            if (word.length > 1) {
                where += `and (location like '%${word[0]}%' and hospname like '%${word[1]}%')`;
            } else {
                where += `and (telephone like '${search}%' or location like '%${search}%' or hospname like '%${search}%')`;
            }
            order = ``;
        }
        let sql = `select ref, hospcode, telephone as no, location as room, hospname as build, province from ${table} ${where} ${order};`;
        let result = await db.raw(sql);
        let allitems = await this.items(db, where, table);
        let _total = Math.ceil(parseInt(allitems[0][0]['total']) / this.perPage)
        return [result[0], data.page, _total];
    }

    async getDepartment(db: Knex) {
        let sql = `select ref as id, name from hospdata.lib_office where isactive = '1';`;
        return await db.raw(sql);
    }

    async getInfo(db: Knex, code: number) {
        let sql = `select code, no, id, name, surname from hospdata.employee where code = '${code}';`;
        return await db.raw(sql);

    }

    async getCheckNumber(db: Knex, no: number) {
        let sql = `select no from phone_internal where no = '${no}'`;
        return await db.raw(sql);
    }

    async getBuild(db: Knex) {
        let sql = `select build from phone_internal group by build order by build desc;`;
        return await db.raw(sql);
    }

    async getFloor(db: Knex) {
        let sql = `select floor from phone_internal group by floor order by floor asc;`;
        return await db.raw(sql);
    }

    async updatePhone(db: Knex, data: any) {
        let sql = `update phone_internal set 
        department = '${data.department}', room = '${data.room}',
        area = '${data.area}', floor = '${data.floor}',
        build = '${data.build}', phone_type = '${data.phone_type}',
        softphone = '${data.softphone}', isactive = '${data.isactive}',
        responder = '${data.responder}'
        where no = '${data.no}' limit 1`;
        return await db.raw(sql);
    }

    async getPhone(db: Knex, code: number) {
        let sql = `SELECT no, department, area, floor, build, qr_3cx FROM phone_internal where responder = '${code}';`;
        return await db.raw(sql);
    }

    async getResponder(db: Knex, data: any) {
        let sql = `select * from phone_internal where responder = '${data.responder}' `;
        return await db.raw(sql);
    }

    async getSoftphones(db: Knex, data: any) {
        let search = data.search;
        let where = '';
        if (data != '') {
            where = `and (no like '%${search}%' or area like '%${search}%' or room like '%${search}%')`;
        }
        let sql = `select no, area, room, responder, softphone, qr_3cx, isactive 
        from phone_internal where softphone = '1' ${where} order by isactive desc, no asc;`;
        return await db.raw(sql);
    }
}