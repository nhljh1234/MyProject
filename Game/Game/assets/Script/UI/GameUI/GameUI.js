/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var GameFactory = require("GameFactory");
var GameSave = require("GameSave");
var UserRoleFactory = require("UserRoleFactory");
cc.Class({
    extends: BaseUI,

    properties: {},

    onLoad() {
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
        if (GameSave.getHaveSaveGame()) {
            g_GameGlobalManager.init(this, g_GameGlobalManager.gameData);
        } else {
            g_GameGlobalManager.userRole = UserRoleFactory.createUserRole(undefined, undefined);
            g_GameGlobalManager.init(this, new GameFactory.createOneGame(undefined, 7, 13));
        }
        g_GameGlobalManager.start();
        this.buttonTravelRegister(this.node);
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'MsgBtn':
                g_GameSceneManager.addNode('Prefab/Msg/ForceListUI', g_GAME_SCENE_UI_NODE, 'ForceListUI',
                    false, undefined, undefined, 100);
                return;
        }
    }
});
