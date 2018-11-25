"use strict";
cc._RF.push(module, '39e20ng0o9EBav6kNHs8zF4', 'LogTool');
// Script/Tool/System/LogTool.js

"use strict";

/*global module, require, cc, client */
/**
 * @desc log模块
 * @author Administrator
 */
var outModule = {};

//这个记得是全局定义是否在控制台显示log的标记
var SHOW_FLAG = true;

//显示日志
/**
 * @param {String} string 
 */
outModule.showLog = function (string) {
    if (!SHOW_FLAG) {
        return;
    }
    if (cc.sys.isNative) {
        cc.log(string);
    } else {
        console.log(string);
    }
};

module.exports = outModule;

cc._RF.pop();