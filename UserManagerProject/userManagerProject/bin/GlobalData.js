var outModule = {};
var local = {};

//超级管理员
outModule.USER_TYPE_SUPER = 1;
//客户管理员
outModule.USER_TYPE_CUSTOMER_MANAGER = 2;
//发货员
outModule.USER_TYPE_DELIVERY_PERSON = 3;
//设备安装人员
outModule.USER_TYPE_BUILDER = 4;
//普通用户
outModule.USER_TYPE_CUSTOMER = 5;

outModule.USER_SAVE_JSON_FILE_NAME = 'user';
outModule.DEVICE_SAVE_JSON_FILE_NAME = 'device';
outModule.SELLGOOD_SAVE_JSON_FILE_NAME = 'sellGood';


module.exports = outModule;