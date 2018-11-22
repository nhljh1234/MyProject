let tagId: number = 1;
let nodeDataSave: { [num: number]: { [key: string]: any } } = {};

/**
 * 占用node的tag属性存储一些数据
 * @param node 
 * @param key 
 * @param value 
 */
export function saveNodeValue (node: cc.Node, key: string, value: any) {
    if (!nodeDataSave[node.tag]) {
        node.tag = tagId;
        tagId++;
    }
    nodeDataSave[node.tag][key] = value;
}

export function getNodeValue (node: cc.Node, key: string) {
    if (!nodeDataSave[node.tag]) {
        return undefined;
    }
    return nodeDataSave[node.tag][key];
}