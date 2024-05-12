const { Controller } = require('egg');

class TypeController extends Controller {
  async typeList() {
    const { ctx, app } = this;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      console.log('TypeList user_id: ', user_id);

      const list = await ctx.service.type.getTypeList(user_id);
      console.log('TypeList getTypeList: ', list);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          list,
        },
      };
    } catch (error) {
      console.log('get TypeList failed: ', error);
      ctx.body = {
        code: 500,
        msg: '请求失败',
        data: null,
      };
      return;
    }
  }

}

module.exports = TypeController;
