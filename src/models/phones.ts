
import Knex from "knex";

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
        let table = 'phone_internal a';
        let _page = (data.page - 1);
        let page = (data.page == 0) ? (_page * 1) : (_page * this.perPage);
        let search = data.search;
        let where = `where a.isactive = '1'`;
        let order = `order by no limit ${page}, ${this.perPage}`;
        if (search != '') {
            where = ` and (a.no like '${search}%' or a.room like '%${search}%' or a.build like '%${search}%' or a.area like '%${search}%')`;
            order = ``;
        }
        let sql = `select * from ${table} left join lib_office b on a.department = b.ref ${where} ${order};`;
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
        let sqle = `update employee set 
            tel_mobile = '${data.mobilephone}',
            email = '${data.email}' 
            where code = '${data.uid}' limit 1;`;
        await await db.raw(sqle);
        let sql = `update phone_internal set 
            department = '${data.department}',
            room = '${data.room}',
            area = '${data.area}',
            floor = '${data.floor}',
            build = '${data.build}',
            phone_type = '${data.phone_type}',
            softphone = '${data.softphone}',
            isactive = '${data.isactive}',
            responder = '${data.responder}'
            where uid = '${data.uid}' limit 1`;
        return await db.raw(sql);
    }

    async getPhone(db: Knex, code: number) {
        let sql = `SELECT no, department, area, floor, build, qr_3cx, room, isactive, uid FROM phone_internal where responder = '${code}';`;
        return await db.raw(sql);
    }

    async getResponder(db: Knex, data: any) {
        let sql = `select * from phone_internal where responder = '${data.responder}' `;
        return await db.raw(sql);
    }

    async getSoftphones(db: Knex, data: any) {
        let search = data.search;
        let uid = data.uid;
        let where = '';
        if (data.uid != undefined) {
            where = `and a.uid = '${uid}'`;
        }
        if (data.search != undefined) {
            where = `and (a.no like '%${search.trim()}%' or a.area like '%${search.trim()}%' or a.room like '%${search.trim()}%')`;
        }
        let sql = `select a.no, a.department, a.area, a.room, a.floor, a.build, a.responder, b.email, b.tel_mobile, a.softphone, a.qr_3cx, a.uid,
        a.isactive from phone_internal a left join hospdata.employee b on a.uid = b.code
        where a.softphone = '1' ${where} order by a.isactive desc, a.no asc;`;
        console.log(sql);
        return await db.raw(sql);
    }
}