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
 * @param prefabPath 预制件的路径
 * @param parentNodeType 所加入的节点的类型
 * @param addMoreFlag 是否允许添加多个结点，默认一个名字的结点只能添加一次
 * @param nodeName 新节点的名字
 * @param successCb
 * @param failCb
 */
outModule.addNode = (prefabPath, parentNodeType, nodeName, addMoreFlag, successCb, failCb) => {
    //要加入到的结点
    let parentNode;
    //确定要加入的结点
    switch (parentNodeType) {
        case g_GAME_SCENE_UI_NODE:
            parentNode = g_GameScene ? g_GameScene.UINode : undefined;
            break;
        case g_GAME_SCENE_ALERT_NODE:
            parentNode = g_GameScene ? g_GameScene.AlertNode : undefined;
            break;
        case g_GAME_SCENE_NET_NODE:
            parentNode = g_GameScene ? g_GameScene.NetNode : undefined;
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
            if (node._components) {
                node._components.forEach(function (oneComponent) {
                    if (oneComponent && oneComponent.onShow) {
                        oneComponent.onShow();
                    }
                });
            }
            if (successCb) {
                successCb();
            }
            return;
        } else {
            //直接复制一个
            let newNode = cc.instantiate(node);
            newNode.name = nodeName;
            parentNode.addChild(newNode);
            if (successCb) {
                successCb();
            }
            return;
        }
    }
    //判断有没有这个结点
    g_PrefabManager.loadPrefab(prefabPath, (prefab) => {
        var node = cc.instantiate(prefab);
        node.name = nodeName;
        parentNode.addChild(node);
        if (successCb) {
            successCb();
        }
    }, (err) => {
        //失败回调
        if (failCb) {
            failCb(err);
        }
    });
};

module.exports = outModule;