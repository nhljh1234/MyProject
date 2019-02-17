import { MyGame } from "../Tool/System/Game";

/**
 * 测试一下结点隐藏方式的效率
 * 1.设置active
 * 2.设置y坐标
 */
export function startTest(testNodeNum: number, testNode: cc.Node = new cc.Node()) {
    let nowSceneNode = cc.director.getScene();
    let i: number;
    //nowSceneNode.removeAllChildren(true);
    for (i = 0; i < testNodeNum; i++) {
        nowSceneNode.addChild(cc.instantiate(testNode));
    }

    //active测试
    MyGame.CodeRunTime.recordStartTime('active total use time');
    MyGame.CodeRunTime.recordStartTime('active hide use time');
    nowSceneNode.children.forEach(function(childNode) {
        childNode.active = false;
    });
    MyGame.CodeRunTime.printUseTime('active hide use time');
    MyGame.CodeRunTime.recordStartTime('active show use time');
    nowSceneNode.children.forEach(function(childNode) {
        childNode.active = true;
    });
    MyGame.CodeRunTime.printUseTime('active show use time');
    MyGame.CodeRunTime.printUseTime('active total use time');

    //position测试
    MyGame.CodeRunTime.recordStartTime('position total use time');
    MyGame.CodeRunTime.recordStartTime('position hide use time');
    nowSceneNode.children.forEach(function(childNode) {
        MyGame.UITool.hideNode(childNode);
    });
    MyGame.CodeRunTime.printUseTime('position hide use time');
    MyGame.CodeRunTime.recordStartTime('position show use time');
    nowSceneNode.children.forEach(function(childNode) {
        MyGame.UITool.showNode(childNode);
    });
    MyGame.CodeRunTime.printUseTime('position show use time');
    MyGame.CodeRunTime.printUseTime('position total use time');
}