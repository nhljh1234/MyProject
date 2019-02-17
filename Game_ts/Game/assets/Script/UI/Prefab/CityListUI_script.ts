import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import PersonListUI from "./PersonListUI_script";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityListUI extends BaseUI {

    _uiName: string = 'CityListUI';

    _cityListNodePool: cc.NodePool;

    _forceId: number;

    @property(cc.Node)
    cityListScrollViewNode: cc.Node = undefined;
    @property(cc.Node)
    cityListScrollViewTmpNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();

    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._cityListNodePool = new cc.NodePool();
    }

    setForceId(forceId: number) {
        this._forceId = forceId;
        let gameData = MyGame.GameManager.gameDataSave;
        let cityArr = gameData.getForceById(this._forceId).cityArr;
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.cityListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.cityListScrollViewTmpNode, function (childNode: cc.Node, data: City) {
                cc.find('button/cityName', childNode).getComponent(cc.Label).string = data.cityName;
                MyGame.UITool.saveNodeValue(childNode.getChildByName('button'), '_city_id', data.cityId);
            }.bind(this), cityArr, this._cityListNodePool);
        this.buttonTravelRegister(this.node);
    }

    onShow() {
        super.onShow();
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
                var cityId = MyGame.UITool.getNodeValue(node, '_city_id');
                if (cityId) {
                    MyGame.GameSceneManager.addNode('Prefab/Msg/PersonListUI', MyGame.GAME_SCENE_UI_NODE, 'PersonListUI',
                        false, function (scriptComp: PersonListUI) {
                            scriptComp.setCityId(cityId);
                        }, undefined, 100);
                }
                break;
        }
    }
}