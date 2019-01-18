import { MyGame } from "./Game";

/*global module, require, cc, client */
/**
 * @desc Game场景管理器，Game场景里面有三个根节点
 * UINode:所有的UI界面放在这个下面
 * AlertNode:所有的提示界面
 * NetNode:网络延迟转圈界面
 * @author Administrator
 */
/**
 * 加载一个预制体增加到Game场景下三个根节点中
 * @param {String} prefabPath 预制件的路径
 * @param {Number} parentNodeType 所加入的节点的类型
 * @param {Boolean} addMoreFlag 是否允许添加多个结点，默认一个名字的结点只能添加一次
 * @param {String} nodeName 新节点的名字
 * @param {Function} successCb
 * @param {Function} failCb
 * @param {Number} frequency
 */
export function addNode(prefabPath: string, parentNodeType: number, nodeName: string, addMoreFlag: boolean, successCb: Function, failCb: Function, frequency: number) {
    //要加入到的结点
    let parentNode;
    //确定要加入的结点
    switch (parentNodeType) {
        case MyGame.GAME_SCENE_UI_NODE:
            parentNode = MyGame.GameSceneUINode || undefined;
            break;
        case MyGame.GAME_SCENE_ALERT_NODE:
            parentNode = MyGame.GameSceneAlertNode || undefined;
            break;
        case MyGame.GAME_SCENE_NET_NODE:
            parentNode = MyGame.GameSceneNetNode || undefined;
            break;
    }
    if (!parentNode) {
        return;
    }
    //判断有没有同名的结点
    let node = parentNode.getChildByName(nodeName);
    if (node) {
        if (!addMoreFlag) {
            //不允许添加多个的时候，把这个结点置顶并显示
            node.removeFromParent(false);
            parentNode.addChild(node);
            node.active = true;
            //判断有没有onShow函数
            let scriptComp = getScriptComp(node);
            if (scriptComp && scriptComp.onShow) {
                scriptComp.onShow();
            }
            if (successCb) {
                successCb(scriptComp);
            }
        } else {
            //直接复制一个
            let newNode = cc.instantiate(node);
            newNode._tj_prefabPath = prefabPath;
            newNode.name = nodeName;
            parentNode.addChild(newNode);
            MyGame.PrefabManager.addPrefabNode(prefabPath, newNode);
            if (successCb) {
                successCb(getScriptComp(node));
            }
        }
        return;
    }
    //判断有没有这个结点
    MyGame.PrefabManager.loadPrefab(prefabPath, (prefab) => {
        var node = cc.instantiate(prefab);
        node._tj_prefabPath = prefabPath;
        node.name = nodeName;
        parentNode.addChild(node);
        MyGame.PrefabManager.addPrefabNode(prefabPath, node);
        if (successCb) {
            successCb(getScriptComp(node));
        }
    }, (err) => {
        //失败回调
        if (failCb) {
            failCb(err);
        }
    }, frequency);
};

/**
 * 获取挂在组件上的默认脚本
 * 规定是是prefab名字 + _script
 */
export function getScriptComp (node: cc.Node) {
    return node.getComponent(`${node.name}_script`);
};