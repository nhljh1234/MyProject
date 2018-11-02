/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var Game = require("Game");
cc.Class({
    extends: BaseUI,

    properties: {
        _labelNode: null,
        _loadProgressNode: null
    },

    onLoad() {
        //设置名字
        this._uiName = "LoadingUI";
        this._super();
    },

    onShow: function () {
        this._labelNode = this.node.getChildByName('label');
        this._labelNode.active = false;
        this._loadProgressNode = this.node.getChildByName('progressBar');
        this._loadProgressNode.getComponent(cc.ProgressBar).progress = 0;
        //全局初始化
        Game.init(function (num) {
            this._loadProgressNode.getComponent(cc.ProgressBar).progress = num;
        }.bind(this), function () {
            //this.node.getChildByName('label').active = true;
            this.preLoadGameScene();
        }.bind(this));
    },

    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'label':
                cc.director.loadScene('GameScene');
                break;
        }
    },

    //预加载Game场景
    preLoadGameScene: function () {
        cc.director.preloadScene('GameScene', function (error) {
            //onLoaded函数
            if (error) {
                g_LogTool.showLog('preload Game Scene error, error is : ' + error);
                return;
            }
            //显示文本，用户点击就可以切换
            this._loadProgressNode.active = false;
            this._labelNode.active = true;
        }.bind(this));
    }
});
