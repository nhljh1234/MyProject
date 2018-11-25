"use strict";
cc._RF.push(module, 'f4da3ZD+ZpKErY53P4bDNdB', 'LabelToolUI');
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