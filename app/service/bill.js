'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async addBill(params) {
    console.log('BillService addBill params: ', params);
    const { app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      console.log('BillService addBill result: ', result);
      return result;
    } catch (error) {
      console.log('BillService addBill error: ', error);
      return null;
    }
  }

  async billList(id) {
    console.log('BillService billList user_id: ', id);
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      console.log('BillService billList result: ', result);
      return result;
    } catch (error) {
      console.log('BillService billList error: ', error);
      return null;
    }
  }

  async billDetail(id, user_id) {
    console.log('BillService billDetail id,user_id: ', id, user_id);
    const { app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id });
      console.log('BillService billDetail result: ', result);
      return result;
    } catch (error) {
      console.log('BillService billDetail error: ', error);
      return null;
    }
  }

  async updateBillDetail(params) {
    console.log('BillService updateBillDetail params: ', params);
    const { app } = this;
    try {
      const result = await app.mysql.update('bill',
        {
          ...params,
        },
        {
          id: params.id,
          user_id: params.user_id,
        });
      return result;
    } catch (error) {
      console.log('BillService updateBillDetail error: ', error);
      return null;
    }
  }

  async deleteBill(id, user_id) {
    console.log('BillService deleteBill id,user_id: ', id, user_id);
    const { app } = this;
    try {
      const result = await app.mysql.delete('bill', { id, user_id });
      console.log('BillService deleteBill result: ', result);
      return result;
    } catch (error) {
      console.log('BillService deleteBill error: ', error);
      return null;
    }
  }
}

module.exports = BillService;
