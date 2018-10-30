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

    onLoad() {
        //显示界面
        let labelComponent = this.node.getComponent(cc.Label);
        if (!labelComponent) {
            return;
        }
        labelComponent.string = g_LanguageTool.getLanguageStr(this.label_key) || "";
    }
});
