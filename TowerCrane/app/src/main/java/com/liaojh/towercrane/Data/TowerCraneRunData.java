package com.liaojh.towercrane.Data;

import java.util.ArrayList;
import java.util.Calendar;

//塔吊运行数据
public class TowerCraneRunData {
    private TowerCraneRunData oldData;

    public TowerCraneLiftData towerCraneLiftData = new TowerCraneLiftData();

    public TowerCraneAmplitudeData towerCraneAmplitudeData = new TowerCraneAmplitudeData();

    public TowerCraneTurnAroundData towerCraneTurnAroundData = new TowerCraneTurnAroundData();

    Calendar calendar = Calendar.getInstance();
    double second = (double) calendar.get(Calendar.SECOND);

    //后臂长
    public double backArmLength = 10.0;
    //大臂长
    public double bigArmLength = 55.0;
    //最高高度
    public double maxHeight = 80.0;
    //钢丝绳
    public double wireRope = Math.random();
    //荷载
    public double load = Math.random();
    //高度
    public double height = second / 60 * maxHeight;
    //回转
    public double turnAround = (second / 60 - 0.5) * 360;
    //力矩
    public double torque = Math.random();
    //载重
    public double weight = Math.random();
    //风力
    public int windPower = (int) (Math.random() * 10);
    //幅度
    public double amplitude = second / 60 * bigArmLength;
    //钢丝绳损伤位置
    public double cordHarmPos = Math.random();
    //钢丝绳当前位置
    public double cordPos = Math.random();
    //钢丝绳损伤量
    public double cordHarmNumber = Math.random();
    //当前位置最大载重
    public double nowPosMaxWeight = Math.random();

    public String getWireRopeStr() {
        return String.format("%.1f", wireRope);
    }

    public String getLoadStr() {
        return String.format("%.1f", load);
    }

    public String getHeightStr() {
        return String.format("%.1f", height);
    }

    public String getTurnAroundStr() {
        return String.format("%.1f°", turnAround);
    }

    public String getTorqueStr() {
        return String.format("%.1f", torque);
    }

    public String getWeightStr() {
        return String.format("%.1f", weight);
    }

    public String getWindPowerStr() {
        return String.format("%d", windPower);
    }

    public String getAmplitudeStr() {
        return String.format("%.1f", amplitude);
    }

    public String getCordHarmPosStr() {
        return String.format("%.1f", cordHarmPos);
    }

    public String getCordPosStr() {
        return String.format("%.1f", cordPos);
    }

    public String getCordHarmNumberStr() {
        return String.format("%.1f", cordHarmNumber) + "%";
    }

    public String getNowPosMaxWeight() {
        return String.format("%.2f", nowPosMaxWeight);
    }

    public String getBackArmLength() {
        return String.format("%.1f", backArmLength);
    }

    public String getBigArmLength() {
        return String.format("%.1f", bigArmLength);
    }

    public String getMaxHeight() {
        return String.format("%.1f", maxHeight);
    }


    public Boolean judgeWireRopeIsWaring() {
        return wireRope < 0.5;
    }

    public Boolean judgeLoadIsWaring() {
        return load < 0.5;
    }

    public Boolean judgeHeightIsWaring() {
        return height < 0.5;
    }

    public Boolean judgeTurnAroundIsWaring() {
        return turnAround < 0.5;
    }

    public Boolean judgeTorqueIsWaring() {
        return torque < 0.5;
    }

    public Boolean judgeWeightIsWaring() {
        return weight < 0.5;
    }

    public Boolean judgeWindPowerIsWaring() {
        return windPower < 0.5;
    }

    public Boolean judgeAmplitudeIsWaring() {
        return amplitude < 0.5;
    }

    public Boolean judgeCordIsHarm() {
        return cordHarmNumber < 0.5;
    }

    public ArrayList<String> getWaringStrList() {
        ArrayList<String> strList = new ArrayList<>();
        if (judgeWireRopeIsWaring()) {
            strList.add("钢丝绳警告");
        }
        if (judgeLoadIsWaring()) {
            strList.add("荷载警告");
        }
        if (judgeHeightIsWaring()) {
            strList.add("高度警告");
        }
        if (judgeTurnAroundIsWaring()) {
            strList.add("回转警告");
        }
        if (judgeTorqueIsWaring()) {
            strList.add("力矩警告");
        }
        if (judgeWeightIsWaring()) {
            strList.add("载重警告");
        }
        if (judgeWindPowerIsWaring()) {
            strList.add("风力警告");
        }
        if (judgeAmplitudeIsWaring()) {
            strList.add("幅度警告");
        }
        return strList;
    }

    public void setOldData(TowerCraneRunData oldDataIn) {
        oldData = oldDataIn;
    }

    //判断上下行，根据高度值对应
    public Constant.Status_Up_Or_Down getUpDownStatus() {
        if (oldData != null) {
            if (height > oldData.height) {
                return Constant.Status_Up_Or_Down.Up;
            } else if (height < oldData.height) {
                return Constant.Status_Up_Or_Down.Down;
            }
        }
        return Constant.Status_Up_Or_Down.Normal;
    }

    //判断左转还是右转，根据回转值对应
    public Constant.Status_Left_Or_Right getLeftRightStatus() {
        if (oldData != null) {
            if (turnAround > oldData.turnAround) {
                return Constant.Status_Left_Or_Right.Right;
            } else if (turnAround < oldData.turnAround) {
                return Constant.Status_Left_Or_Right.Left;
            }
        }
        return Constant.Status_Left_Or_Right.Normal;
    }

    //判断前进还是后退，根据幅度值对应
    public Constant.Status_Front_Or_Back getFrontBackStatus() {
        if (oldData != null) {
            if (amplitude > oldData.amplitude) {
                return Constant.Status_Front_Or_Back.Front;
            } else if (amplitude < oldData.amplitude) {
                return Constant.Status_Front_Or_Back.Back;
            }
        }
        return Constant.Status_Front_Or_Back.Normal;
    }

    public double getAmplitudeScale() {
        return amplitude / bigArmLength;
    }

    public double getHeightScale() {
        return height / maxHeight;
    }
}
