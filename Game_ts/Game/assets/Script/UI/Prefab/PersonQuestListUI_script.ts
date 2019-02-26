import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import PersonListUI from "./PersonListUI_script";
import { UserRole } from "../../Data/Person/UserRoleFactory";
import ProgressNotice from "./ProgressNotice_script";
import { BasePerson } from "../../Data/Person/BasePersonFactory";
import ActionListUI from "./ActionListUI_script";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PersonQuestListUI extends BaseUI {

    _uiName: string = 'PersonQuestListUI';

    _personListNodePool: cc.NodePool;

    _selectPersons: BasePerson[];

    @property(cc.Node)
    personListScrollViewNode: cc.Node = undefined;
    @property(cc.Node)
    personListScrollViewTmpNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._personListNodePool = new cc.NodePool();
    }

    showAllHirePersonList() {
        let userRole = MyGame.GameManager.userRole;
        let hireIds: number[] = userRole.hireIds;
        //获取所有的玩家列表
        let hirePerson: BasePerson[] = hireIds.map(function (hireId: number) {
            return MyGame.GameManager.gameDataSave.getPersonById(hireId);
        });
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.personListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.personListScrollViewTmpNode, function (childNode: cc.Node, data: BasePerson) {
                //显示文本
                let personName = data.name;
                //正在执行的活动
                if (data.nowActions.length > 0) {
                    let nowActionName = data.nowActions[0].name;
                    personName = `${personName}(${nowActionName})`;
                }
                childNode.getChildByName('personName').getComponent(cc.Label).string = personName;
                MyGame.UITool.saveNodeValue(childNode, 'person', data);
            }.bind(this), hirePerson, this._personListNodePool);
        this.buttonTravelRegister(this.node);
    }

    /**
     * 获取选中的雇佣对象
     */
    selectHirePersons() {
        this.personListScrollViewNode.getComponent(cc.ScrollView).content.children.forEach(function (childNode: cc.Node) {
            if (childNode.getChildByName('toggle').getComponent(cc.Toggle).isChecked) {
                this._selectPersons.push(MyGame.UITool.getNodeValue(childNode, 'person'));
            }
        }.bind(this));
    }

    /**
     * 保证this._selectPersons数据唯一
     */
    manageHirePersons() {
        let hirePersonIds: number[] = [];
        let hirePersons: BasePerson[] = [];
        this._selectPersons.forEach(function (personData: BasePerson) {
            if (hirePersonIds.indexOf(personData.personId) < 0) {
                hirePersonIds.push(personData.personId);
                hirePersons.push(personData);
            }
        });
        this._selectPersons = hirePersons;
    }

    onShow() {
        super.onShow();
        this._selectPersons = [];
    }

    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                break;
            case 'select':
                this.manageHirePersons();
                //显示执行动作界面
                MyGame.GameSceneManager.addNode('Prefab/BuildingUI/ActionListUI', MyGame.GAME_SCENE_UI_NODE, 'ActionListUI',
                    false, function (scriptComp: ActionListUI) {
                        scriptComp.showAllActionList(this._selectPersons);
                    }.bind(this), undefined, 100);
                break;
        }
    }
}