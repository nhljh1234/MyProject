package com.liaojh.towercrane.Data;

//回转变频器数据
public class TowerCraneTurnAroundData {
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
    //左旋终点限位
    public Boolean judgeLeftDestinationIsWaring() {
        return Math.random() > 0.5;
    }
    //右旋终点限位
    public Boolean judgeRightDestinationIsWaring() {
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
