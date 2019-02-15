import { MyGame } from "../../Tool/System/Game";
import AskNumBox from "../Prefab/AskNumBox_script";
import { Person } from "../../Data/PersonFactory";
import SureNoticeBox from "../Prefab/SureNoticeBox_script";

/**
 * 确认提示框
 */
export interface SureNoticeBoxButtonData {
    //按钮显示的文本
    label: string,
    //按钮Node绑定的数据
    data: any,
    //按钮的回调函数
    func: Function,
};

/**
 * 在指定结点下增加一个用户状态栏
 * @param node 
 * @param x 新的位置
 * @param y 新的位置
 */
export function addUserStateNode(node: cc.Node, x: number, y: number, successCb: Function) {
    MyGame.PrefabManager.loadPrefab('Prefab/Normal/UserState', function (prefab) {
        let newNode: cc.Node = cc.instantiate(prefab);
        MyGame.PrefabManager.addPrefabNode('Prefab/Normal/UserState', newNode);
        node.addChild(newNode);
        newNode.setPosition(x, y);
        //初始化
        newNode.name = 'UserState';
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

/**
 * 创建一个人物雇佣结点
 * @param personData 
 */
export function createPersonHireNode(personData: Person): cc.Node {
    var personHirePrefab = MyGame.PrefabManager.getPrefab('Prefab/Item/PersonHireNode');
    if (!personHirePrefab) {
        return;
    }
    let personHireNode = cc.instantiate(personHirePrefab);
    MyGame.GameSceneManager.getScriptComp(personHireNode).updatePersonHireNodeData(personData);
    return personHireNode;
}

/**
 * 创建一个要求输入数量的结点
 * @param askLabel 显示的文本
 * @param noticeLabel 提示的文本，一般是显示最大数量
 * @param maxNum 最大数量
 * @param startNum 起始数量
 * @param onceAddNum 每次修改的数量
 * @param sureCb 确定的回调
 */
export function showAskTimeNode(askLabel: string, noticeLabel: string, maxNum: number,
    startNum: number = 0, onceAddNum: number, sureCb: Function) {
    MyGame.GameSceneManager.addNode('Prefab/Notice/AskNumBox', MyGame.GAME_SCENE_ALERT_NODE, 'AskNumBox',
        false, function (scriptComp: AskNumBox) {
            scriptComp.showMsg(askLabel, noticeLabel, maxNum, startNum, onceAddNum, sureCb);
        }, undefined, 100);
}

export function showItemScrollView(lineShowItemNum: number, itemObj: { [itemId: number]: number },
    itemListScrollViewNode: cc.Node, itemListScrollViewTmpNode: cc.Node, itemListNodePool: cc.NodePool) {
    //组装参数给scrollviewTool使用
    let dataArr = [];
    let count = 0;
    for (var key in itemObj) {
        if (!itemObj.hasOwnProperty(key)) {
            continue;
        }
        if (!itemObj[key]) {
            continue;
        }
        let index = Math.floor(count / lineShowItemNum);
        if (!dataArr[index]) {
            dataArr.push([]);
        }
        dataArr[index].push({
            number: itemObj[key],
            data: MyGame.JsonDataTool.getDataById('_table_item_sellGood', parseInt(key)),
            id: parseInt(key)
        });
    }
    //显示list
    MyGame.ScrollViewTool.buildScrollView(itemListScrollViewNode, MyGame.ScrollViewTool.SCROLL_TYPE_VERTICAL,
        itemListScrollViewTmpNode, function (childNode: cc.Node, data: any[]) {
            let i: number;
            //隐藏多余节点
            childNode.children.forEach(function (node: cc.Node, index) {
                node.active = index < data.length;
            });
            for (i = 0; i < data.length; i++) {
                let itemNode: cc.Node, itemData: any;
                itemData = {
                    number: data[i].number,
                    name: data[i].data.name,
                    id: data[i].id,
                    price: data[i].data.price
                };
                if (childNode.children[i]) {
                    itemNode = childNode.children[i];
                    MyGame.GameSceneManager.getScriptComp(itemNode).updateItemNodeData(itemData);
                } else {
                    itemNode = MyGame.UITool.createItemNode(itemData);
                    childNode.addChild(itemNode);
                    //绑定数据
                    MyGame.NodeTool.saveNodeValue(itemNode, 'itemData', itemData);
                }
                itemNode.x = (childNode.width / lineShowItemNum) * (i + 0.5);
                itemNode.y = -1 * childNode.height / 2;
            }
        }, dataArr, itemListNodePool);
}

/**
 * 创建一个确认提示框
 * @param askLabel 显示的文本
 * @param noticeLabel 提示的文本，一般是显示最大数量
 * @param maxNum 最大数量
 * @param startNum 起始数量
 * @param onceAddNum 每次修改的数量
 * @param sureCb 确定的回调
 */
export function showMakeSureNode(msgString: string, buttonDatas: SureNoticeBoxButtonData[]) {
    MyGame.GameSceneManager.addNode('Prefab/Notice/SureNoticeBox', MyGame.GAME_SCENE_ALERT_NODE, 'SureNoticeBox',
        false, function (scriptComp: SureNoticeBox) {
            scriptComp.init(msgString, buttonDatas);
        }, undefined, 100);
}