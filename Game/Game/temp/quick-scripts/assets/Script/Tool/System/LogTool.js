(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tool/System/LogTool.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '39e20ng0o9EBav6kNHs8zF4', 'LogTool', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=LogTool.js.map
        