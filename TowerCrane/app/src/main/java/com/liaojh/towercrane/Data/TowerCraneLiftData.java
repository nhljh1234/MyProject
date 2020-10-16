package com.liaojh.towercrane.Data;

//起升变频器数据
public class TowerCraneLiftData {
    //运行状态
    public int runStatus = Constant.STATUS_RUN;
    //正转还是反转
    public int direction = Constant.DIRECTION_FORWARD;
    //运行赫兹
    public float frequency = 34.1f;
    //电机转速
    public int turnSpeed = 10;
    //母线电压
    public float generatrixVoltage = 500.0f;
    //输出电压
    public float outputVoltage = 500.0f;
    //输出电流
    public float outputElectricity = 10.0f;
    //温度
    public float temperature = 20.0f;
    //停车状态
    public int statusStop = Constant.STATUS_NORMAL;
    //运行状态
    public int statusRun = Constant.STATUS_NORMAL;
    //起升减速限位到
    public int upSlowDown = Constant.STATUS_NORMAL;
    //下降减速限位到
    public int downSlowDown = Constant.STATUS_NORMAL;
    //起升终点限位到
    public int upDestination = Constant.STATUS_NORMAL;
    //下降终点限位到
    public int downDestination = Constant.STATUS_NORMAL;
    //力矩110%限位到
    public int torque_110 = Constant.STATUS_NORMAL;
    //力矩100%限位到
    public int torque_100 = Constant.STATUS_NORMAL;
    //力矩90%限位到
    public int torque_90 = Constant.STATUS_NORMAL;
    //载重量100%限位到
    public int load_100 = Constant.STATUS_NORMAL;
    //载重量90%限位到
    public int load_90 = Constant.STATUS_NORMAL;
    //载重量50%限位到
    public int load_50 = Constant.STATUS_NORMAL;
    //载重量25%限位到
    public int load_25 = Constant.STATUS_NORMAL;
    //制动单元故障
    public int brakeUnit = Constant.STATUS_NORMAL;
    //制动器失效
    public int brakeLose = Constant.STATUS_NORMAL;
    //慢速运行
    public int slowDown = Constant.STATUS_NORMAL;
    //力矩80%限位到
    public int torque_80 = Constant.STATUS_NORMAL;
    //制动器未打开
    public int brakeOpen = Constant.STATUS_NORMAL;
    //限位开关屏蔽到
    public int limitSwitch = Constant.STATUS_NORMAL;
    //刹车力矩不足
    public int brakeNotEnough = Constant.STATUS_NORMAL;
    //放挂功能已启动
    public int hangOpen = Constant.STATUS_NORMAL;

    //警告码
    public int warnCode;
    //故障码
    public int errorCode;

    //运行状态
    public String getStatusRunStr() {
        return runStatus == Constant.STATUS_RUN ? "运行" : "停止";
    }
    //停车状态
    public String getStatusStopStr() {
        if (statusStop == Constant.STATUS_ERROR) {
            return "停车";
        }
        return "运行";
    }
    //母线电压
    public String getGeneratrixVoltageStr() {
        return String.format("%sV", "" + generatrixVoltage);
    }
    //输出电压
    public String getOutputVoltageStr() {
        return String.format("%sV", "" + outputElectricity);
    }
    //输出电流
    public String getOutputElectricityStr() {
        return String.format("%sV", "" + outputElectricity);
    }
    //运行频率
    public String getRunFrequencyStr() {
        return String.format("%sHz", "" + frequency);
    }
    //电机转速
    public String getTurnSpeedStr() {
        return String.format("%sRPM", "" + turnSpeed);
    }
    //获取变温器温度
    public String getTemperatureStr() {
        return String.format("%s℃", "" + temperature);
    }

    //检测相关
    //上升减速限位
    public Boolean judgeUpSlowDownIsWaring() {
        return upSlowDown == Constant.STATUS_ERROR;
    }
    //下降减速限位
    public Boolean judgeDownSlowDownIsWaring() {
        return downSlowDown == Constant.STATUS_ERROR;
    }
    //上升终点限位
    public Boolean judgeUpDestinationIsWaring() {
        return upDestination == Constant.STATUS_ERROR;
    }
    //下降终点限位
    public Boolean judgeDownDestinationIsWaring() {
        return downDestination == Constant.STATUS_ERROR;
    }
    //载重量100%限位
    public Boolean judgeLoadIsWaring_100() {
        return load_100 == Constant.STATUS_ERROR;
    }
    //载重量90%限位
    public Boolean judgeLoadIsWaring_90() {
        return load_90 == Constant.STATUS_ERROR;
    }
    //载重量50%限位
    public Boolean judgeLoadIsWaring_50() {
        return load_50 == Constant.STATUS_ERROR;
    }
    //载重量25%限位
    public Boolean judgeLoadIsWaring_25() {
        return load_25 == Constant.STATUS_ERROR;
    }
    //制动单元故障
    public Boolean judgeBrakeUnitIsWaring() {
        return brakeUnit == Constant.STATUS_ERROR;
    }
    //制动器失效
    public Boolean judgeBrakeLoseIsWaring() {
        return brakeLose == Constant.STATUS_ERROR;
    }
    //慢速运行
    public Boolean judgeRunSlowDownIsWaring() {
        return slowDown == Constant.STATUS_ERROR;
    }
    //制动器未打开
    public Boolean judgeBrakeOpenIsWaring() {
        return brakeOpen == Constant.STATUS_ERROR;
    }
    //限位开关屏蔽
    public Boolean judgeLimitSwitchIsWaring() {
        return limitSwitch == Constant.STATUS_ERROR;
    }

    public String getWarnOrErrorStr() {
        String str = null;
        str = Constant.ERROR_CODE.get("E_" + errorCode);
        if (str == null) {
            str = Constant.ERROR_CODE.get("W_" + warnCode);
        } else {
            str = str + "(" + "E_" + errorCode + ")";
        }
        if (str == null) {
            str = "";
        } else {
            str = str + "(" + "W_" + warnCode + ")";
        }
        return str;
    }
}
