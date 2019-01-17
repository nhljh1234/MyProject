import { MyGame } from "../../Tool/System/Game";

export function createItemNode(itemData: any): cc.Node {
    var itemPrefab = MyGame.PrefabManager.getPrefab('Prefab/Item/Item');
    if (!itemPrefab) {
        return;
    }
    let itemNode = cc.instantiate(itemPrefab);
    updateItemNodeData(itemData, itemNode);
    return itemNode;
}

export function updateItemNodeData(itemData: any, itemNode: cc.Node) {
    itemNode.getChildByName('num').getComponent(cc.Label).string = itemData.number;
    itemNode.getChildByName('name').getComponent(cc.Label).string = itemData.name;
}