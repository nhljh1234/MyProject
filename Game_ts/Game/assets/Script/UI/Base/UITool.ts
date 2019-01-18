import { MyGame } from "../../Tool/System/Game";


/**
 * 在指定结点下增加一个用户状态栏
 * @param node 
 * @param x 新的位置
 * @param y 新的位置
 * @param roleUpdateCb 人物信息改变的回调，这边会一起绑定
 * @param thisObj this作用域
 */
export function addUserStateNode(node: cc.Node, x: number, y: number, roleUpdateCb: Function, thisObj: any, successCb: Function) {
    MyGame.PrefabManager.loadPrefab('Prefab/Normal/UserState', function (prefab) {
        let newNode: cc.Node = cc.instantiate(prefab);
        MyGame.PrefabManager.addPrefabNode('Prefab/Normal/UserState', newNode);
        node.addChild(newNode);
        newNode.setPosition(x, y);
        //初始化
        newNode.name = 'UserState';
        if (roleUpdateCb) {
            MyGame.EventManager.on(MyGame.EventName.USER_ROLE_STATUS_CHANGE, roleUpdateCb, thisObj);
        }
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