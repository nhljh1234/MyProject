/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var Game = require("Game");
cc.Class({
    extends: BaseUI,

    properties: {

    },

    onLoad () {
        //全局初始化
        Game.init();
        //设置名字
        this._uiName = "GameUI";
        //先执行这个
        g_GameScene.UINode = this.node.getChildByName("UINode");
        g_GameScene.AlertNode = this.node.getChildByName("AlertNode");
        g_GameScene.NetNode = this.node.getChildByName("NetNode");
        //初始化
        this._super();
        //加入一个测试结点
        g_GameSceneManager.addNode("Prefab/label", g_GAME_SCENE_UI_NODE, "label", false, true, function () {
            g_LogTool.showLog("success");
            var labelNode = g_GameScene.UINode.getChildByName("label");
            labelNode.getComponent(cc.Label).string = g_LanguageTool.getLanguageStr("load_game_str");
        }, function () {
            g_LogTool.showLog("fail");
        });
    },

    //结点初始化
    UIInit: function () {

    },

    //数据初始化
    dataInit: function () {

    }
});
