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
        Global.GameScene.UINode = this.node.getChildByName("UINode");
        Global.GameScene.AlertNode = this.node.getChildByName("AlertNode");
        Global.GameScene.NetNode = this.node.getChildByName("NetNode");
        //初始化
        this._super();
        //加入一个测试结点
        Global.GameSceneManager.addNode("Prefab/label", Global.GAME_SCENE_UI_NODE, "label", false, true, function () {
            Global.LogTool.showLog("success");
            var labelNode = Global.GameScene.UINode.getChildByName("label");
            labelNode.getComponent(cc.Label).string = Global.LanguageTool.getLanguageStr("load_game_str");
        }, function () {
            Global.LogTool.showLog("fail");
        });
    },

    //结点初始化
    UIInit: function () {

    },

    //数据初始化
    dataInit: function () {

    }
});
