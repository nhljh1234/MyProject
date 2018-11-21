/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = _g_require("BaseUI");
var GameSave = _g_require("GameSave");
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: "GameUI"
    },

    onLoad() {
        //初始化
        this._super();
    },

    /**
     * UI界面显示
     * @constructor
     */
    onUIInit: function () {
        this._super();
        g_GameScene.UINode = this.node.getChildByName("UINode");
        g_GameScene.AlertNode = this.node.getChildByName("AlertNode");
        g_GameScene.NetNode = this.node.getChildByName("NetNode");
    },

    onShow: function () {
        if (GameSave.useGameSaveData()) {
            //g_GameGlobalManager.init(this, g_GameGlobalManager.gameData);
        } else {
            //g_GameGlobalManager.userRole = UserRoleFactory.createUserRole(undefined, undefined);
            //g_GameGlobalManager.init(this, new GameFactory.createOneGame(undefined, 7, 13));
            //先显示新建角色的名字
            g_GameSceneManager.addNode('Prefab/User/UserBuildUI', g_GAME_SCENE_UI_NODE, 'UserBuildUI',
                false, undefined, undefined, 100);
        }
        //g_GameGlobalManager.start();
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {

        }
    }
});
