import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TradeItemUI extends BaseUI {

    _uiName: string = 'TradeItemUI';

    _itemDataObj: { [itemId: number]: number } = {};

    _itemListNodePool: cc.NodePool;

    //选中的交易item
    _selectItemData: any;

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
    }

    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    /**
     * 交易确认函数
     * @param tradeNum 出售数量
     */
    tradeSureCb(tradeNum: number) {
        if (!this._selectItemData) {
            return;
        }
        //获得的金钱
        let addMoneyNum = tradeNum * this._selectItemData.price;
        MyGame.GameManager.userRole.changeMoneyNum(addMoneyNum);
        //消耗的物品
        MyGame.GameManager.userRole.addItemNum(this._selectItemData.id, -1 * tradeNum);
        //更新列表
        this.showItemList();
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                break;
            case 'ItemNode':
                var itemData = MyGame.UITool.getNodeValue(node, 'itemData');
                if (itemData) {
                    this._selectItemData = itemData;
                    //显示交易进度条
                    MyGame.UITool.showAskTimeNode(MyGame.LanguageTool.getLanguageStr('trade_item_label'),
                        MyGame.LanguageTool.getLanguageStr('trade_item_max_label', itemData.number), itemData.number,
                        0, 1, this.tradeSureCb.bind(this));
                }
                break;
        }
    }

    showItemList() {
        const LINE_SHOW_ITEM_NUM = 4;
        MyGame.UITool.showItemScrollView(LINE_SHOW_ITEM_NUM, MyGame.GameManager.userRole.itemObj,
            this.itemListScrollViewNode, this.itemListScrollViewTmpNode, this._itemListNodePool);
        this.buttonTravelRegister(this.node);
    }
}