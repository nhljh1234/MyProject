import BaseUI from "../Base/BaseUI";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ItemNode extends BaseUI {

    _uiName: string = 'ItemNode';

    @property(cc.Label)
    numLabel: cc.Label = undefined;
    @property(cc.Label)
    nameLabel: cc.Label = undefined;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    //onLoad super的时候会调用，在onShow之前
    onUIInit() {
        super.onUIInit();

    }

    //结点active的时候会调用
    onShow() {
        super.onShow();

    }

    //隐藏界面，deleteFlag表示是否删除
    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {

        }
    }

    updateItemNodeData(itemData: any) {
        this.numLabel.string = itemData.number;
        this.nameLabel.string = itemData.name;
    }
}