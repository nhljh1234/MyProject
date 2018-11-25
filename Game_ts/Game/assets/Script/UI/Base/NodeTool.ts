let nodeDataSave: { [num: number]: { [key: string]: any } } = {};

/**
 * 占用node的tag属性存储一些数据
 * @param node 
 * @param key 
 * @param value 
 */
export function saveNodeValue (node: cc.Node, key: string, value: any) {
    if (!nodeDataSave[node.uuid]) {
        nodeDataSave[node.uuid] = {};
    }
    nodeDataSave[node.uuid][key] = value;
}

export function getNodeValue (node: cc.Node, key: string) {
    if (!nodeDataSave[node.uuid]) {
        return undefined;
    }
    return nodeDataSave[node.uuid][key];
}