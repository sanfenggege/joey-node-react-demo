const { Controller } = require('egg');

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号或密码不能为空！',
        data: null,
      };
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }

    const defualtAvater = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平',
      avatar: defualtAvater,
      ctime: Date.now(),
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
      return;
    }
  }

  async login() {
    // app 是全局上下文中的一个属性，config/plugin.js 中挂载的插件，可以通过 app.xxx 获取到，如 app.mysql、app.jwt 等。
    // config/config.default.js 中抛出的属性，可以通过 app.config.xxx 获取到，如 app.config.jwt.secret。
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    console.log('ctx.request.body: ', username, password);
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
      return;
    }

    if (userInfo && userInfo.password !== password) {
      ctx.body = {
        code: 500,
        msg: '账户密码错误',
        data: null,
      };
      return;
    }

    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000 + (24 * 60 * 60)),
      },
      app.config.jwt.secret
    );

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: { token },
    };
  }

  // 验证token
  async test() {
    const { ctx, app } = this;
    // 通过 token 解析，拿到 user_id
    // 在postman发起test测试时，通过在请求头 header 上添加authorization和其值（在login api中有返回），携带认证信息，让服务端可以通过 ctx.request.header.authorization 获取到 token
    const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为 token
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    if (decode) {
      ctx.body = {
        code: 200,
        message: '获取成功',
        data: {
          ...decode,
        },
      };
    } else {
      ctx.body = {
        code: 500,
        message: '获取失败',
        data: null,
      };
    }
  }

  async getUserInfo() {
    const { ctx, app } = this;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      console.log('user info data: ', userInfo);
      const defualtAvater = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
      ctx.body = {
        code: 200,
        msg: '获取用户信息成功',
        data: {
          id: userInfo.id,
          username: userInfo.username,
          signature: userInfo.signature || '',
          avatar: userInfo.avatar || defualtAvater,
        },
      };
    } catch (error) {
      console.log('get userinfo failed: ', error);
      ctx.body = {
        code: 500,
        msg: '请求失败',
        data: null,
      };
      return;
    }
  }

  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      const result = await ctx.service.user.editUserInfo({ ...userInfo, signature, avatar });
      console.log('edit user info: ', result); // undefined, because editUserInfo edit success not return the result
      ctx.body = {
        code: 200,
        msg: '修改信息成功',
        data: {
          id: user_id,
          username: userInfo.username,
          signature,
          avatar,
        },
      };
    } catch (error) {
      console.log('edit user info failed: ', error);
      ctx.body = {
        code: 500,
        msg: '修改信息失败',
        data: null,
      };
      return;
    }
  }

  async modifyPass() {
    const { ctx, app } = this;
    const { old_pass = '', new_pass = '', new_pass2 = '' } = ctx.request.body;
    console.log('modifyPass request old_pass,new_pass,new_pass2: ', old_pass, new_pass, new_pass2);

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      if (decode.username === 'admin') {
        ctx.body = {
          code: 400,
          msg: '管理员账户，不允许修改密码！',
          data: null,
        };
        return;
      }
      const userInfo = await ctx.service.user.getUserByName(decode.username);

      if (old_pass !== userInfo.password) {
        ctx.body = {
          code: 400,
          msg: '原密码错误',
          data: null,
        };
        return;
      }

      if (new_pass !== new_pass2) {
        ctx.body = {
          code: 400,
          msg: '新密码不一致',
          data: null,
        };
        return;
      }

      const result = await ctx.service.user.modifyPass({
        ...userInfo,
        password: new_pass,
      });

      ctx.body = {
        code: 200,
        msg: '修改密码成功',
        data: null,
      };
      console.log('modifyPass success result: ', result);
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
      return;
    }
  }
}

module.exports = UserController;
