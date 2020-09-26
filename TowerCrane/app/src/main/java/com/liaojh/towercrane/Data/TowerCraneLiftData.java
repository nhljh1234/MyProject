package com.liaojh.towercrane.Data;

//起升变频器数据
public class TowerCraneLiftData {
    //运行状态
    public String getStatusStr() {
        return "停止";
    }
    //刹车制动力检测
    public String getBrakeCheckStr() {
        return "力矩异常";
    }
    //母线电压
    public String getGeneratrixVoltageStr() {
        return "500.0V";
    }
    //输出电压
    public String getOutputVoltageStr() {
        return "100.0V";
    }
    //输出电流
    public String getOutputElectricityStr() {
        return "10.0A";
    }
    //运行频率
    public String getRunFrequencyStr() {
        return "30.0Hz";
    }
    //电机转速
    public String getTurnSpeedStr() {
        return "20RPM";
    }
    //获取变温器温度
    public String getTemperatureStr() {
        return "36.0°C";
    }

    //运行状态
    public Boolean judgeStatusIsWaring() {
        return Math.random() > 0.5;
    }
    //刹车制动力检测
    public Boolean judgeBrakeCheckIsWaring() {
        return Math.random() > 0.5;
    }
    //母线电压
    public Boolean judgeGeneratrixVoltageIsWaring() {
        return Math.random() > 0.5;
    }
    //输出电压
    public Boolean judgeOutputVoltageIsWaring() {
        return Math.random() > 0.5;
    }
    //输出电流
    public Boolean judgeOutputElectricityIsWaring() {
        return Math.random() > 0.5;
    }
    //运行频率
    public Boolean judgeRunFrequencyIsWaring() {
        return Math.random() > 0.5;
    }
    //电机转速
    public Boolean judgeTurnSpeedIsWaring() {
        return Math.random() > 0.5;
    }
    //获取变温器温度
    public Boolean judgeTemperatureIsWaring() {
        return Math.random() > 0.5;
    }

    public Boolean judgeCommunicationIsWaring() {
        return Math.random() > 0.5;
    }

    //检测相关
    //上升减速限位
    public Boolean judgeUpSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
    //下降减速限位
    public Boolean judgeDownSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
    //上升终点限位
    public Boolean judgeUpDestinationIsWaring() {
        return Math.random() > 0.5;
    }
    //下降终点限位
    public Boolean judgeDownDestinationIsWaring() {
        return Math.random() > 0.5;
    }
    //载重量100%限位
    public Boolean judgeLoadIsWaring_100() {
        return Math.random() > 0.5;
    }
    //载重量90%限位
    public Boolean judgeLoadIsWaring_90() {
        return Math.random() > 0.5;
    }
    //载重量50%限位
    public Boolean judgeLoadIsWaring_50() {
        return Math.random() > 0.5;
    }
    //载重量25%限位
    public Boolean judgeLoadIsWaring_25() {
        return Math.random() > 0.5;
    }
    //制动单元故障
    public Boolean judgeBrakeUnitIsWaring() {
        return Math.random() > 0.5;
    }
    //制动器失效
    public Boolean judgeBrakeIsWaring() {
        return Math.random() > 0.5;
    }
    //慢速运行
    public Boolean judgeRunSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
    //制动器未打开
    public Boolean judgeBrakeOpenIsWaring() {
        return Math.random() > 0.5;
    }
    //限位开关屏蔽
    public Boolean judgeLimitSwitchIsWaring() {
        return Math.random() > 0.5;
    }
}
