import HistroyGame = require('../../Tool/System/Game');
 
const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUI extends cc.Component {

    uiName: string = undefined;

    leftNode: cc.Node = undefined;
    topNode: cc.Node = undefined;
    rightNode: cc.Node = undefined;
    bottomNode: cc.Node = undefined;
    midNode: cc.Node = undefined;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.uiName) {
            this.node.name = this.uiName;
        }
        this.leftNode = this.node.getChildByName('Left');
        this.topNode = this.node.getChildByName('Top');
        this.rightNode = this.node.getChildByName('Right');
        this.bottomNode = this.node.getChildByName('Bottom');
        this.midNode = this.node.getChildByName('Mid');
        this.onUIInit();
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

    /**
    * 隐藏UI
    * @param {boolean} deleteFlag 是否清除
    */
    hide(deleteFlag: boolean) {
        this.node.active = false;
        if (deleteFlag) {
            this.node.removeFromParent(true);
            this.node.destroy();
            HistroyGame.NodeTool.saveNodeValue(this.node, '_tj_isDestroy', true);
            HistroyGame.SpriteFrameManager.clearDestroyNode();
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

    buttonClickCb(clickEvent: cc.Event.EventCustom) {
            //解析参数
            //触发事件的结点
            var node = clickEvent.currentTarget;
            //触发事件的按钮组件
            var component = clickEvent.detail;
            //组件的名字
            var name = node.name;
            this.onButtonClick(name, node, component);
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {

    }
}
