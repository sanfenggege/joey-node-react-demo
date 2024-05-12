const { Controller } = require('egg');
const moment = require('moment');

class BillController extends Controller {
  async addBill() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, pay_type, date, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !pay_type || !date) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      console.log('decode: ', decode);
      const user_id = decode.id;
      const result = await ctx.service.bill.addBill({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '添加Bill成功',
        data: null,
      };
      console.log('add bill success: ', result);
    } catch (error) {
      console.log('add bill failed: ', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }

  async billList() {
    const { ctx, app } = this;
    // 当使用ctx.query时，在postman中测试，将参数添加在路径上，例如：api/bill/get_bill_list?date=2024-05&page=1
    // 或者在postman的params上添加也可行。
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    console.log('billList query: ', ctx.query);

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      console.log('decode: ', decode);
      const user_id = decode.id;
      const billList = await ctx.service.bill.billList(user_id);
      console.log('get billList data from database: ', billList);

      const filteredBillList = billList.filter(bill => {
        if (type_id !== 'all') {
          return moment(Number(bill.date)).format('YYYY-MM') === date && type_id === bill.type_id;
        }
        return moment(Number(bill.date)).format('YYYY-MM') === date;
      });

      console.log('after filter type_id and filteredBillList: ', filteredBillList);

      const listMap = filteredBillList.reduce((curr, bill) => {
        const date = moment(Number(bill.date)).format('YYYY-MM-DD');
        if (curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
          const index = curr.findIndex(item => item.date === date);
          curr[index].bills.push(bill);
        }

        if ((curr && curr.length && curr.findIndex(item => item.date === date) === -1) || (!curr.length)) {
          curr.push({
            date,
            bills: [ bill ],
          });
        }
        return curr;
      }, []).sort((left, right) => moment(right.date) - moment(left.date));

      console.log('slice according to the date and get listMap: ', listMap);

      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
      console.log('slice according to the page and page_size and get filterListMap: ', filterListMap);

      const billMonthList = billList.filter(item => moment(Number(item.date)).format('YYYY-MM') === date);
      console.log('billMonthList: ', billMonthList);

      const totalMonthExpense = billMonthList.reduce((curr, bill) => {
        if (bill.pay_type === 1) {
          curr += Number(bill.amount);
          return curr;
        }
        return curr;
      }, 0);

      const totalMonthIncome = billMonthList.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求bill list 成功',
        data: {
          totalMonthExpense,
          totalMonthIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },
      };
    } catch (error) {
      console.log('query bill list failed: ', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }

  async billDetail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    console.log('billList: ', ctx.query);
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '账单id不能为空',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      console.log('decode: ', decode);
      const user_id = decode.id;
      const billDetail = await ctx.service.bill.billDetail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '获取Bill detail成功',
        data: billDetail,
      };
      console.log('get bill detail success: ', billDetail);
    } catch (error) {
      console.log('get bill detail failed: ', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }

  async updateBill() {
    const { ctx, app } = this;
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      console.log('decode: ', decode);
      const user_id = decode.id;
      const billDetail = await ctx.service.bill.updateBillDetail({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '修改Bill detail成功',
        data: null,
      };
      console.log('update bill detail success: ', billDetail);
    } catch (error) {
      console.log('update bill detail failed: ', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }

  async deleteBill() {
    const { app, ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      console.log('decode: ', decode);
      const user_id = decode.id;
      const result = await ctx.service.bill.deleteBill(id, user_id);
      ctx.body = {
        code: 200,
        msg: '删除Bill成功',
        data: null,
      };
      console.log('update bill detail success: ', result);
    } catch (error) {
      console.log('delete bill failed: ', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }
}

module.exports = BillController;
