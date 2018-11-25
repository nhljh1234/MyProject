import { MyGame } from "../../Tool/System/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUI extends cc.Component {

    _uiName: string = undefined;

    _leftNode: cc.Node = undefined;
    _topNode: cc.Node = undefined;
    _rightNode: cc.Node = undefined;
    _bottomNode: cc.Node = undefined;
    _midNode: cc.Node = undefined;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this._uiName) {
            this.node.name = this._uiName;
        }
        this._leftNode = this.node.getChildByName('Left');
        this._topNode = this.node.getChildByName('Top');
        this._rightNode = this.node.getChildByName('Right');
        this._bottomNode = this.node.getChildByName('Bottom');
        this._midNode = this.node.getChildByName('Mid');
        this.onUIInit();
        this.buttonTravelRegister(this.node);
        this.onShow();
    }

    start() {

    }

    update(dt) {

    }

    onUIInit() {

    }

    onShow() {

    }

    onDestroy () {
        
    }

    /**
    * 隐藏UI
    * @param {boolean} deleteFlag 是否清除
    */
    hide(deleteFlag: boolean) {
        this.node.active = false;
        if (deleteFlag) {
            this.node.removeFromParent(true);
            this.node.destroy();
            MyGame.NodeTool.saveNodeValue(this.node, '_tj_isDestroy', true);
            MyGame.SpriteFrameManager.clearDestroyNode();
        }
    }

    /**
     * 这个函数会注册指定结点下所有的结点
     * 需要避免多次时间注册的情况
     */
    buttonTravelRegister(node: cc.Node) {
        if (!node) {
            return;
        }
        if (node.getComponent(cc.Button)) {
            //注册事件
            node.on('click', this.buttonClickCb, this);
        }
        //遍历执行
        node.children.forEach(function (childNode) {
            this.buttonTravelRegister(childNode);
        }.bind(this));
    }

    buttonTravelUnRegister(node: cc.Node) {
        if (!node) {
            return;
        }
        if (node.getComponent(cc.Button)) {
            //注册事件
            node.off('click', this.buttonClickCb, this);
        }
        //遍历执行
        node.children.forEach(function (childNode) {
            this.buttonTravelUnRegister(childNode);
        }.bind(this));
    }

    buttonClickCb(buttonComponent: cc.Button) {
            //解析参数
            //触发事件的结点
            var node = buttonComponent.node;
            //组件的名字
            var name = node.name;
            this.onButtonClick(name, node, buttonComponent);
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {

    }
}
