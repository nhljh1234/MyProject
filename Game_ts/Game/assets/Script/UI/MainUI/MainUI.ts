import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { Game } from "../../Data/GameFactory";
import { addUserStateNode, updateUserState } from "../Normal/UserStateUITool";

const { ccclass, property } = cc._decorator;

@ccclass
class MainUI extends BaseUI {

    _uiName: string = 'MainUI';

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
        MyGame.GameManager.init(this, new Game(undefined, 7, 13));
        MyGame.GameManager.start();
    }

    hide(deleteFlag: boolean) {
        super.hide(deleteFlag);

    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {
            case 'MsgBtn':
                MyGame.GameSceneManager.addNode('Prefab/Msg/ForceListUI', MyGame.GAME_SCENE_UI_NODE, 'ForceListUI',
                    false, undefined, undefined, 100);
                return;
        }
    }

    userRoleUpdateCb() {
        updateUserState(this._topNode.getChildByName('UserState'));
    }
}