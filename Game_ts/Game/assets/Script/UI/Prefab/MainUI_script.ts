import BaseUI from "../Base/BaseUI";
import UserState from "./UserState_script";
import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { addUserStateNode } from "../Base/UITool";
import { City } from "../../Data/CityFactory";
import BuildingUI from "./BuildingUI_script";
import { Building } from "../../Data/Building/BuildingFactory";
import WarehouseUI from "./WarehouseUI_script";

const { ccclass, property } = cc._decorator;

@ccclass
class MainUI extends BaseUI {

    _uiName: string = 'MainUI';
    _buildingTmpNodePool: cc.NodePool;

    @property(cc.Node)
    buildingScrollviewNode: cc.Node = undefined;

    _userStateScriptComp: UserState;

    onLoad() {
        super.onLoad();
        //加载一下人物属性栏
        addUserStateNode(this._topNode, 0, -75, this.userRoleUpdateCb, this, function (scriptComp: UserState) {
            this._userStateScriptComp = scriptComp;
        }.bind(this));
    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();
        this._buildingTmpNodePool = new cc.NodePool();
    }

    onShow() {
        super.onShow();
        //显示建筑
        this.showCityBuildingUI();
    }

    hide(deleteFlag: boolean) {
        super.hide(deleteFlag);

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'MsgBtn':
                MyGame.GameSceneManager.addNode('Prefab/Msg/ForceListUI', MyGame.GAME_SCENE_UI_NODE, 'ForceListUI',
                    false, undefined, undefined, 100);
                break;
            case 'BagBtn':
                MyGame.GameSceneManager.addNode('Prefab/WarehouseUI/WarehouseUI', MyGame.GAME_SCENE_UI_NODE, 'WarehouseUI',
                    false, function (scriptComp: WarehouseUI) {
                        scriptComp.setWarehouseType(MyGame.WAREHOUSEUI_TYPE_BAG);
                    }, undefined, 100);
                break;
            case 'building_button':
                var buildingData = MyGame.NodeTool.getNodeValue(node, 'buildData');
                if (buildingData) {
                    //跳转到建筑中
                    //加载BuildingUI界面
                    MyGame.GameSceneManager.addNode('Prefab/BuildingUI/BuildingUI', MyGame.GAME_SCENE_UI_NODE, 'BuildingUI',
                        false, function (scriptComp: BuildingUI) {
                            scriptComp.setBuildingData(buildingData);
                        }, undefined, 100);
                    this.hide(false);
                }
                break;
        }
    }

    userRoleUpdateCb() {
        this._userStateScriptComp.updateUserState(true);
    }

    showCityBuildingUI() {
        //初始化
        this.buildingScrollviewNode = this._bottomNode.getChildByName('building_scroll_view');
        let userRole = MyGame.GameManager.userRole;
        let buildArr: any = MyGame.GameManager.gameDataSave.getCityById(userRole.personPos.cityId).buildingArr;
        //判断有没有自宅
        //自宅排在第一个
        if (userRole.inInHomePos()) {
            buildArr = [userRole.home].concat(buildArr);
        }
        //更新现在城市的建筑
        MyGame.ScrollViewTool.buildScrollView(this.buildingScrollviewNode, MyGame.ScrollViewTool.SCROLL_TYPE_HORIZONTAL,
            cc.find('view/content/item', this.buildingScrollviewNode), function (childNode: cc.Node, data: Building) {
                let buttonNode = childNode.getChildByName('building_button');
                buttonNode.getChildByName('Label').getComponent(cc.Label).string = data.buildingName;
                //绑定数据
                MyGame.NodeTool.saveNodeValue(buttonNode, 'buildData', data);
            }, buildArr, this._buildingTmpNodePool);
    }
}