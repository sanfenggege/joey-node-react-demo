'use strict';

const fs = require('fs');
const moment = require('moment');
const mkdirp = require('mkdirp').mkdirp;
const path = require('path');

const { Controller } = require('egg');

class UploadController extends Controller {
  async upload() {
    const { app, ctx } = this;
    console.log('upload files: ', ctx.request.files);
    const file = ctx.request.files[0];
    console.log('upload file: ', file);
    let uploadDir = '';

    try {
      const fileData = fs.readFileSync(file.filepath);
      console.log('upload fileData: ', fileData);

      const day = moment(new Date()).format('YYYYMMDD');
      console.log('upload day: ', day);

      const dir = path.join(app.config.uploadDir, day);
      console.log('upload dir: ', dir);

      await mkdirp(dir);

      const date = Date.now();
      uploadDir = path.join(dir, date + path.extname(file.filename));
      console.log('upload uploadDir: ', uploadDir);

      fs.writeFileSync(uploadDir, fileData);
      console.log('data: ', uploadDir.replace(/app/g, ''));
      ctx.body = {
        code: 200,
        msg: '上传成功',
        data: uploadDir.replace(/^app/g, ''),
      };
    } catch (error) {
      console.log('upload file failed: ', error);
      ctx.body = {
        code: 500,
        msg: '上传失败',
        data: null,
      };
      return null;
    } finally {
      ctx.cleanupRequestFiles();
    }
  }
}

module.exports = UploadController;
