/*global module, require, cc, client */
/**
 * @desc log模块
 * @author Administrator
 */
var outModule = {};

//这个记得是全局定义是否在控制台显示log的标记
const SHOW_FLAG = true;

//显示日志
outModule.showLog = (obj) => {
    if (!SHOW_FLAG) {
        return;
    }
    if (cc.sys.isNative) {
        cc.log(obj);
    } else {
        console.log(obj);
    }
};

module.exports = outModule;

