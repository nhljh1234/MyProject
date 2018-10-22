/*global module, require, cc, client */
/**
 * @desc 模块描述
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
        labelComponent.string = Global.LanguageTool.getStr(this.label_key) || "";
    }
});
