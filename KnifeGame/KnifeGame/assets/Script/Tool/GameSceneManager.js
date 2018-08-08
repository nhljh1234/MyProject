/*global module, require, cc, client */
/**
 * @desc Game场景管理器，Game场景里面有三个根节点
 * UINode:所有的UI界面放在这个下面
 * AlertNode:所有的提示界面
 * NetNode:网络延迟转圈界面
 * @author Administrator
 */
var outModule = {};

/**
 * 加载一个预制体增加到Game场景下三个根节点中
 * @param prefabPath
 * @param parentNodeType
 * @param addMoreFlag 是否允许添加多个结点，默认一个名字的结点只能添加一次
 * @param nodeName
 * @param deleteFlag
 * @param successCb
 * @param failCb
 */
outModule.addNode = (prefabPath, parentNodeType, nodeName, addMoreFlag, deleteFlag, successCb, failCb) => {
    //要加入到的结点
    let parentNode;
    //确定要加入的结点
    switch (parentNodeType) {
        case window.Global.GAME_SCENE_UI_NODE:
            parentNode = window.Global.GameScene ? window.Global.GameScene.UINode : undefined;
            break;
        case window.Global.GAME_SCENE_ALERT_NODE:
            parentNode = window.Global.GameScene ? window.Global.GameScene.AlertNode : undefined;
            break;
        case window.Global.GAME_SCENE_NET_NODE:
            parentNode = window.Global.GameScene ? window.Global.GameScene.NetNode : undefined;
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
            if (successCb) {
                successCb();
            }
            return;
        }
    }
    //判断有没有这个结点
    window.Global.PrefabManager.loadPrefab(prefabPath, deleteFlag, (prefab) => {
        var node = cc.instantiate(prefab);
        node.name = nodeName;
        parentNode.addChild(node);
    }, (err) => {
        //失败回调
        if (failCb) {
            failCb(err);
        }
    });
};

module.exports = outModule;