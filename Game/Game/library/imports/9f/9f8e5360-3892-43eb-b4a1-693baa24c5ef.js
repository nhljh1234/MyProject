"use strict";
cc._RF.push(module, '9f8e5NgOJJD67ShaTuqJMXv', 'MainUI');
// Script/UI/MainUI/MainUI.js

'use strict';

/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */
var BaseUI = require('BaseUI');
var GameFactory = require("GameFactory");
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: 'MainUI'
    },

    onLoad: function onLoad() {
        this._super();
    },


    /**
     * 实现方法，点击回调
     */
    onButtonClick: function onButtonClick(name, node, component) {
        switch (name) {
            case 'MsgBtn':
                g_GameSceneManager.addNode('Prefab/Msg/ForceListUI', g_GAME_SCENE_UI_NODE, 'ForceListUI', false, undefined, undefined, 100);
                return;
        }
    },

    /**
     * UI控件初始化
     * @constructor
     */
    onUIInit: function onUIInit() {
        this._super();
    },

    /**
     * UI界面显示
     * @constructor
     */
    onShow: function onShow() {
        this._super();
        g_GameGlobalManager.init(this, new GameFactory.createOneGame(undefined, 7, 13));
        g_GameGlobalManager.start();
    },

    /**
     * UI隐藏
     * @constructor
     */
    hide: function hide(deleteFlag) {
        this._super(deleteFlag);
    },

    /**
     * UI销毁
     * @constructor
     */
    onDestroy: function onDestroy() {
        this._super();
    }
});

cc._RF.pop();