/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
const host = 'https://www.opdgr.cn';

var config = {
  

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 上传图片 上传视频
        //upFiles: `${host}/product/productUploadFile`,
      upFiles: `${host}/users/uploadImage`,
    }
};
module.exports = config;
module.exports.host = host;
