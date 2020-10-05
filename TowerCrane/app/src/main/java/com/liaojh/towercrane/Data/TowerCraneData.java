package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.SerialPort.SerialUtil;

//塔吊自身数据
public class TowerCraneData {
    private static TowerCraneData instance;

    private TowerCraneData () {

    }

    public static TowerCraneData getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new TowerCraneData();
                }
            }
        }
        return instance;
    }

    //编号
    public String number = "0001";
    //规格
    public String specifications = "QTZ6012";
    //监控编号
    public String monitorNumber = "TT0020836";
    //倍率
    public double magnification = 2.0;

    public String getNumberStr() {
        return "塔吊编号：" + number;
    }

    public String getSpecificationsStr() {
        return "规格型号：" + specifications;
    }

    public String getMonitorNumber() {
        return "监控编号：" + monitorNumber;
    }

    public String getMagnificationStr() { return "倍率：" + String.format("%.1f", magnification); }
}
