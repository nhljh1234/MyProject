/*global module, require, cc, client */
/**
 * @desc 多语言模块
 * @author Administrator
 */
var outModule = {};

/**
 * 获取一个字符串
 * 会把%s给替换掉
 */
outModule.getLanguageStr = function () {
    let key = arguments[0];
    //新建一个字符串
    let string = '' + g_LanguageObj[key];
    let i, len;
    for (i = 1, len = arguments.length; i < len; i++) {
        string = string.replace('%s', arguments[i]);
    }
    return string;
};

module.exports = outModule;