/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // config domainWhiteList: add localhost in domainWhiteList to fix csrf issue
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*', 'http://127.0.0.1:7001' ],
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1715312796745_9126';

  // add your middleware config here
  config.middleware = [];

  config.view = {
    mapping: { '.html': 'ejs' }, // 左边写成.html后缀，会自动渲染.html文件
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  exports.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      // password: '', // 初始化密码，没设置的可以不写
      // 数据库名
      database: 'test', // 我们新建的数据库名称
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  return {
    ...config,
    ...userConfig,
  };
};

