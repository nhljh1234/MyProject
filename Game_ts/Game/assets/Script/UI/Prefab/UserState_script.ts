import BaseUI from "../Base/BaseUI";
import { MyGame } from "../../Tool/System/Game";
import { addUpdateFunc, removeUpdateFunc } from "../base/UITimerTool";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UserState extends BaseUI {

    _uiName: string = 'UserState';


    @property(cc.Label)
    userNameLabel: cc.Label = undefined;
    @property(cc.Label)
    cityNameLabel: cc.Label = undefined;
    @property(cc.Label)
    timeLabel: cc.Label = undefined;
    @property(cc.Label)
    moneyLabel: cc.Label = undefined;
    @property(cc.Node)
    powerProgressNode: cc.Node = undefined;

    onLoad() {
        super.onLoad();
        MyGame.EventManager.on(MyGame.EventName.USER_ROLE_STATUS_CHANGE, this.updateUserStateEventCb, this);
    }

    update(dt) {
        super.update(dt);

    }

    //onLoad super的时候会调用，在onShow之前
    onUIInit() {
        super.onUIInit();

    }

    //结点active的时候会调用
    onShow() {
        super.onShow();

    }

    //隐藏界面，deleteFlag表示是否删除
    hide(deleteFlag) {
        super.hide(deleteFlag);

    }

    onDestroy() {
        super.onDestroy();
        MyGame.EventManager.off(MyGame.EventName.USER_ROLE_STATUS_CHANGE, this.updateUserStateEventCb);
    }

    onButtonClick(name: string, node: cc.Node, component: cc.Component) {
        switch (name) {

        }
    }

    updateUserName() {
        this.userNameLabel.string = MyGame.GameManager.userRole.name;
    }

    updateUserCityPos() {
        let nowCityData = MyGame.GameManager.gameDataSave.getCityById(MyGame.GameManager.userRole.personPos.cityId);
        this.cityNameLabel.string = nowCityData.cityName;
    }

    updateTime() {
        this.timeLabel.string = MyGame.TimeTool.getTimeStrWithEra(
            MyGame.GameManager.gameDataSave.nowTimeYear,
            MyGame.GameManager.gameDataSave.nowTimeMonth,
            MyGame.GameManager.gameDataSave.nowTimeDay,
            MyGame.GameManager.gameDataSave.nowTimeHour,
            MyGame.GameManager.gameDataSave.nowTimeMinute
        );
    }

    updateUserMoney() {
        this.moneyLabel.string = `${MyGame.GameManager.userRole.money}G`;
    }

    /**
     * 更新一次体力信息
     * 因为动画的存在可能会更新很多次，抽取出来用比较方便
     * @param power 
     */
    updateUserPowerOnce(power: number, progressNode: cc.Node) {
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
    progressAniUpdate(data: any, dt: number) {
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
            removeUpdateFunc(this.progressAniUpdate, data);
        }
        this.updateUserPowerOnce(nowProgressNum * MyGame.MAX_POWER, data.progressNode);
    }

    /**
     * @param userStateNode 
     * @param showAniFlag 是否播放动画
     */
    updateUserPower(showAniFlag: boolean) {
        //判断值是否相同，相同的话就不调用了
        if (MyGame.Tool.equalNum(this.powerProgressNode.getComponent(cc.ProgressBar).progress, MyGame.GameManager.userRole.power / MyGame.MAX_POWER)) {
            return;
        }
        if (!showAniFlag) {
            //直接设置值
            this.updateUserPowerOnce(MyGame.GameManager.userRole.power, this.powerProgressNode);
            return;
        }

        //越大播放越快
        const SHOW_SPEED = 0.3 * MyGame.GameManager.gameSpeed;
        addUpdateFunc(this.progressAniUpdate, {
            progressNode: this.powerProgressNode,
            oneSecondAddNum: SHOW_SPEED,
        }, this);
    }

    updateUserState(showAniFlag: boolean = true) {
        this.updateUserName();
        this.updateUserCityPos();
        this.updateTime();
        this.updateUserMoney();
        this.updateUserPower(showAniFlag);
    }

    updateUserStateEventCb() {
        this.updateUserState(true);
    }
}