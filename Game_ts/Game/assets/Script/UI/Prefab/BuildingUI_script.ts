import BaseUI from "../Base/BaseUI";
import UserState from "./UserState_script";
import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { addUserStateNode } from "../Base/UITool";
import { City } from "../../Data/CityFactory";
import { Building, buildingFunctionData } from "../../Data/Building/BuildingFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class BuildingUI extends BaseUI {

    _uiName: string = 'BuildingUI';
    _buildingFunctionTmpNodePool: cc.NodePool;
    _buildingData: Building;

    @property(cc.Node)
    buildingFunctionScrollviewNode: cc.Node = undefined;

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
    }

    onShow() {
        super.onShow();
        this._buildingData = MyGame.GameDataSaveTool.getData('showBuildingData');
        //更新建筑功能栏
        this.showBuildingFunctionUI();
        //更新建筑名称
        this._midNode.getChildByName('building_name').getComponent(cc.Label).string = this._buildingData.buildingName;
        this.buttonTravelRegister(this.node);
    }

    hide(deleteFlag: boolean) {
        super.hide(deleteFlag);
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'building_type_button':
                var buildingTypeData: buildingFunctionData = MyGame.NodeTool.getNodeValue(node, 'buildingTypeData');
                if (buildingTypeData.functionType === MyGame.BUILDING_FUNCTION_TYPE_COME_BACK) {
                    //加载MainUI界面
                    MyGame.GameSceneManager.addNode('Prefab/MainUI/MainUI', MyGame.GAME_SCENE_UI_NODE, 'MainUI',
                        false, undefined, undefined, 100);
                    this.hide(false);
                } else {
                    this._buildingData.roleUseBuilding(MyGame.GameManager.userRole, buildingTypeData.functionType);
                }
                break;
        }
    }

    userRoleUpdateCb() {
        this._userStateScriptComp.updateUserState(true);
    }

    //显示建筑的功能列表
    showBuildingFunctionUI() {
        //初始化
        this._buildingFunctionTmpNodePool = new cc.NodePool();
        this.buildingFunctionScrollviewNode = this._bottomNode.getChildByName('building_type_scroll_view');
        let userRole = MyGame.GameManager.userRole;
        //功能列表
        let functionArr = this._buildingData.getFunctionArr();
        //更新现在城市的建筑
        MyGame.ScrollViewTool.buildScrollView(this.buildingFunctionScrollviewNode, MyGame.ScrollViewTool.SCROLL_TYPE_HORIZONTAL,
            cc.find('view/content/item', this.buildingFunctionScrollviewNode), function (childNode: cc.Node, data: buildingFunctionData) {
                let buttonNode = childNode.getChildByName('building_type_button');
                buttonNode.getChildByName('Label').getComponent(cc.Label).string = data.functionNameStr;
                //绑定数据
                MyGame.NodeTool.saveNodeValue(buttonNode, 'buildingTypeData', data);
            }, functionArr, this._buildingFunctionTmpNodePool);
    }
}