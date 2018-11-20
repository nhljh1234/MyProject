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
        _uiName: 'ForceListUI',
        _forceListNodePool: null,
        _forceListNScrollViewNode: null,
        _forceListNScrollViewTmpNode: null
    },

    onLoad() {
        this._super();
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                return;
            case 'button':
                if (node._force_id) {
                    g_GameData.setData('show_force_id', node._force_id);
                    g_GameSceneManager.addNode('Prefab/Msg/CityListUI', g_GAME_SCENE_UI_NODE, 'CityListUI',
                        false, undefined, undefined, 100);
                }
                break;
        }
    },

    /**
     * UI界面显示
     * @constructor
     */
    onUIInit: function () {
        this._super();
        this._forceListNodePool = new cc.NodePool();
        this._forceListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._forceListNScrollViewTmpNode = cc.find('view/content/item', this._forceListNScrollViewNode);
    },

    /**
     * UI界面显示
     * @constructor
     */
    onShow: function () {
        this._super();
        let gameData = g_GameGlobalManager.gameData;
        let forceDataArr = gameData._allForceArr;
        //显示list
        ScrollViewTool.buildScrollView(this._forceListNScrollViewNode, ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this._forceListNScrollViewTmpNode, function (childNode, data) {
                cc.find('button/forceName', childNode).getComponent(cc.Label).string = data._name;
                childNode.getChildByName('button')._force_id = data._id;
            }.bind(this), forceDataArr, this._forceListNodePool);
        this.buttonTravelRegister(this.node);
    },

    /**
     * UI隐藏
     * @constructor
     */
    hide: function (deleteFlag) {
        this._super(deleteFlag);
    },

    /**
     * UI销毁
     * @constructor
     */
    onDestroy: function () {
        this._super();
    }
});
