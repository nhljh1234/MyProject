import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";

export interface ChoiceBoxButtonData {
    label: string,
    func: Function,
    funcData: any
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChoiceBox extends BaseUI {

    _uiName: string = 'ChoiceBox';

    @property(cc.Node)
    layoutNode: cc.Node = undefined;
    @property(cc.Node)
    labelNode: cc.Node = undefined;

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
            case 'bg':
                this.hide(false);
                break;
            case 'button':
                let data: ChoiceBoxButtonData = MyGame.UITool.getNodeValue(node, 'buttonData');
                if (data.func) {
                    data.func(data.funcData);
                }
                break;
        }
    }

    /**
     * 显示按钮列表
     */
    showChoiceList(choiceBoxButtonDatas: ChoiceBoxButtonData[]) {
        if (!choiceBoxButtonDatas || !choiceBoxButtonDatas.length) {
            this.hide(false);
            return;
        }
        //模板按钮
        let tmpBtnNode = this.layoutNode.children[0];
        let btnNum = this.layoutNode.childrenCount;
        while (btnNum < choiceBoxButtonDatas.length) {
            btnNum++;
            this.layoutNode.addChild(cc.instantiate(tmpBtnNode));
        }
        //隐藏节点
        this.layoutNode.children.forEach(function (childNode: cc.Node, index: number) {
            childNode.active = index < choiceBoxButtonDatas.length;
            if (index < choiceBoxButtonDatas.length) {
                //绑定数据
                childNode.getChildByName('Label').getComponent(cc.Label).string = choiceBoxButtonDatas[index].label;
                //绑定数据
                MyGame.UITool.saveNodeValue(childNode, 'buttonData', choiceBoxButtonDatas[index]);
            }
        });
        //重设位置
        this.layoutNode.height = choiceBoxButtonDatas.length * tmpBtnNode.height +
            (choiceBoxButtonDatas.length + 1) * this.layoutNode.getComponent(cc.Layout).spacingY;
        this.layoutNode.parent.height = this.layoutNode.height;
        this.layoutNode.y = this.layoutNode.height / 2;
        this.labelNode.y = -1 * this.layoutNode.height / 2;

        this.buttonTravelRegister(this.node);
    }
}