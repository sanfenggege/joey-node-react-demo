'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async register(params) {
    const { app } = this;
    console.log('register params: ', params);
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', { ...params }, { id: params.id });
      console.log('editUserInfo result: ', result);
    } catch (error) {
      console.log('editUserInfo error: ', error);
      return null;
    }
  }

  async modifyPass(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', { ...params }, { id: params.id });
      console.log('modifyPass result: ', result);
      return result;
    } catch (error) {
      console.log('modifyPass error: ', error);
      return null;
    }
  }
}

module.exports = UserService;
