import BaseUI from "../Base/BaseUI";

const { ccclass, property } = cc._decorator;
@ccclass
export default class AskNumBox extends BaseUI {

    _uiName: string = 'AskNumBox';

    //当前数量
    _nowNum: number;
    //最大数量
    _maxNum: number;
    //每次增加的数量
    _onceAddNum: number;
    //确认回调函数
    _sureCb: Function;
    //修改数量会修改noticeLabel的函数
    _noticeLabelCb: Function;

    @property(cc.Node)
    boxBgNode: cc.Node = undefined;
    @property(cc.Label)
    askTitleLabel: cc.Label = undefined;
    @property(cc.EditBox)
    editBox: cc.EditBox = undefined;
    @property(cc.Label)
    askNoticeLabel: cc.Label = undefined;
    @property(cc.Node)
    layoutNode: cc.Node = undefined;
    @property(cc.Node)
    btnSureNode: cc.Node = undefined;

    //背景高度
    _bgHeight: number;
    //ask_label初始高度
    _askNoticeLabelHeight: number;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    //onLoad super的时候会调用，在onShow之前
    onUIInit() {
        super.onUIInit();
        //绑定文本改变函数
        this.editBox.node.on('text-changed', this.textChange.bind(this));
        //绑定初始数据
        this._bgHeight = this.boxBgNode.height;
        this._askNoticeLabelHeight = this.askNoticeLabel.node.height;
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
            case 'btn_add':
                this._nowNum = this._nowNum + this._onceAddNum;
                if (this._nowNum > this._maxNum) {
                    this._nowNum = this._maxNum;
                }
                this.updateNowNum();
                break;
            case 'btn_reduce':
                this._nowNum = this._nowNum - this._onceAddNum;
                if (this._nowNum < 0) {
                    this._nowNum = 0;
                }
                this.updateNowNum();
                break;
            case 'btn_sure':
                this.hide(false);
                if (this._sureCb) {
                    this._sureCb(this._nowNum);
                }
                break;
        }
    }

    /**
     * 显示当前选中的数量
     */
    updateNowNum() {
        this.editBox.string = '' + this._nowNum;
        if (this._noticeLabelCb) {
            this._noticeLabelCb(this.askNoticeLabel, this._nowNum);
        }
    }

    textChange() {
        this._nowNum = parseInt(this.editBox.string);
        if (this._noticeLabelCb) {
            this._noticeLabelCb(this.askNoticeLabel, this._nowNum);
        }
    }

    /**
     * 改变尺寸
     */
    updateLayoutSize() {
        this.boxBgNode.height = this._bgHeight + this.askNoticeLabel.node.height - this._askNoticeLabelHeight;
        this.layoutNode.height = this.btnSureNode.height +
            this.askNoticeLabel.node.height + this.layoutNode.getComponent(cc.Layout).spacingY;
    }

    /**
     * 显示数据
     */
    showMsg(askLabel: string, noticeLabel: string, maxNum: number, startNum: number = 0,
        onceAddNum: number, sureCb: Function, noticeLabelCb: Function) {
        this.askTitleLabel.string = askLabel;
        this.askNoticeLabel.string = noticeLabel;
        this._maxNum = maxNum;
        this._nowNum = startNum;
        this._onceAddNum = onceAddNum;
        this._sureCb = sureCb;
        this._noticeLabelCb = noticeLabelCb;
        this.updateLayoutSize();
        this.updateNowNum();
    }
}