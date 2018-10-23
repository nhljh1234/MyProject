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
        //全局初始化
        Game.init(function (num) {
            this._loadProgress.getComponent(cc.ProgressBar).progress = num;
        }.bind(this), function () {
            //this.node.getChildByName('label').active = true;
            this.preLoadGameScene();
        }.bind(this));
    },

    //结点初始化
    UIInit: function () {
        this._labelNode = this.node.getChildByName('label');
        this._labelNode.active = false;
        this._loadProgress = this.node.getChildByName('progressBar');
        this._loadProgress.getComponent(cc.ProgressBar).progress = 0;
    },

    //数据初始化
    dataInit: function () {

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
            this._loadProgress.active = false;
            this._labelNode.active = true;
        }.bind(this));
    },

    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'label':
                cc.director.loadScene('GameScene');
                break;
        }
    }
});
