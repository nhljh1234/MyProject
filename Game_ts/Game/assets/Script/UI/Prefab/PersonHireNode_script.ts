import BaseUI from "../Base/BaseUI";
import { Person } from "../../Data/PersonFactory";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PersonHireNode extends BaseUI {

    _uiName: string = 'PersonHireNode';

    @property(cc.Label)
    priceLabel: cc.Label = undefined;
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

    updatePersonHireNodeData(personData: Person) {
        this.priceLabel.string = '' + personData.price;
        this.nameLabel.string = personData.name;
    }
}