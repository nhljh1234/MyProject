import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class CityListUI extends BaseUI {

    _uiName: string = 'CityListUI';

    _cityListNodePool: cc.NodePool;
    _cityListNScrollViewNode: cc.Node;
    _cityListNScrollViewTmpNode: cc.Node;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._cityListNodePool = new cc.NodePool();
        this._cityListNScrollViewNode = cc.find('Mid/scrollview', this.node);
        this._cityListNScrollViewTmpNode = cc.find('view/content/item', this._cityListNScrollViewNode);
    }

    onShow() {
        super.onShow();
        let gameData = MyGame.GameManager.gameData;
        let forceId = MyGame.GameDataSaveTool.getData('show_force_id');
        let cityArr = gameData.getForceById(forceId).cityArr;
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this._cityListNScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this._cityListNScrollViewTmpNode, function (childNode: cc.Node, data: City) {
                cc.find('button/cityName', childNode).getComponent(cc.Label).string = data.cityName;
                MyGame.NodeTool.saveNodeValue(childNode.getChildByName('button'), '_city_id', data.cityId);
            }.bind(this), cityArr, this._cityListNodePool);
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
                var cityId = MyGame.NodeTool.getNodeValue(node, '_city_id');
                if (cityId) {
                    MyGame.GameDataSaveTool.setData('show_city_id', cityId);
                    MyGame.GameSceneManager.addNode('Prefab/Msg/PersonListUI', MyGame.GAME_SCENE_UI_NODE, 'PersonListUI',
                        false, undefined, undefined, 100);
                }
                break;
        }
    }
}