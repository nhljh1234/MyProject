import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../../Data/Person/PersonFactory";
import { SureNoticeBoxButtonData } from "../Base/UITool";

const { ccclass, property } = cc._decorator;
@ccclass
export default class HireListUI extends BaseUI {

    _uiName: string = 'HireListUI';

    _personListNodePool: cc.NodePool;

    //选中的交易item
    _selectPersonData: any;

    @property(cc.Node)
    personListScrollViewNode: cc.Node = undefined;
    @property(cc.Node)
    personListScrollViewTmpNode: cc.Node = undefined;

    _btnData_2: SureNoticeBoxButtonData;

    onLoad() {
        super.onLoad();

        this._btnData_2 = {
            label: MyGame.LanguageTool.getLanguageStr('not_sure'),
            data: undefined,
            func: undefined
        }

        //监听事件
        MyGame.EventManager.on(MyGame.EventName.HIRE_PRESON_SUCCESS, this.hireSuccessCb, this);
    }

    /**
     * 雇佣成功后选哟刷新界面
     */
    hireSuccessCb() {
        this.showPersonHireList();
    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._personListNodePool = new cc.NodePool();
    }

    onShow() {
        super.onShow();
    }

    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();
        //取消监听事件
        MyGame.EventManager.off(MyGame.EventName.HIRE_PRESON_SUCCESS, this.hireSuccessCb);
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                break;
            case 'PersonHireNode':
                var personData: Person = MyGame.UITool.getNodeValue(node, 'personData');
                if (personData) {
                    //显示确认提示框
                    if (MyGame.GameManager.userRole.money < personData.price) {
                        MyGame.LogTool.showLog(`hire ${personData.name} error ! money is not enough`);
                        break;
                    }
                    var userRole = MyGame.GameManager.userRole;
                    var btnData_1 = {
                        label: MyGame.LanguageTool.getLanguageStr('sure'),
                        data: personData,
                        func: function (personData: Person) {
                            //确认购买
                            //扣钱
                            userRole.changeMoneyNum(-1 * personData.price);
                            //绑定雇佣关系
                            userRole.hirePerson(personData.personId);
                        }
                    }
                    MyGame.UITool.showMakeSureNode(
                        MyGame.LanguageTool.getLanguageStr('hire_make_sure_label', '' + personData.price, personData.name),
                        [btnData_1, this._btnData_2]);
                }
                break;
        }
    }

    showPersonHireList() {
        const LINE_SHOW_ITEM_NUM = 4;
        let userRole = MyGame.GameManager.userRole;
        //获取本城市所有npc的列表
        let npcs: Person[] = MyGame.GameManager.gameDataSave.getCityById(MyGame.GameManager.userRole.personPos.cityId).personArr;
        //去除已经被雇佣的
        npcs = npcs.filter(function (personData: Person) {
            return userRole.hireIds.indexOf(personData.personId) < 0;
        });
        let dataArr = [];
        let count = 0;
        npcs.forEach(function (onePersonData: Person) {
            let index = Math.floor(count / LINE_SHOW_ITEM_NUM);
            if (!dataArr[index]) {
                dataArr.push([]);
            }
            dataArr[index].push(onePersonData);
        });
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.personListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.personListScrollViewTmpNode, function (childNode: cc.Node, persons: Person[]) {
                let i: number;
                //隐藏多余节点
                childNode.children.forEach(function (node: cc.Node, index) {
                    node.active = index < persons.length;
                });
                for (i = 0; i < persons.length; i++) {
                    let personHireNode: cc.Node;
                    if (childNode.children[i]) {
                        personHireNode = childNode.children[i];
                        MyGame.GameSceneManager.getScriptComp(personHireNode).updatePersonHireNodeData(persons[i]);
                    } else {
                        personHireNode = MyGame.UITool.createPersonHireNode(persons[i]);
                        childNode.addChild(personHireNode);
                        //绑定数据
                        MyGame.UITool.saveNodeValue(personHireNode, 'personData', persons[i]);
                    }
                    personHireNode.x = (childNode.width / LINE_SHOW_ITEM_NUM) * (i + 0.5);
                    personHireNode.y = -1 * childNode.height / 2;
                }
            }, dataArr, this._personListNodePool);
        this.buttonTravelRegister(this.node);
    }
}