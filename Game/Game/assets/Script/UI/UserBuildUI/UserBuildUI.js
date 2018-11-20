/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */
var BaseUI = require('BaseUI');
var RandomNameTool = require('RandomNameTool');
var UserRoleFactory = require('UserRoleFactory');
cc.Class({
    extends: BaseUI,

    properties: {
        _uiName: 'UserBuildUI',
        _randomNameLabelNode: null,
        _randomSexToggleNode: null,
        _randomAttackLabelNode: null,
        _randomDefLabelNode: null,
        _randomCommandLabelNode: null,
        _randomIntelligenceLabelNode: null,
        _randomCharmLabelNode: null,
        _randomPoliticsLabelNode: null,
        _randomHpLabelNode: null,
        _randomName: null,
        _randomSex: null
    },

    onLoad() {
        this._super();
    },

    /**
     * UI界面显示
     * @constructor
     */
    onUIInit: function () {
        this._super();
        this._randomNameLabelNode = cc.find('Name/random_name', this._topNode);
        this._randomNameLabelNode.getComponent(cc.EditBox).placeholder = g_LanguageTool.getLanguageStr('random_name_notice');
        this._randomSexToggleNode = cc.find('Sex/toggleContainer', this._topNode);
        this._randomSexToggleNode.getComponent(cc.ToggleContainer).toggleItems.forEach(function (oneToggleComponent) {
            //监听事件
            oneToggleComponent.node.on('toggle', function (event) {
                if (event.target.name === 'toggle_man') {
                    this._randomSex = g_GlobalData.SEX_MAN;
                } else {
                    this._randomSex = g_GlobalData.SEX_WOMAN;
                }
                this.updateSexToggle(this._randomSex);
            }.bind(this));
        }.bind(this));
        //随机属性控件相关
        this._randomAttackLabelNode = cc.find('Attack/Attack', this._topNode);
        this._randomDefLabelNode = cc.find('Def/Def', this._topNode);
        this._randomCommandLabelNode = cc.find('Command/Command', this._topNode);
        this._randomIntelligenceLabelNode = cc.find('Intelligence/Intelligence', this._topNode);
        this._randomCharmLabelNode = cc.find('Charm/Charm', this._topNode);
        this._randomPoliticsLabelNode = cc.find('Politics/Politics', this._topNode);
        this._randomHpLabelNode = cc.find('Hp/Hp', this._topNode);
    },

    /**
     * 实现方法，点击回调
     */
    onButtonClick: function (name, node, component) {
        switch (name) {
            case 'random_btn':
                var lastName = this._randomName;
                //新建一个名字
                this._randomName = RandomNameTool.getRandomName(this._randomSex);
                this.updateRandomName(this._randomName);
                RandomNameTool.removeOneName(lastName);
                break;
            case 'random':
                this._randomUserRoleData = UserRoleFactory.createUserRole(undefined,
                    UserRoleFactory.getRandomUserRoleData(this._randomSex, this._randomName));
                this.updateRandomNum(this._randomUserRoleData);
                break;
            case 'sure':
                g_GameGlobalManager.userRole = this._randomUserRoleData;
                //加载MainUI界面
                g_GameSceneManager.addNode('Prefab/MainUI/MainUI', g_GAME_SCENE_UI_NODE, 'MainUI',
                    false, undefined, undefined, 100);
                //直接销毁了，这个界面没用了
                this.hide(true);
                break;
        }
    },

    /**
     * UI界面显示
     * @constructor
     */
    onShow: function () {
        this._super();
        //先初始化随机名字
        this._randomName = RandomNameTool.getRandomName(g_GlobalData.SEX_MAN);
        this.updateRandomName(this._randomName);
        //初始化性别
        //初始化默认都是男性
        this._randomSex = g_GlobalData.SEX_MAN;
        this.updateSexToggle(this._randomSex);
        //初始化一个数据
        this._randomUserRoleData = UserRoleFactory.createUserRole(undefined,
            UserRoleFactory.getRandomUserRoleData(this._randomSex, this._randomName));
        this.updateRandomNum(this._randomUserRoleData);
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
    },

    /**
     * 更新名字显示控件
     * @param randomName
     */
    updateRandomName: function (randomName) {
        this._randomNameLabelNode.getComponent(cc.EditBox).string = randomName;
    },


    /**
     * 显示随机数据
     * @param randomData
     */
    updateRandomNum: function (randomData) {
        this._randomAttackLabelNode.getComponent(cc.Label).string = randomData._attack;
        this._randomDefLabelNode.getComponent(cc.Label).string = randomData._def;
        this._randomCommandLabelNode.getComponent(cc.Label).string = randomData._command;
        this._randomIntelligenceLabelNode.getComponent(cc.Label).string = randomData._intelligence;
        this._randomCharmLabelNode.getComponent(cc.Label).string = randomData._charm;
        this._randomPoliticsLabelNode.getComponent(cc.Label).string = randomData._politics;
        this._randomHpLabelNode.getComponent(cc.Label).string = randomData._maxHp;
    },

    /**
     * 更新性别控件的显示
     * @param selectSex 选择的性别
     */
    updateSexToggle: function (selectSex) {
        selectSex = selectSex || g_GlobalData.SEX_MAN;
        //先更新选中情况
        this._randomSexToggleNode.getComponent(cc.ToggleContainer).toggleItems.forEach(function (oneToggleComponent) {
            if (oneToggleComponent.node.name === 'toggle_man') {
                oneToggleComponent.isChecked = selectSex === g_GlobalData.SEX_MAN;
            } else {
                oneToggleComponent.isChecked = selectSex !== g_GlobalData.SEX_MAN;
            }
        });
        //更新显示字符
        cc.find('Sex/random_sex', this._topNode).getComponent(cc.Label).string =
            selectSex === g_GlobalData.SEX_MAN ? g_LanguageTool.getLanguageStr('sex_man') : g_LanguageTool.getLanguageStr('sex_woman');
    }
});
