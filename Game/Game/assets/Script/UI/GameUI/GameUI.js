/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var GameFactory = require("GameFactory");
var GameSave = require("GameSave");
cc.Class({
    extends: BaseUI,

    properties: {

    },

    onLoad () {
        //设置名字
        this._uiName = "GameUI";
        //先执行这个
        g_GameScene.UINode = this.node.getChildByName("UINode");
        g_GameScene.AlertNode = this.node.getChildByName("AlertNode");
        g_GameScene.NetNode = this.node.getChildByName("NetNode");
        //初始化
        this._super();
    },

    onShow: function () {
        if (GameSave.setGame()) {
            g_GameGlobalManager.init(this, g_GameGlobalManager.gameData);
        } else {
            g_GameGlobalManager.init(this, new GameFactory.createOneGame(undefined, 7, 13));
        }
        g_GameGlobalManager.start();
    }
});
