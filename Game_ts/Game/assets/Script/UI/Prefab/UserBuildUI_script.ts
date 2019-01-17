import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Person, createRandomPerson } from "../../Data/PersonFactory";
import { getRandomUserRoleData, UserRole } from "../../Data/UserRoleFactory";
import { Game } from "../../Data/GameFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class UserBuildUI extends BaseUI {

    uiName: string = 'UserBuildUI';

    @property(cc.EditBox)
    randomNameEditBox: cc.EditBox = undefined;
    @property(cc.ToggleContainer)
    randomSexToggleContainer: cc.ToggleContainer = undefined;
    @property(cc.Label)
    randomSexLabel: cc.Label = undefined;
    @property(cc.Label)
    randomAttackLabel: cc.Label = undefined;
    @property(cc.Label)
    randomDefLabel: cc.Label = undefined;
    @property(cc.Label)
    randomCommandLabel: cc.Label = undefined;
    @property(cc.Label)
    randomIntelligenceLabel: cc.Label = undefined;
    @property(cc.Label)
    randomCharmLabel: cc.Label = undefined;
    @property(cc.Label)
    randomPoliticsLabel: cc.Label = undefined;

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
        this.randomNameEditBox.placeholder = MyGame.LanguageTool.getLanguageStr('random_name_notice');
        this.randomSexToggleContainer.toggleItems.forEach(function (oneToggleComponent) {
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
                //开始游戏
                MyGame.GameManager.initGame(new Game(undefined, 7, 13));
                MyGame.GameManager.start();
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
        this.randomNameEditBox.string = randomName;
    }


    /**
     * 显示随机数据
     * @param randomData
     */
    updateRandomNum(randomData: UserRole) {
        this.randomAttackLabel.string = '' + randomData.attack;
        this.randomDefLabel.string = '' + randomData.def;
        this.randomCommandLabel.string = '' + randomData.command;
        this.randomIntelligenceLabel.string = '' + randomData.intelligence;
        this.randomCharmLabel.string = '' + randomData.charm;
        this.randomPoliticsLabel.string = '' + randomData.politics;
    }

    /**
     * 更新性别控件的显示
     * @param selectSex 选择的性别
     */
    updateSexToggle(selectSex: number) {
        selectSex = selectSex || MyGame.SEX_MAN;
        //先更新选中情况
        this.randomSexToggleContainer.toggleItems.forEach(function (oneToggleComponent) {
            if (oneToggleComponent.node.name === 'toggle_man') {
                oneToggleComponent.isChecked = selectSex === MyGame.SEX_MAN;
            } else {
                oneToggleComponent.isChecked = selectSex !== MyGame.SEX_MAN;
            }
        });
        //更新显示字符
        this.randomSexLabel.string = 
            selectSex === MyGame.SEX_MAN ? MyGame.LanguageTool.getLanguageStr('sex_man') : MyGame.LanguageTool.getLanguageStr('sex_woman');
    }
}