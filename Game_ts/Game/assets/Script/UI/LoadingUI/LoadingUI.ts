import BaseUI from "../Base/BaseUI";
import { MyGame, init } from "../../Tool/System/Game";

const { ccclass, property } = cc._decorator;

@ccclass
class LoadingUI extends BaseUI {

    _uiName: string = 'LoadingUI';
    _labelNode: cc.Node = undefined;
    _loadProgressNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        MyGame.GameSceneUINode = this.node.getChildByName("UINode");
        MyGame.GameSceneAlertNode = this.node.getChildByName("AlertNode");
        MyGame.GameSceneNetNode = this.node.getChildByName("NetNode");
    }

    onShow() {
        super.onShow();
        this._labelNode = this.node.getChildByName('label');
        this._labelNode.active = false;
        this._loadProgressNode = this.node.getChildByName('progressBar');
        this._loadProgressNode.getComponent(cc.ProgressBar).progress = 0;
        //初始化游戏
        //全局初始化
        init(function (num) {
            this._loadProgressNode.getComponent(cc.ProgressBar).progress = num;
        }.bind(this), function () {
            //this.node.getChildByName('label').active = true;
            this.preLoadGameScene();
        }.bind(this));
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'label':
                cc.director.loadScene('GameScene');
                break;
        }
    }

    //预加载Game场景
    preLoadGameScene() {
        cc.director.preloadScene('GameScene', function (error) {
            //onLoaded函数
            if (error) {
                MyGame.LogTool.showLog('preload Game Scene error, error is : ' + error);
                return;
            }
            //显示文本，用户点击就可以切换
            this._loadProgressNode.active = false;
            this._labelNode.active = true;
        }.bind(this));
    }
}