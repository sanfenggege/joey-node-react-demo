/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.get('/api/user/test', _jwt, controller.user.test);

  // user:
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);

  // upload file(avatar):
  router.post('/api/upload', controller.upload.upload);

  // bill:
  router.post('/api/bill/add_bill', _jwt, controller.bill.addBill);
  router.get('/api/bill/get_bill_list', _jwt, controller.bill.billList);
  router.get('/api/bill/get_bill_detail', _jwt, controller.bill.billDetail);
  router.post('/api/bill/update_bill_detail', _jwt, controller.bill.updateBill);
  router.post('/api/bill/delete_bill', _jwt, controller.bill.deleteBill);
};
