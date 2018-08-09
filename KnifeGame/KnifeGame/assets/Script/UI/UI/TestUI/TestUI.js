/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */
var BaseUI = require('BaseUI');
cc.Class({
    extends: BaseUI,

    properties: {},

    onLoad() {
        this._super();

        let scrollViewNode = this.node.getChildByName('scrollview');
        let tmpNode = cc.find('view/content/item', scrollViewNode);

        Global.ScrollViewTool.buildScrollView(scrollViewNode,
            Global.ScrollViewTool.SCROLL_TYPE_VERTICAL, tmpNode, function (childNode, data) {
                childNode.getComponent(cc.Label).string = data;
            }.bind(this), [
                '111111111111111',
                '222222222222222',
                '333333333333333',
                '444444444444444',
                '555555555555555'
            ]);
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {

        }
    },

    /**
     * 数据初始化
     * @constructor
     */
    dataInit: function () {
        this._super();
    },

    /**
     * UI初始化
     * @constructor
     */
    UIInit: function () {
        this._super();
    },

    /**
     * UI隐藏
     * @constructor
     */
    hide: function (deleteFlag) {
        this._super(deleteFlag);
    },

    /**
     * UI销毁
     * @constructor
     */
    onDestroy: function () {
        this._super();
    }
});
