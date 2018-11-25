(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/MessageUI/PersonListUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9871f/cH0BHDIqDAlU1nfbw', 'PersonListUI', __filename);
// Script/UI/MessageUI/PersonListUI.js

'use strict';

/*global module, require, cc, client */
/**
 * @desc
 * @author Administrator
 */
var BaseUI = require('BaseUI');
var ScrollViewTool = require('ScrollViewTool');
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: 'PersonListUI',
        _personListNodePool: null,
        _personListNScrollViewNode: null,
        _personListNScrollViewTmpNode: null
    },

    onLoad: function onLoad() {
        this._super();
    },


    /**
     * 实现方法，点击回调
     */
    onButtonClick: function onButtonClick(name, node, component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                return;
            case 'button':
                if (node._city_id) {
                    g_GameData.setData('show_city_id', node._city_id);
                    g_GameSceneManager.addNode('Prefab/Msg/CityListUI', g_GAME_SCENE_UI_NODE, 'CityListUI', false, undefined, undefined, 100);
                }
                break;
        }
    },

    /**
     * UI界面显示
     * @constructor
     */
    onUIInit: function onUIInit() {
        this._super();
        this._personListNodePool = new cc.NodePool();
        this._personListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._personListNScrollViewTmpNode = cc.find('view/content/item', this._personListNScrollViewNode);
    },

    /**
     * UI界面显示
     * @constructor
     */
    onShow: function onShow() {
        this._super();
        var gameData = g_GameGlobalManager.gameData;
        var cityId = g_GameData.getData('show_city_id');
        var personArr = gameData.getCityById(cityId)._personArr;
        //显示list
        ScrollViewTool.buildScrollView(this._personListNScrollViewNode, ScrollViewTool.SCROLL_TYPE_VERTICAL, this._personListNScrollViewTmpNode, function (childNode, data) {
            cc.find('button/personName', childNode).getComponent(cc.Label).string = data._name;
            childNode.getChildByName('button')._person_id = data._id;
        }.bind(this), personArr, this._personListNodePool);
        this.buttonTravelRegister(this.node);
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
        //# sourceMappingURL=PersonListUI.js.map
        