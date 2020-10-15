package com.liaojh.towercrane.Data;

import java.util.ArrayList;
import java.util.Calendar;

//塔吊运行数据
public class TowerCraneRunData {
    private TowerCraneRunData oldData;

    public TowerCraneLiftData towerCraneLiftData;

    public TowerCraneAmplitudeData towerCraneAmplitudeData = new TowerCraneAmplitudeData();

    public TowerCraneTurnAroundData towerCraneTurnAroundData = new TowerCraneTurnAroundData();

    Calendar calendar = Calendar.getInstance();
    double second = (double) calendar.get(Calendar.SECOND);

    //钢丝绳
    public float wireRope = (float)Math.random();
    //荷载
    public float load = (float)Math.random();
    //高度
    public float height = (float)second / 60;
    //回转
    public float turnAround = (float)(second / 60 - 0.5) * 360;
    //力矩
    public float torque = (float)Math.random();
    //载重
    public float weight = (float)Math.random();
    //风力
    public int windPower = (int) (Math.random() * 10);
    //幅度
    public float amplitude = (float)second / 60;
    //钢丝绳损伤位置
    public float cordHarmPos = (float)Math.random();
    //钢丝绳当前位置
    public float cordPos = (float)Math.random();
    //钢丝绳损伤量
    public float cordHarmNumber = (float)Math.random();
    //当前位置最大载重
    public float nowPosMaxWeight = (float)Math.random();

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
    public int getUpDownStatus() {
        if (oldData != null) {
            if (height > oldData.height) {
                return Constant.RUN_STATUS_RISE_UP;
            } else if (height < oldData.height) {
                return Constant.RUN_STATUS_RISE_DOWN;
            }
        }
        return Constant.RUN_STATUS_RISE_NORMAL;
    }

    //判断左转还是右转，根据回转值对应
    public int getLeftRightStatus() {
        if (oldData != null) {
            if (turnAround > oldData.turnAround) {
                return Constant.RUN_STATUS_TURN_RIGHT;
            } else if (turnAround < oldData.turnAround) {
                return Constant.RUN_STATUS_TURN_LEFT;
            }
        }
        return Constant.RUN_STATUS_TURN_NORMAL;
    }

    //判断前进还是后退，根据幅度值对应
    public int getFrontBackStatus() {
        if (oldData != null) {
            if (amplitude > oldData.amplitude) {
                return Constant.RUN_STATUS_HEAD_FRONT;
            } else if (amplitude < oldData.amplitude) {
                return Constant.RUN_STATUS_HEAD_BACK;
            }
        }
        return Constant.RUN_STATUS_HEAD_NORMAL;
    }

    public double getAmplitudeScale() {
        return amplitude;
    }

    public double getHeightScale() {
        return height;
    }
}
