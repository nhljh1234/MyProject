import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import PersonListUI from "./PersonListUI_script";
import { UserRole } from "../../Data/Person/UserRoleFactory";
import ProgressNotice from "./ProgressNotice_script";
import { BasePerson } from "../../Data/Person/BasePersonFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActionListUI extends BaseUI {

    _uiName: string = 'ActionListUI';

    _actionListNodePool: cc.NodePool;

    _allCanEntrustActions: any[];

    _selectPersons: BasePerson[];

    @property(cc.Node)
    actionListScrollViewNode: cc.Node = undefined;
    @property(cc.Node)
    actionListScrollViewTmpNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._actionListNodePool = new cc.NodePool();
    }

    showAllActionList(selectPersons: BasePerson[]) {
        //绑定数据
        this._selectPersons = selectPersons;
        let allActions: any[] = MyGame.JsonDataTool.getTableByName('_table_action_action').array;
        this._allCanEntrustActions = allActions.filter(function (oenData) {
            return !!oenData.canEntrust;
        });
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.actionListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.actionListScrollViewTmpNode, function (childNode: cc.Node, data: any) {
                //显示可委托任务的名字
                cc.find('button/actionName', childNode).getComponent(cc.Label).string = data.name;
                //绑定数据
                MyGame.UITool.saveNodeValue(childNode, 'actionData', data);
            }.bind(this), this._allCanEntrustActions, this._actionListNodePool);
        this.buttonTravelRegister(this.node);
    }

    onShow() {
        super.onShow();
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
            case 'button':

                break;
        }
    }
}