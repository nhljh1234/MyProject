import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Person } from "../../Data/PersonFactory";

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
            case 'PersonHireNode':
                var personData: Person = MyGame.NodeTool.getNodeValue(node, 'personData');
                if (personData) {
                    //显示确认提示框
                    if (MyGame.GameManager.userRole.money < personData.price) {
                        MyGame.LogTool.showLog(`hire ${personData.name} error ! money is not enough`);
                        break;
                    }

                }
                break;
        }
    }

    showPersonHireList() {
        const LINE_SHOW_ITEM_NUM = 4;
        //获取本城市所有npc的列表
        let npcs: Person[] = MyGame.GameManager.gameDataSave.getCityById(MyGame.GameManager.userRole.personPos.cityId).personArr;
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
                for (i = 0; i < persons.length; i++) {
                    let personHireNode: cc.Node;
                    if (childNode.children[i]) {
                        personHireNode = childNode.children[i];
                        MyGame.GameSceneManager.getScriptComp(personHireNode).updatePersonHireNodeData(persons[i]);
                    } else {
                        personHireNode = MyGame.UITool.createPersonHireNode(persons[i]);
                        childNode.addChild(personHireNode);
                        //绑定数据
                        MyGame.NodeTool.saveNodeValue(personHireNode, 'personData', persons[i]);
                    }
                    personHireNode.x = (childNode.width / LINE_SHOW_ITEM_NUM) * (i + 0.5);
                    personHireNode.y = -1 * childNode.height / 2;
                }
            }, dataArr, this._personListNodePool);
        this.buttonTravelRegister(this.node);
    }
}