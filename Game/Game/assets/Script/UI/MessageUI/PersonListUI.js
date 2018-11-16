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

    onLoad() {
        this._personListNodePool = new cc.NodePool();
        this._personListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._personListNScrollViewTmpNode = cc.find('view/content/item', this._personListNScrollViewNode);
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
    onShow: function () {
        this._super();
        let gameData = g_GameGlobalManager.gameData;
        let cityId = g_GameData.getData('show_city_id');
        let personArr = gameData.getCityById(cityId)._personArr;
        //显示list
        ScrollViewTool.buildScrollView(this._personListNScrollViewNode, ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this._personListNScrollViewTmpNode, function (childNode, data) {
                cc.find('button/personName', childNode).getComponent(cc.Label).string = data._name;
                childNode.getChildByName('button')._person_id = data._id;
            }.bind(this), personArr, this._personListNodePool);
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
