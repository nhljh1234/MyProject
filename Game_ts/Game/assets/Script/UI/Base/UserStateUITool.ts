import { MyGame } from "../../Tool/System/Game";
import { addUpdateFunc, removeUpdateFunc } from "./UITimerTool";

function updateUserName(userStateNode: cc.Node) {
    userStateNode.getChildByName('user_name').getComponent(cc.Label).string = MyGame.GameManager.userRole.name;
}

function updateUserCityPos(userStateNode: cc.Node) {
    let nowCityData = MyGame.GameManager.gameDataSave.getCityById(MyGame.GameManager.userRole.personPos.cityId);
    userStateNode.getChildByName('city_name').getComponent(cc.Label).string = nowCityData.cityName;
}

function updateTime(userStateNode: cc.Node) {
    userStateNode.getChildByName('time').getComponent(cc.Label).string = MyGame.TimeTool.getTimeStrWithEra(
        MyGame.GameManager.gameDataSave.nowTimeYear,
        MyGame.GameManager.gameDataSave.nowTimeMonth,
        MyGame.GameManager.gameDataSave.nowTimeDay,
        MyGame.GameManager.gameDataSave.nowTimeHour,
        MyGame.GameManager.gameDataSave.nowTimeMinute
    );
}

function updateUserMoney(userStateNode: cc.Node) {
    userStateNode.getChildByName('money').getComponent(cc.Label).string = `${MyGame.GameManager.userRole.money}G`;
}

/**
 * 更新一次体力信息
 * 因为动画的存在可能会更新很多次，抽取出来用比较方便
 * @param power 
 */
function updateUserPowerOnce(power: number, progressNode: cc.Node) {
    let progress = power / MyGame.MAX_POWER;
    let progressLabelNode = progressNode.getChildByName('power_label');
    //进度值
    progressNode.getComponent(cc.ProgressBar).progress = progress;
    //数值
    progressLabelNode.getComponent(cc.Label).string = `${Math.ceil(power)}/${MyGame.MAX_POWER}`;
}

/**
 * 进度条动画
 * @param data
 * @param dt 运行的时间
 */
function progressAniUpdate(data: any, dt: number) {
    let lastProgressNum = data.progressNode.getComponent(cc.ProgressBar).progress;
    //目标值
    let goalProgressNum = MyGame.GameManager.userRole.power / MyGame.MAX_POWER;
    //计算正负值
    let flagNum = lastProgressNum >= goalProgressNum ? -1 : 1;
    let nowProgressNum = lastProgressNum + dt * data.oneSecondAddNum * flagNum;
    if ((lastProgressNum >= goalProgressNum && nowProgressNum <= goalProgressNum) ||
        (lastProgressNum <= goalProgressNum && nowProgressNum >= goalProgressNum)) {
        nowProgressNum = goalProgressNum;
        //清除掉回调
        removeUpdateFunc(progressAniUpdate, data);
    }
    updateUserPowerOnce(nowProgressNum * MyGame.MAX_POWER, data.progressNode);
}

/**
 * @param userStateNode 
 * @param showAniFlag 是否播放动画
 */
function updateUserPower(userStateNode: cc.Node, showAniFlag: boolean) {
    let progressNode = userStateNode.getChildByName('power');
    //判断值是否相同，相同的话就不调用了
    if (MyGame.Tool.equalNum(progressNode.getComponent(cc.ProgressBar).progress, MyGame.GameManager.userRole.power / MyGame.MAX_POWER)) {
        return;
    }
    if (!showAniFlag) {
        //直接设置值
        updateUserPowerOnce(MyGame.GameManager.userRole.power, progressNode);
        return;
    }

    //越大播放越快
    const SHOW_SPEED = 0.3 * MyGame.GameManager.gameSpeed;
    addUpdateFunc(progressAniUpdate, {
        progressNode: progressNode,
        oneSecondAddNum: SHOW_SPEED,
    }, this);
}

export function updateUserState(userStateNode: cc.Node, showAniFlag: boolean = true) {
    updateUserName(userStateNode);
    updateUserCityPos(userStateNode);
    updateTime(userStateNode);
    updateUserMoney(userStateNode);
    updateUserPower(userStateNode, showAniFlag);
}

/**
 * 在指定结点下增加一个用户状态栏
 * @param node 
 * @param x 新的位置
 * @param y 新的位置
 * @param roleUpdateCb 人物信息改变的回调，这边会一起绑定
 * @param thisObj this作用域
 */
export function addUserStateNode(node: cc.Node, x: number, y: number, roleUpdateCb: Function, thisObj: any) {
    MyGame.PrefabManager.loadPrefab('Prefab/Normal/UserState', function (prefab) {
        let newNode: cc.Node = cc.instantiate(prefab);
        MyGame.PrefabManager.addPrefabNode('Prefab/Normal/UserState', newNode);
        node.addChild(newNode);
        newNode.setPosition(x, y);
        //初始化
        newNode.name = 'UserState';
        if (roleUpdateCb) {
            MyGame.EventManager.on(MyGame.EventName.USER_ROLE_STATUS_CHANGE, roleUpdateCb, thisObj);
        }
        updateUserState(newNode, false);
    }, undefined, undefined);
}