/*global module, require, cc, client */
//先加载这一个脚本，脚本中定义了全局的东西
require('Game');
var BaseUI = require('BaseUI');
cc.Class({
    extends: BaseUI,

    properties: {
        _loadFinish: undefined,
        //加载中句号显示的个数
        _strNum: undefined
    },

    onLoad() {
        this._super();
        //一般是走预加载
        cc.director.preloadScene('Game', function (error) {
            //加载2完成的函数
            if (error) {
                cc.log(error);
                return;
            }
            this._loadFinish = true;
            this.unschedule(this.updateLabel);
            //改变显示
            cc.find('label_bg/load_label', this.node).active = false;
            cc.find('label_bg/game_label', this.node).active = true;
        }.bind(this));
        //开始的时候显示加载中
        this.schedule(this.updateLabel, 0.4, cc.macro.REPEAT_FOREVER);
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'label_bg':
                if (this._loadFinish) {
                    cc.director.loadScene('Game');
                }
                break;
        }
    },

    /**
     * 数据初始化
     * @constructor
     */
    dataInit: function () {
        this._super();
        this._loadFinish = false;
        this._strNum = 0;
    },

    /**
     * UI初始化
     * @constructor
     */
    UIInit: function () {
        this._super();
        //初始化显示界面
        let loadLabelNode = cc.find('label_bg/load_label', this.node);
        let gameLabelNode = cc.find('label_bg/game_label', this.node);
        loadLabelNode.getComponent(cc.Label).string = Global.LanguageTool.getStr('load_load_str', '');
        gameLabelNode.getComponent(cc.Label).string = Global.LanguageObj.load_game_str;
        //初始化的时候先显示加载中
        loadLabelNode.active = true;
        gameLabelNode.active = false;
    },

    /**
     * UI隐藏
     * @constructor
     */
    hide: function () {
        this._super();
    },

    /**
     * UI销毁
     * @constructor
     */
    onDestroy: function () {
        this._super();
    },

    /**
     * 句号数量规律变化
     */
    updateLabel: function () {
        this._strNum++;
        if (this._strNum > 3) {
            this._strNum = 0;
        }
        let addStr;
        switch (this._strNum) {
            case 0:
                addStr = '';
                break;
            case 1:
                addStr = '.';
                break;
            case 2:
                addStr = '..';
                break;
            case 3:
                addStr = '...';
                break;
        }
        cc.find('label_bg/load_label', this.node).getComponent(cc.Label).string =
            Global.LanguageTool.getStr('load_load_str', addStr);
    }
});
