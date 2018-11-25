(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/Base/LabelToolUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4da3ZD+ZpKErY53P4bDNdB', 'LabelToolUI', __filename);
// Script/UI/Base/LabelToolUI.js

"use strict";

/*global module, require, cc, client */
/**
 * @desc 多语言模块
 * @author Administrator
 */
cc.Class({
    extends: cc.Component,

    properties: {
        label_key: ''
    },

    onLoad: function onLoad() {
        //显示界面
        var labelComponent = this.node.getComponent(cc.Label);
        if (!labelComponent) {
            return;
        }
        labelComponent.string = g_LanguageTool.getLanguageStr(this.label_key) || "";
    }
});

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
        //# sourceMappingURL=LabelToolUI.js.map
        