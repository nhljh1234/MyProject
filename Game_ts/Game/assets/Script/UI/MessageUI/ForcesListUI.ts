import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import { Force } from "../../Data/ForceFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class ForceListUI extends BaseUI {

    _uiName: string = 'ForceListUI';

    _forceListNodePool: cc.NodePool;
    _forceListNScrollViewNode: cc.Node;
    _forceListNScrollViewTmpNode: cc.Node;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._forceListNodePool = new cc.NodePool();
        this._forceListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._forceListNScrollViewTmpNode = cc.find('view/content/item', this._forceListNScrollViewNode);
    }

    onShow() {
        super.onShow();
        let gameData = MyGame.GameManager.gameData;
        let forceDataArr = gameData.allForceArr;
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this._forceListNScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this._forceListNScrollViewTmpNode, function (childNode: cc.Node, data: Force) {
                cc.find('button/forceName', childNode).getComponent(cc.Label).string = data.forceName;
                MyGame.NodeTool.saveNodeValue(childNode.getChildByName('button'), '_force_id', data.forceId);
            }.bind(this), forceDataArr, this._forceListNodePool);
        this.buttonTravelRegister(this.node);
    }

    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'hide':
                this.hide(false);
                break;
            case 'button':
                var forceId = MyGame.NodeTool.getNodeValue(node, '_force_id');
                if (forceId) {
                    MyGame.GameDataSaveTool.setData('show_force_id', forceId);
                    MyGame.GameSceneManager.addNode('Prefab/Msg/CityListUI', MyGame.GAME_SCENE_UI_NODE, 'CityListUI',
                        false, undefined, undefined, 100);
                }
                break;
        }
    }
}