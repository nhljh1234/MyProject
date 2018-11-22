import HistroyGame = require('../../Tool/System/Game');
/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */

//水平
export const SCROLL_TYPE_HORIZONTAL: number = 1;
//垂直
export const SCROLL_TYPE_VERTICAL: number = 2;
export const SCROLL_TYPE_BOTH: number = 3;

/**
 * 构建一个ScrollView
 * @param scrollViewNode
 * @param scrollType
 * @param tmpNode
 * @param buildFunc
 * @param dataArr 数据数组，会按照数据数量来生成子节点的数量
 * @param nodePool 节点池
 */
export function buildScrollView(scrollViewNode: cc.Node, scrollType: number, tmpNode: cc.Node, buildFunc: Function, dataArr: any[], nodePool: cc.NodePool) {
    if (!scrollViewNode) {
        return;
    }
    let scrollViewComponent = scrollViewNode.getComponent(cc.ScrollView);
    if (!scrollViewComponent) {
        return;
    }
    if (!tmpNode) {
        return;
    }
    let contentNode = scrollViewComponent.content;
    if (!contentNode) {
        //cc.ScrollView没有绑定对应的显示内容的节点
        HistroyGame.LogTool.showLog('buildScrollView: contentNode is null');
        return;
    }
    //设定滑动类型
    switch (scrollType) {
        case SCROLL_TYPE_HORIZONTAL:
            scrollViewComponent.horizontal = true;
            scrollViewComponent.vertical = false;
            break;
        case SCROLL_TYPE_VERTICAL:
            scrollViewComponent.horizontal = false;
            scrollViewComponent.vertical = true;
            break;
        case SCROLL_TYPE_BOTH:
            scrollViewComponent.horizontal = true;
            scrollViewComponent.vertical = true;
            break;
    }
    let childrenCount = contentNode.childrenCount;
    let showCount = dataArr.length;
    //补充节点
    while (childrenCount < showCount) {
        let newItemNode;
        if (nodePool.size() > 0) {
            newItemNode = nodePool.get();
        } else {
            newItemNode = cc.instantiate(tmpNode);
        }
        contentNode.addChild(newItemNode);
        childrenCount++;
    }
    //推送多余节点进入节点池
    let putArr = [];
    while (childrenCount > showCount) {
        putArr.push(contentNode.children[childrenCount]);
        childrenCount--;
    }
    putArr.forEach(function (node) {
        nodePool.put(node);
    });
    //更新节点
    let firstChildNode = contentNode.children[0];
    contentNode.children.forEach((childNode, index) => {
        if (index >= showCount) {
            childNode.active = false;
            return;
        }
        childNode.active = true;
        if (scrollType === SCROLL_TYPE_HORIZONTAL) {
            childNode.x = firstChildNode.x + index * tmpNode.width;
        } else if (scrollType === SCROLL_TYPE_VERTICAL) {
            childNode.y = firstChildNode.y - index * tmpNode.height;
        }
        if (buildFunc) {
            buildFunc(childNode, dataArr[index]);
        }
    });
    //更新contentNode尺寸
    if (scrollType === SCROLL_TYPE_HORIZONTAL) {
        contentNode.width = tmpNode.width * showCount;
    } else if (scrollType === SCROLL_TYPE_VERTICAL) {
        contentNode.height = tmpNode.height * showCount;
    }
};
