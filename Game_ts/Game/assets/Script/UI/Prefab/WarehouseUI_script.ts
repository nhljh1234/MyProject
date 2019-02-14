import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";

const { ccclass, property } = cc._decorator;
@ccclass
export default class WarehouseUI extends BaseUI {

    _uiName: string = 'WarehouseUI';

    _itemDataObj: { [itemId: number]: number } = {};

    _itemListNodePool: cc.NodePool;

    _showType: string;

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

    /**
     * 初始化
     */
    setWarehouseType(showType: string) {
        this._showType = showType;
        switch (this._showType) {
            case MyGame.WAREHOUSEUI_TYPE_WAREHOUSE:
                this._itemDataObj = MyGame.GameManager.userRole.warehouseItemObj;
                break;
            case MyGame.WAREHOUSEUI_TYPE_BAG:
                this._itemDataObj = MyGame.GameManager.userRole.itemObj;
                break;
        }
        this.showItemList();
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
        }
    }

    showItemList() {
        const LINE_SHOW_ITEM_NUM = 5;
        MyGame.UITool.showItemScrollView(LINE_SHOW_ITEM_NUM, this._itemDataObj,
            this.itemListScrollViewNode, this.itemListScrollViewTmpNode, this._itemListNodePool);
        this.buttonTravelRegister(this.node);
    }
}