import BaseUI from "../Base/BaseUI";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ProgressNotice extends BaseUI {

    _uiName: string = 'ProgressNotice';

    @property(cc.Label)
    title: cc.Label = undefined;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = undefined;

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
        this.updateProgressNum(0);
    }

    //隐藏界面，deleteFlag表示是否删除
    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    /**
     * 更新进度信息
     * @param progressNum 进度值
     */
    updateProgressNum(progressNum: number) {
        this.progressBar.progress = progressNum;
    }

    /**
     * 更新标题
     * @param title 
     */
    updateTitle(title: string) {
        this.title.string = title;
    }
}