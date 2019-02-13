import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { City } from "../../Data/CityFactory";
import PersonListUI from "./PersonListUI_script";
import { UserRole } from "../../Data/UserRoleFactory";
import ProgressNotice from "./ProgressNotice_script";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GateCityListUI extends BaseUI {

    _uiName: string = 'GateCityListUI';

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

    showTravelCityList() {
        let gameData = MyGame.GameManager.gameDataSave;
        let cityArr = gameData.allCityArr.filter(function (cityData: City) {
            //去除当前所在的城市
            return cityData.cityId !== MyGame.GameManager.userRole.personPos.cityId;
        });
        //显示list
        MyGame.ScrollViewTool.buildScrollView(this.cityListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
            this.cityListScrollViewTmpNode, function (childNode: cc.Node, data: City) {
                //计算一下旅行时间
                let costTime: number = MyGame.TravelModule.getTravelCostTime(MyGame.GameManager.userRole.personPos.cityId,
                    data.cityId);
                cc.find('button/cityName', childNode).getComponent(cc.Label).string = `${data.cityName}(${costTime}min)`;
                MyGame.NodeTool.saveNodeValue(childNode.getChildByName('button'), '_city_id', data.cityId);
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
                var cityId = MyGame.NodeTool.getNodeValue(node, '_city_id');
                if (cityId) {
                    this.hide(false);
                    MyGame.GameSceneManager.addNode('Prefab/Notice/ProgressNotice', MyGame.GAME_SCENE_ALERT_NODE, 'ProgressNotice',
                        false, function (scriptComp: ProgressNotice) {
                            //更新提示标题
                            scriptComp.updateTitle(MyGame.LanguageTool.getLanguageStr('travel_progress_notice_title'));
                            let costTime: number = MyGame.TravelModule.getTravelCostTime(MyGame.GameManager.userRole.personPos.cityId,
                                cityId);
                            MyGame.GameManager.changeGameSpeed(MyGame.QUICK_GAME_SPEED);
                            //转为分钟
                            let costTimeMinuteTotal = 0;
                            //加入回调函数
                            let userRole = MyGame.GameManager.userRole;
                            let travelUpdateFuncId = userRole.addOneFunction(function (personData: UserRole, addMinute: number, data: any) {
                                if (costTimeMinuteTotal < costTime) {
                                    costTimeMinuteTotal = costTimeMinuteTotal + addMinute;
                                    //更新进度
                                    scriptComp.updateProgressNum(costTimeMinuteTotal / costTime);
                                    personData.changePowerNum(-1 * MyGame.MAP_MOVE_COST_POWER_MINUTE * addMinute);
                                    if (costTimeMinuteTotal >= costTime) {
                                        personData.setPersonCityPos(cityId);
                                        //清除掉这个回调
                                        personData.removeOneFunctionById(travelUpdateFuncId);
                                        //恢复运行速度
                                        MyGame.GameManager.gameSpeedResetting();
                                        scriptComp.hide(false);
                                    }
                                } else {
                                    //清除回调
                                    personData.removeOneFunctionById(travelUpdateFuncId);
                                    scriptComp.hide(false);
                                }
                            }.bind(this), undefined);
                        }, undefined, 100);
                }
                break;
        }
    }
}