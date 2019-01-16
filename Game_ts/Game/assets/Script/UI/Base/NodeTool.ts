import { MyGame } from "../../Tool/System/Game";

let nodeDataSave: { [num: number]: { [key: string]: any } } = {};

/**
 * 占用node的tag属性存储一些数据
 * @param node 
 * @param key 
 * @param value 
 */
export function saveNodeValue(node: cc.Node, key: string, value: any) {
    if (!nodeDataSave[node.uuid]) {
        nodeDataSave[node.uuid] = {};
    }
    nodeDataSave[node.uuid][key] = value;
}

export function getNodeValue(node: cc.Node, key: string) {
    if (!nodeDataSave[node.uuid]) {
        return undefined;
    }
    return nodeDataSave[node.uuid][key];
}

/**
 * 获取所有父节点缩放率总和
 */
export function getParentGlobalScale(node: cc.Node) {
    let scaleData = {
        x: 1,
        y: 1
    };
    let nowNode = node;
    while (true) {
        nowNode = nowNode.parent;
        if (!nowNode || !cc.isValid(nowNode)) {
            break;
        }
        scaleData.x = scaleData.x * nowNode.scaleX;
        scaleData.y = scaleData.y * nowNode.scaleY;
    }
    return scaleData;
}

const ADD_POS_Y = 10000;
const POS_Y_KEY = '_posY';
const HIDE_PROPERTY_KEY = '_nodeActive';

export function hideNode(node: cc.Node) {
    saveNodeValue(node, POS_Y_KEY, node.y);
    saveNodeValue(node, HIDE_PROPERTY_KEY, false);
    node.y = node.y + ADD_POS_Y / getParentGlobalScale(node).y;
}

export function showNode(node: cc.Node) {
    let posY = getNodeValue(node, POS_Y_KEY);
    if (posY === undefined) {
        MyGame.LogTool.showLog(`NodeTool showNode error !! posY is undefined`);
        return;
    }
    saveNodeValue(node, HIDE_PROPERTY_KEY, true);
    node.y = posY;
}

/**
 * 获取节点是否激活
 */
export function getNodeActive(node: cc.Node) {
    let value = getNodeValue(node, HIDE_PROPERTY_KEY);
    if (value === undefined) {
        //没有设置这个值
        return node.active;
    }
    return (!!value) && node.active;
}

/**
 * 获取节点是否在场景中激活
 */
export function getNodeActiveInHierarchy(node: cc.Node) {
    let value = getNodeValue(node, HIDE_PROPERTY_KEY);
    if (value === undefined) {
        //没有设置这个值
        return node.activeInHierarchy;
    }
    return (!!value) && node.activeInHierarchy;
}