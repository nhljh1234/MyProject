import { MyGame } from "../../Tool/System/Game";
import AskNumBox from "../Prefab/AskNumBox_script";


/**
 * 在指定结点下增加一个用户状态栏
 * @param node 
 * @param x 新的位置
 * @param y 新的位置
 */
export function addUserStateNode(node: cc.Node, x: number, y: number, successCb: Function) {
    MyGame.PrefabManager.loadPrefab('Prefab/Normal/UserState', function (prefab) {
        let newNode: cc.Node = cc.instantiate(prefab);
        MyGame.PrefabManager.addPrefabNode('Prefab/Normal/UserState', newNode);
        node.addChild(newNode);
        newNode.setPosition(x, y);
        //初始化
        newNode.name = 'UserState';
        let scriptComp = MyGame.GameSceneManager.getScriptComp(newNode);
        scriptComp.updateUserState(false);
        if (successCb) {
            successCb(scriptComp);
        }
    }, undefined, undefined);
}

/**
 * 创建一个物品结点
 * @param itemData 
 */
export function createItemNode(itemData: any): cc.Node {
    var itemPrefab = MyGame.PrefabManager.getPrefab('Prefab/Item/ItemNode');
    if (!itemPrefab) {
        return;
    }
    let itemNode = cc.instantiate(itemPrefab);
    MyGame.GameSceneManager.getScriptComp(itemNode).updateItemNodeData(itemData);
    return itemNode;
}

/**
 * 创建一个要求输入的结点
 * @param askLabel 显示的文本
 * @param noticeLabel 提示的文本，一般是显示最大数量
 * @param maxNum 最大数量
 * @param startNum 起始数量
 * @param onceAddNum 每次修改的数量
 * @param sureCb 确定的回调
 */
export function showAskTimeNode(askLabel: string, noticeLabel: string, maxNum: number,
    startNum: number = 0, onceAddNum: number, sureCb: Function) {
    MyGame.GameSceneManager.addNode('Prefab/Notice/AskNumBox', MyGame.GAME_SCENE_ALERT_NODE, 'AskNumBox',
        false, function (scriptComp: AskNumBox) {
            scriptComp.showMsg(askLabel, noticeLabel, maxNum, startNum, onceAddNum, sureCb);
        }, undefined, 100);
}