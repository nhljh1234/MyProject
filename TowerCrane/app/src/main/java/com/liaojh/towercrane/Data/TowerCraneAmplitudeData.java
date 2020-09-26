package com.liaojh.towercrane.Data;

//幅度变频器数据
public class TowerCraneAmplitudeData {
    //运行状态
    public String getStatusStr() {
        return "停止";
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
    //前进减速限位
    public Boolean judgeFrontSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
    //后退减速限位
    public Boolean judgeBackSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
    //前进终点限位
    public Boolean judgeFrontDestinationIsWaring() {
        return Math.random() > 0.5;
    }
    //后退终点限位
    public Boolean judgeBackDestinationIsWaring() {
        return Math.random() > 0.5;
    }
    //力矩100%限位
    public Boolean judgeTorqueIsWaring_100() {
        return Math.random() > 0.5;
    }
    //力矩90%限位
    public Boolean judgeTorqueIsWaring_90() {
        return Math.random() > 0.5;
    }
    //力矩80%限位
    public Boolean judgeTorqueIsWaring_80() {
        return Math.random() > 0.5;
    }
    //制动单元故障
    public Boolean judgeBrakeUnitIsWaring() {
        return Math.random() > 0.5;
    }
    //慢速运行
    public Boolean judgeRunSlowDownIsWaring() {
        return Math.random() > 0.5;
    }
}
