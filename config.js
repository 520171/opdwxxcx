/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://111.230.184.6';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 上传图片 上传视频
        //upFiles: `${host}/product/productUploadFile`,
      upFiles: `${host}:8000/users/uploadImage`,
    }
};

module.exports = config;
