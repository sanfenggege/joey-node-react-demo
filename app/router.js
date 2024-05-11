/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/add', controller.home.add);
  router.get('/user', controller.home.user);
  router.post('/add_user', controller.home.addUser); // 该API并不符合Restful API 命名规则： https://restful.p2hp.com/home/resource-naming
  router.post('/edit_user', controller.home.editUser);
  router.post('/delete_user', controller.home.deleteUser);
};
