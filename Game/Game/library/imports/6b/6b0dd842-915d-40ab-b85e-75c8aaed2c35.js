"use strict";
cc._RF.push(module, '6b0ddhCkV1Aq7hedciq7Sw1', 'ScrollViewTool');
// Script/UI/Base/ScrollViewTool.js

'use strict';

/*global module, require, cc, client */
/**
 * @desc 模块描述
 * @author Administrator
 */
var outModule = {};

//水平
outModule.SCROLL_TYPE_HORIZONTAL = 1;
//垂直
outModule.SCROLL_TYPE_VERTICAL = 2;
outModule.SCROLL_TYPE_BOTH = 3;

/**
 * 构建一个ScrollView
 * @param scrollViewNode
 * @param scrollType
 * @param tmpNode
 * @param buildFunc
 * @param dataArr 数据数组，会按照数据数量来生成子节点的数量
 * @param nodePool 节点池
 */
outModule.buildScrollView = function (scrollViewNode, scrollType, tmpNode, buildFunc, dataArr, nodePool) {
    if (!scrollViewNode) {
        return;
    }
    var scrollViewComponent = scrollViewNode.getComponent(cc.ScrollView);
    if (!scrollViewComponent) {
        return;
    }
    if (!tmpNode) {
        return;
    }
    var contentNode = scrollViewComponent.content;
    if (!contentNode) {
        //cc.ScrollView没有绑定对应的显示内容的节点
        g_LogTool.showLog('buildScrollView: contentNode is null');
        return;
    }
    //设定滑动类型
    switch (scrollType) {
        case outModule.SCROLL_TYPE_HORIZONTAL:
            scrollViewComponent.horizontal = true;
            scrollViewComponent.vertical = false;
            break;
        case outModule.SCROLL_TYPE_VERTICAL:
            scrollViewComponent.horizontal = false;
            scrollViewComponent.vertical = true;
            break;
        case outModule.SCROLL_TYPE_BOTH:
            scrollViewComponent.horizontal = true;
            scrollViewComponent.vertical = true;
            break;
    }
    var childrenCount = contentNode.childrenCount;
    var showCount = dataArr.length;
    //补充节点
    while (childrenCount < showCount) {
        var newItemNode = void 0;
        if (nodePool.size() > 0) {
            newItemNode = nodePool.get();
        } else {
            newItemNode = cc.instantiate(tmpNode);
        }
        contentNode.addChild(newItemNode);
        childrenCount++;
    }
    //推送多余节点进入节点池
    var putArr = [];
    while (childrenCount > showCount) {
        putArr.push(contentNode.children[childrenCount]);
        childrenCount--;
    }
    putArr.forEach(function (node) {
        nodePool.put(node);
    });
    //更新节点
    var firstChildNode = contentNode.children[0];
    contentNode.children.forEach(function (childNode, index) {
        if (index >= showCount) {
            childNode.active = false;
            return;
        }
        childNode.active = true;
        if (scrollType === outModule.SCROLL_TYPE_HORIZONTAL) {
            childNode.x = firstChildNode.x + index * tmpNode.width;
        } else if (scrollType === outModule.SCROLL_TYPE_VERTICAL) {
            childNode.y = firstChildNode.y - index * tmpNode.height;
        }
        if (buildFunc) {
            buildFunc(childNode, dataArr[index]);
        }
    });
    //更新contentNode尺寸
    if (scrollType === outModule.SCROLL_TYPE_HORIZONTAL) {
        contentNode.width = tmpNode.width * showCount;
    } else if (scrollType === outModule.SCROLL_TYPE_VERTICAL) {
        contentNode.height = tmpNode.height * showCount;
    }
};

module.exports = outModule;

cc._RF.pop();