/*global module, require, cc, client */
var BaseUI = require('BaseUI');
cc.Class({
    extends: BaseUI,

    properties: {
        _loadFinish: undefined,
        //是否请求切换界面
        _askLoadFlag: undefined
    },

    onLoad() {
        this._super();
        //一般是走预加载
        cc.director.preloadScene('Game', function (error) {
            //加载2完成的函数
            if (error) {
                cc.log(error);
                return;
            }
            this._loadFinish = true;
            if (this._askLoadFlag) {
                cc.director.loadScene('Game');
            }
        }.bind(this));
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'button':
                if (this._loadFinish) {
                    cc.director.loadScene('Game');
                } else {
                    this._askLoadFlag = true;
                }
                break;
        }
    },

    /**
     * 数据初始化
     * @constructor
     */
    dataInit: function () {
        this._loadFinish = false;
        this._askLoadFlag = false;
    },

    /**
     * UI初始化
     * @constructor
     */
    UIInit: function () {
        var testButtonNode = cc.find('button', this.node);
        this.buttonTravelRegister(testButtonNode);
    }
});
