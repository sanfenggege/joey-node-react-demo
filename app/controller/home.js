const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '我是Joey Zhang!', // 将 title 传入 index.html
    });
  }

  async user() {
    const { ctx } = this;
    const result = await ctx.service.home.user();
    ctx.body = result;
  }

  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    // console.log('get name form request body: ', name);
    try {
      const result = await ctx.service.home.addUser(name);
      // console.log('add user data: ', result);
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null,
      };
    }
  }

  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    console.log('get data form request body: ', id, name);
    try {
      const result = await ctx.service.home.editUser(id, name);
      console.log('edit user data: ', result);
      ctx.body = {
        code: 200,
        msg: '编辑成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '编辑失败',
        data: null,
      };
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    console.log('get name form request body: ', id);
    try {
      const result = await ctx.service.home.deleteUser(id);
      console.log('delete user data: ', result);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null,
      };
    }
  }

  // this post add test failed in postman, can't get any data in body.
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
    ctx.body = { title };
  }
}

module.exports = HomeController;
