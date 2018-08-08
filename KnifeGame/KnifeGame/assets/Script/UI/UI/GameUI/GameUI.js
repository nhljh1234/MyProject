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

        //显示界面
        window.Global.GameSceneManager.addNode('Prefab/test', Global.GAME_SCENE_UI_NODE,
            'test', false, false, undefined, undefined);
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
        //先把这几个结点存在全局的对象中
        window.Global.GameScene = {};
        window.Global.GameScene.UINode = this.node.getChildByName('UINode');
        window.Global.GameScene.AlertNode = this.node.getChildByName('AlertNode');
        window.Global.GameScene.NetNode = this.node.getChildByName('NetNode');
    },

    /**
     * UI隐藏
     * @constructor
     */
    hide: function () {
        this._super();
    },

    /**
     * UI销毁
     * @constructor
     */
    onDestroy: function () {
        this._super();
    }
});
