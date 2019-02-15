import BaseUI from "../Base/BaseUI";
import { SureNoticeBoxButtonData } from "../Base/UITool";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SureNoticeBox extends BaseUI {

    _uiName: string = 'SureNoticeBox';

    @property(cc.Label)
    msgLabel: cc.Label = undefined;
    @property(cc.Node)
    btnNode_1: cc.Node = undefined;
    @property(cc.Node)
    btnNode_2: cc.Node = undefined;
    @property(cc.Node)
    btnNode_3: cc.Node = undefined;

    _buttonDatasSave: SureNoticeBoxButtonData[] = [];

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
        let index: number;
        switch (name) {
            case 'btn_1':
                index = 0;
                break;
            case 'btn_2':
                index = 1;
                break;
            case 'btn_3':
                index = 2;
                break;
        }
        if (this._buttonDatasSave[index] && this._buttonDatasSave[index].func) {
            this._buttonDatasSave[index].func(this._buttonDatasSave[index].data);
        }
        this.hide(false);
    }

    init(msgString: string, buttonDatas: SureNoticeBoxButtonData[]) {
        //更新显示的文本
        this.msgLabel.string = msgString;
        this._buttonDatasSave = buttonDatas;
        //判断要显示几个
        let btns = [this.btnNode_1, this.btnNode_2, this.btnNode_3];
        btns.forEach(function (node: cc.Node, index) {
            node.active = index < buttonDatas.length;
        });
        //按钮位置排序
        switch (buttonDatas.length) {
            case 1:
                this.btnNode_1.x = 0;
                break;
            case 2:
                this.btnNode_1.x = -100;
                this.btnNode_2.x = 100;
                break;
            case 3:
                this.btnNode_1.x = -150;
                this.btnNode_2.x = 0;
                this.btnNode_3.x = 150;
                break;
        }
        //更新按钮信息
        buttonDatas.forEach(function (data: SureNoticeBoxButtonData, index) {
            let btnNode = btns[index];
            btnNode.getChildByName('Label').getComponent(cc.Label).string = data.label;
        });
        this.buttonTravelRegister(this.node);
    }
}