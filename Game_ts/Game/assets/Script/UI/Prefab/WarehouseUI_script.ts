import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";

const { ccclass, property } = cc._decorator;
@ccclass
class WarehouseUI extends BaseUI {

    _uiName: string = 'WarehouseUI';

    _itemDataObj: { [itemId: number]: number } = {};

    _itemListNodePool: cc.NodePool;

    @property(cc.Node)
    itemListScrollViewNode: cc.Node = undefined;
    @property(cc.Node)
    itemListScrollViewTmpNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();
    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._itemListNodePool = new cc.NodePool();
    }

    onShow() {
        super.onShow();
        let showType = MyGame.GameDataSaveTool.getData('show_warehouseUI_type');
        switch (showType) {
            case MyGame.WAREHOUSEUI_TYPE_WAREHOUSE:
                this._itemDataObj = MyGame.GameManager.userRole.warehouseItemObj;
                break;
            case MyGame.WAREHOUSEUI_TYPE_BAG:
                this._itemDataObj = MyGame.GameManager.userRole.itemObj;
                break;
        }
        this.showItemList();
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
        }
    }

    showItemList() {
        //组装参数给scrollviewTool使用
        let dataArr = [];
        let count = 0;
        for (var key in this._itemDataObj) {
            if (!this._itemDataObj.hasOwnProperty(key)) {
                continue;
            }
            let index = Math.floor(count / 5);
            if (!dataArr[index]) {
                dataArr.push([]);
            }
            dataArr[index].push({
                number: this._itemDataObj[key],
                data: MyGame.JsonDataTool.getDataById('_table_item_sellGood', parseInt(key))
            });
        }
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.itemListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.itemListScrollViewTmpNode, function (childNode: cc.Node, data: any[]) {
                let i;
                for (i = 0; i < data.length; i++) {
                    let itemNode, itemData;
                    itemData = {
                        number: data[i].number,
                        name: data[i].data.name
                    };
                    if (childNode.children[i]) {
                        itemNode = childNode.children[i];
                        MyGame.GameSceneManager.getScriptComp(itemNode).updateItemNodeData(itemData);
                    } else {
                        itemNode = MyGame.UITool.createItemNode(itemData);
                        childNode.addChild(itemNode);
                    }
                    itemNode.x = (childNode.width / 5) * (i + 0.5);
                    itemNode.y = -1 * childNode.height / 2;
                }
            }.bind(this), dataArr, this._itemListNodePool);
        this.buttonTravelRegister(this.node);
    }
}