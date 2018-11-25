(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/GameUI/GameUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3c3f3KkBRhKz4jdlaNGUxOR', 'GameUI', __filename);
// Script/UI/GameUI/GameUI.js

"use strict";

/*global module, require, cc, client */
/**
 * 本游戏的主场景，现在只有一个场景
 */
var BaseUI = require("BaseUI");
var GameSave = require("GameSave");
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: "GameUI"
    },

    onLoad: function onLoad() {
        //初始化
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
        if (GameSave.useGameSaveData()) {
            //g_GameGlobalManager.init(this, g_GameGlobalManager.gameData);
        } else {
            //g_GameGlobalManager.userRole = UserRoleFactory.createUserRole(undefined, undefined);
            //g_GameGlobalManager.init(this, new GameFactory.createOneGame(undefined, 7, 13));
            //先显示新建角色的名字
            g_GameSceneManager.addNode('Prefab/User/UserBuildUI', g_GAME_SCENE_UI_NODE, 'UserBuildUI', false, undefined, undefined, 100);
        }
        //g_GameGlobalManager.start();
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function onButtonClick(name, node, component) {
        switch (name) {}
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameUI.js.map
        