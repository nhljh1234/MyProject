import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Person, createRandomPerson } from "../../Data/PersonFactory";
import { getRandomUserRoleData, UserRole } from "../../Data/UserRoleFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class UserBuildUI extends BaseUI {

    uiName: string = 'UserBuildUI';

    _randomNameLabelNode: cc.Node;
    _randomSexToggleNode: cc.Node;
    _randomAttackLabelNode: cc.Node;
    _randomDefLabelNode: cc.Node;
    _randomCommandLabelNode: cc.Node;
    _randomIntelligenceLabelNode: cc.Node;
    _randomCharmLabelNode: cc.Node;
    _randomPoliticsLabelNode: cc.Node;
    _randomName: string;
    _randomSex: number;
    _randomUserRoleData: UserRole;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._randomNameLabelNode = cc.find('Name/random_name', this._topNode);
        this._randomNameLabelNode.getComponent(cc.EditBox).placeholder = MyGame.LanguageTool.getLanguageStr('random_name_notice');
        this._randomSexToggleNode = cc.find('Sex/toggleContainer', this._topNode);
        this._randomSexToggleNode.getComponent(cc.ToggleContainer).toggleItems.forEach(function (oneToggleComponent) {
            //监听事件
            oneToggleComponent.node.on('toggle', function (event) {
                if (event.target.name === 'toggle_man') {
                    this._randomSex = MyGame.SEX_MAN;
                } else {
                    this._randomSex = MyGame.SEX_WOMAN;
                }
                this.updateSexToggle(this._randomSex);
                //更新随机数据
                var lastName = this._randomName;
                //新建一个名字
                this._randomName = MyGame.RandomNameTool.getRandomName(this._randomSex);
                this.updateRandomName(this._randomName);
                MyGame.RandomNameTool.removeOneName(lastName);
                //随机数值
                this._randomUserRoleData = new UserRole(undefined, getRandomUserRoleData(this._randomSex, this._randomName));
                this.updateRandomNum(this._randomUserRoleData);
            }.bind(this));
        }.bind(this));
        //随机属性控件相关
        this._randomAttackLabelNode = cc.find('Attack/Attack', this._topNode);
        this._randomDefLabelNode = cc.find('Def/Def', this._topNode);
        this._randomCommandLabelNode = cc.find('Command/Command', this._topNode);
        this._randomIntelligenceLabelNode = cc.find('Intelligence/Intelligence', this._topNode);
        this._randomCharmLabelNode = cc.find('Charm/Charm', this._topNode);
        this._randomPoliticsLabelNode = cc.find('Politics/Politics', this._topNode);
    }

    onShow() {
        super.onShow();
        //先初始化随机名字
        this._randomName = MyGame.RandomNameTool.getRandomName(MyGame.SEX_MAN);
        this.updateRandomName(this._randomName);
        //初始化性别
        //初始化默认都是男性
        this._randomSex = MyGame.SEX_MAN;
        this.updateSexToggle(this._randomSex);
        //初始化一个数据
        this._randomUserRoleData = new UserRole(undefined, getRandomUserRoleData(this._randomSex, this._randomName));
        this.updateRandomNum(this._randomUserRoleData);
    }

    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'random_btn':
                var lastName = this._randomName;
                //新建一个名字
                this._randomName = MyGame.RandomNameTool.getRandomName(this._randomSex);
                this.updateRandomName(this._randomName);
                MyGame.RandomNameTool.removeOneName(lastName);
                break;
            case 'random':
                this._randomUserRoleData = new UserRole(undefined, getRandomUserRoleData(this._randomSex, this._randomName));
                this.updateRandomNum(this._randomUserRoleData);
                break;
            case 'sure':
                MyGame.GameManager.userRole = this._randomUserRoleData;
                //加载MainUI界面
                MyGame.GameSceneManager.addNode('Prefab/MainUI/MainUI', MyGame.GAME_SCENE_UI_NODE, 'MainUI',
                    false, undefined, undefined, 100);
                //直接销毁了，这个界面没用了
                this.hide(true);
                break;
        }
    }

    /**
     * 更新名字显示控件
     * @param randomName
     */
    updateRandomName(randomName: string) {
        this._randomNameLabelNode.getComponent(cc.EditBox).string = randomName;
    }


    /**
     * 显示随机数据
     * @param randomData
     */
    updateRandomNum(randomData: UserRole) {
        this._randomAttackLabelNode.getComponent(cc.Label).string = '' + randomData.attack;
        this._randomDefLabelNode.getComponent(cc.Label).string = '' + randomData.def;
        this._randomCommandLabelNode.getComponent(cc.Label).string = '' + randomData.command;
        this._randomIntelligenceLabelNode.getComponent(cc.Label).string = '' + randomData.intelligence;
        this._randomCharmLabelNode.getComponent(cc.Label).string = '' + randomData.charm;
        this._randomPoliticsLabelNode.getComponent(cc.Label).string = '' + randomData.politics;
    }

    /**
     * 更新性别控件的显示
     * @param selectSex 选择的性别
     */
    updateSexToggle(selectSex: number) {
        selectSex = selectSex || MyGame.SEX_MAN;
        //先更新选中情况
        this._randomSexToggleNode.getComponent(cc.ToggleContainer).toggleItems.forEach(function (oneToggleComponent) {
            if (oneToggleComponent.node.name === 'toggle_man') {
                oneToggleComponent.isChecked = selectSex === MyGame.SEX_MAN;
            } else {
                oneToggleComponent.isChecked = selectSex !== MyGame.SEX_MAN;
            }
        });
        //更新显示字符
        cc.find('Sex/random_sex', this._topNode).getComponent(cc.Label).string =
            selectSex === MyGame.SEX_MAN ? MyGame.LanguageTool.getLanguageStr('sex_man') : MyGame.LanguageTool.getLanguageStr('sex_woman');
    }
}