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
        _uiName: 'CityListUI',
        _cityListNodePool: null,
        _cityListNScrollViewNode: null,
        _cityListNScrollViewTmpNode: null
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
                if (node._city_id) {
                    g_GameData.setData('show_city_id', node._city_id);
                    g_GameSceneManager.addNode('Prefab/Msg/PersonListUI', g_GAME_SCENE_UI_NODE, 'PersonListUI',
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
        this._cityListNodePool = new cc.NodePool();
        this._cityListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._cityListNScrollViewTmpNode = cc.find('view/content/item', this._cityListNScrollViewNode);
    },

    /**
     * UI界面显示
     * @constructor
     */
    onShow: function () {
        this._super();
        let gameData = g_GameGlobalManager.gameData;
        let forceId = g_GameData.getData('show_force_id');
        let cityArr = gameData.getForceById(forceId)._cityArr;
        //显示list
        ScrollViewTool.buildScrollView(this._cityListNScrollViewNode, ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this._cityListNScrollViewTmpNode, function (childNode, data) {
                cc.find('button/cityName', childNode).getComponent(cc.Label).string = data._name;
                childNode.getChildByName('button')._city_id = data._id;
            }.bind(this), cityArr, this._cityListNodePool);
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
