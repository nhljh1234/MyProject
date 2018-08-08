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
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'button':
                this.hide(false);
                break;
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
