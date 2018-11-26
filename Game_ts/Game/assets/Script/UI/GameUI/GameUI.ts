import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { getUpdateFunc } from "../Base/UITimerTool";
import { addUserStateNode } from "../Normal/UserStateUITool";

const { ccclass, property } = cc._decorator;

@ccclass
class GameUI extends BaseUI {

    _uiName: string = 'GameUI';

    onLoad() {
        super.onLoad();
    }

    update(dt) {
        super.update(dt);

        getUpdateFunc().forEach(function (oneUpdateFuncData) {
            oneUpdateFuncData.func.call(oneUpdateFuncData.thisObj, oneUpdateFuncData.data, dt);
        });
    }

    onUIInit() {
        super.onUIInit();
        MyGame.GameSceneUINode = this.node.getChildByName("UINode");
        MyGame.GameSceneAlertNode = this.node.getChildByName("AlertNode");
        MyGame.GameSceneNetNode = this.node.getChildByName("NetNode");
    }

    onShow() {
        super.onShow();
        if (MyGame.GameSaveTool.useGameSaveData()) {
            //g_GameGlobalManager.init(this, g_GameGlobalManager.gameData);
        } else {
            //g_GameGlobalManager.userRole = UserRoleFactory.createUserRole(undefined, undefined);
            //MyGame.GameManager.init(this, new Game(undefined, 7, 13));
            //先显示新建角色的名字
            MyGame.GameSceneManager.addNode('Prefab/User/UserBuildUI', MyGame.GAME_SCENE_UI_NODE, 'UserBuildUI',
                false, undefined, undefined, 100);
        }
        MyGame.GameManager.start();
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {

    }
}