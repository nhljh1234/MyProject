"use strict";
cc._RF.push(module, '05e71rWI0tJ+r7h9ADvAeam', 'LoadingUI');
// Script/UI/LoadingUI/LoadingUI.js

"use strict";

/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var Game = require("Game");
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: "LoadingUI",
        _labelNode: null,
        _loadProgressNode: null
    },

    onLoad: function onLoad() {
        this._super();
    },


    /**
     * UI界面显示
     * @constructor
     */
    onUIInit: function onUIInit() {
        this._super();
        g_GameScene.UINode = this.node.getChildByName("UINode");
        g_GameScene.AlertNode = this.node.getChildByName("AlertNode");
        g_GameScene.NetNode = this.node.getChildByName("NetNode");
    },

    onShow: function onShow() {
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

    onButtonClick: function onButtonClick(name, node, component) {
        switch (name) {
            case 'label':
                cc.director.loadScene('GameScene');
                break;
        }
    },

    //预加载Game场景
    preLoadGameScene: function preLoadGameScene() {
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

cc._RF.pop();