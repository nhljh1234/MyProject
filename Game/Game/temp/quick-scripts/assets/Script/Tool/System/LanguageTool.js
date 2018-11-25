(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tool/System/LanguageTool.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd87bfGG6ZNItLmVXiC0U4ZQ', 'LanguageTool', __filename);
// Script/Tool/System/LanguageTool.js

'use strict';

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
  var key = arguments[0];
  //新建一个字符串
  var string = '' + g_LanguageObj[key];
  var i = void 0,
      len = void 0;
  for (i = 1, len = arguments.length; i < len; i++) {
    string = string.replace('%s', arguments[i]);
  }
  return string;
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
        //# sourceMappingURL=LanguageTool.js.map
        