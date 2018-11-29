import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { addUserStateNode, updateUserState } from "../Normal/UserStateUITool";
import { City } from "../../Data/CityFactory";
import { Building } from "../../Data/Building/BuildingFactory";

const { ccclass, property } = cc._decorator;

@ccclass
class MainUI extends BaseUI {

    _uiName: string = 'MainUI';
    _buildingScrollviewNode: cc.Node;
    _buildingTmpNodePool: cc.NodePool;

    onLoad() {
        super.onLoad();
        //加载一下人物属性栏
        addUserStateNode(this._topNode, 0, -75, this.userRoleUpdateCb, this);
    }

    update(dt) {
        super.update(dt);

    }

    onUIInit() {
        super.onUIInit();

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
            case 'building_button':
                var buildingData = MyGame.NodeTool.getNodeValue(node, 'buildData');
                if (buildingData) {
                    //跳转到建筑中
                    //加载BuildingUI界面
                    MyGame.GameDataSaveTool.setData('showBuildingData', buildingData);
                    MyGame.GameSceneManager.addNode('Prefab/BuildingUI/BuildingUI', MyGame.GAME_SCENE_UI_NODE, 'BuildingUI',
                        false, undefined, undefined, 100);
                    this.hide(false);
                }
                break;
        }
    }

    userRoleUpdateCb() {
        updateUserState(this._topNode.getChildByName('UserState'), true);
    }

    showCityBuildingUI() {
        //初始化
        this._buildingTmpNodePool = new cc.NodePool();
        this._buildingScrollviewNode = this._bottomNode.getChildByName('building_scroll_view');
        let userRole = MyGame.GameManager.userRole;
        let buildArr: any = MyGame.GameManager.gameDataSave.getCityById(userRole.personPos.cityId).buildingArr;
        //判断有没有自宅
        //自宅排在第一个
        if (userRole.inInHomePos()) {
            buildArr = [userRole.home].concat(buildArr);
        }
        //更新现在城市的建筑
        MyGame.ScrollViewTool.buildScrollView(this._buildingScrollviewNode, MyGame.ScrollViewTool.SCROLL_TYPE_HORIZONTAL,
            cc.find('view/content/item', this._buildingScrollviewNode), function (childNode: cc.Node, data: Building) {
                let buttonNode = childNode.getChildByName('building_button');
                buttonNode.getChildByName('Label').getComponent(cc.Label).string = data.buildingName;
                //绑定数据
                MyGame.NodeTool.saveNodeValue(buttonNode, 'buildData', data);
            }, buildArr, this._buildingTmpNodePool);
    }
}