/*global module, require, cc, client */
/**
 * @desc log模块
 * @author Administrator
 */
var outModule = {};

const SHOW_FLAG = true;

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

