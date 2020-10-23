package com.liaojh.towercrane.Manager;

import android.os.Debug;
import android.util.Log;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneAmplitudeData;
import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Data.TowerCraneTurnAroundData;
import com.liaojh.towercrane.Tool.Tool;

import java.util.concurrent.Executors;

public class SerialDataManager {
    private static SerialDataManager instance;

    private SerialDataManager() {

    }

    public static SerialDataManager getInstance() {
        if (instance == null) {
            synchronized (SerialDataManager.class) {
                if (instance == null) {
                    instance = new SerialDataManager();
                }
            }
        }
        return instance;
    }

    //解析起升变频器数据
    public TowerCraneLiftData handleLiftData(byte[] bytes) {
        TowerCraneLiftData towerCraneLiftData = new TowerCraneLiftData();
        if (bytes.length != 73) {
            Log.e(Constant.LogTag, "handleLiftData error, length error");
            return null;
        }
        //起始位是00 33，结束位是FA 20
        if (!Tool.byteToHexStr(bytes[1]).equals("03") ||
                !Tool.byteToHexStr(bytes[2]).equals("44")||
                !Tool.byteToHexStr(bytes[bytes.length - 2]).equals("FA")||
                !Tool.byteToHexStr(bytes[bytes.length - 1]).equals("20")) {
            Log.e(Constant.LogTag, "handleLiftData error, head or back error");
            return null;
        }
        int count = 3;
        //运行情况
        int runStatus = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (runStatus == 0) {
            towerCraneLiftData.status = Constant.STATUS_STOP;
        } else if (runStatus == 1) {
            towerCraneLiftData.status = Constant.STATUS_RUN;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, run status error");
        }
        //正转还是反转
        count = count + 2;
        int direction = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (direction == 0) {
            towerCraneLiftData.direction = Constant.DIRECTION_FORWARD;
        } else if (direction == 1) {
            towerCraneLiftData.direction = Constant.DIRECTION_BACK;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, direction error");
        }
        //运行赫兹
        count = count + 2;
        int frequency = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.frequency = (float)frequency / 10;
        //编码器速度
        count = count + 2;
        //电机转速
        count = count + 2;
        towerCraneLiftData.turnSpeed = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        //母线电压
        count = count + 2;
        int generatrixVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.generatrixVoltage = (float)generatrixVoltage / 10;
        //输出电压
        count = count + 2;
        int outputVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.outputVoltage = (float)outputVoltage / 10;
        //输出电流
        count = count + 2;
        int outputElectricity = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.outputElectricity = (float)outputElectricity / 10;
        //控制方式
        count = count + 2;
        //输出温度
        count = count + 2;
        int temperature  = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.temperature  = (float)temperature  / 10;
        //警告
        count = count + 2;
        int warnCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.warnCode = warnCode;
        //故障
        count = count + 2;
        int errorCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneLiftData.errorCode = errorCode;
        //编码器1 32位 计数 LSW
        count = count + 2;
        //编码器1 32位 计数 MSW
        count = count + 2;
        //编码器2 32位 计数 LSW
        count = count + 2;
        //编码器2 32位 计数 MSW
        count = count + 2;
        //塔机工艺卡DI[01-16]
        count = count + 2;
        //塔机工艺卡DI[17-23]
        count = count + 2;
        //塔机工艺卡DO[6-8]
        count = count + 2;
        //塔机工艺卡状态位指示MSW和塔机工艺卡状态位指示LSW
        count = count + 2;
        int status = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1], bytes[count + 2], bytes[count + 3]}, 2);
        towerCraneLiftData.statusStop           = ((status & 0b000000000000000000001) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.statusRun            = ((status & 0b000000000000000000010) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.upSlowDown           = ((status & 0b000000000000000000100) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.downSlowDown         = ((status & 0b000000000000000001000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.upDestination        = ((status & 0b000000000000000010000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.downDestination      = ((status & 0b000000000000000100000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.torque_110           = ((status & 0b000000000000001000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.torque_100           = ((status & 0b000000000000010000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.torque_90            = ((status & 0b000000000000100000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_100             = ((status & 0b000000000001000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_90              = ((status & 0b000000000010000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_50              = ((status & 0b000000000100000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_25              = ((status & 0b000000001000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeUnit            = ((status & 0b000000010000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeLose            = ((status & 0b000000100000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.slowDown             = ((status & 0b000001000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.torque_80            = ((status & 0b000010000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeOpen            = ((status & 0b000100000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.limitSwitch          = ((status & 0b001000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeNotEnough       = ((status & 0b010000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.hangOpen             = ((status & 0b100000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        return towerCraneLiftData;
    }

    //解析变幅变频器数据
    public TowerCraneAmplitudeData handleAmplitudeData(byte[] bytes) {
        TowerCraneAmplitudeData towerCraneAmplitudeData = new TowerCraneAmplitudeData();
        if (bytes.length != 73) {
            Log.e(Constant.LogTag, "handleLiftData error, length error");
            return null;
        }
        //起始位是00 33，结束位是FA 20
        if (!Tool.byteToHexStr(bytes[1]).equals("03") ||
                !Tool.byteToHexStr(bytes[2]).equals("44")||
                !Tool.byteToHexStr(bytes[bytes.length - 2]).equals("95")||
                !Tool.byteToHexStr(bytes[bytes.length - 1]).equals("43")) {
            Log.e(Constant.LogTag, "handleLiftData error, head or back error");
            return null;
        }
        int count = 3;
        //运行情况
        int runStatus = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (runStatus == 0) {
            towerCraneAmplitudeData.status = Constant.STATUS_STOP;
        } else if (runStatus == 1) {
            towerCraneAmplitudeData.status = Constant.STATUS_RUN;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, run status error");
        }
        //正转还是反转
        count = count + 2;
        int direction = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (direction == 0) {
            towerCraneAmplitudeData.direction = Constant.DIRECTION_FORWARD;
        } else if (direction == 1) {
            towerCraneAmplitudeData.direction = Constant.DIRECTION_BACK;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, direction error");
        }
        //运行赫兹
        count = count + 2;
        int frequency = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.frequency = (float)frequency / 10;
        //编码器速度
        count = count + 2;
        //电机转速
        count = count + 2;
        towerCraneAmplitudeData.turnSpeed = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        //母线电压
        count = count + 2;
        int generatrixVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.generatrixVoltage = (float)generatrixVoltage / 10;
        //输出电压
        count = count + 2;
        int outputVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.outputVoltage = (float)outputVoltage / 10;
        //输出电流
        count = count + 2;
        int outputElectricity = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.outputElectricity = (float)outputElectricity / 10;
        //控制方式
        count = count + 2;
        //输出温度
        count = count + 2;
        int temperature  = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.temperature  = (float)temperature  / 10;
        //警告
        count = count + 2;
        int warnCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.warnCode = warnCode;
        //故障
        count = count + 2;
        int errorCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneAmplitudeData.errorCode = errorCode;
        //编码器1 32位 计数 LSW
        count = count + 2;
        //编码器1 32位 计数 MSW
        count = count + 2;
        //编码器2 32位 计数 LSW
        count = count + 2;
        //编码器2 32位 计数 MSW
        count = count + 2;
        //塔机工艺卡DI[01-16]
        count = count + 2;
        //塔机工艺卡DI[17-23]
        count = count + 2;
        //塔机工艺卡DO[6-8]
        count = count + 2;
        //塔机工艺卡状态位指示MSW和塔机工艺卡状态位指示LSW
        count = count + 2;
        int status = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1], bytes[count + 2], bytes[count + 3]}, 2);
        towerCraneAmplitudeData.statusStop          = ((status & 0b000000000000000000001) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.statusRun           = ((status & 0b000000000000000000010) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.frontSlowDown       = ((status & 0b000000000000000000100) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.backSlowDown        = ((status & 0b000000000000000001000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.frontDestination    = ((status & 0b000000000000000010000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.backDestination     = ((status & 0b000000000000000100000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.torque_110          = ((status & 0b000000000000001000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.torque_100          = ((status & 0b000000000000010000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.torque_90           = ((status & 0b000000000000100000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.load_100            = ((status & 0b000000000001000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.load_90             = ((status & 0b000000000010000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.load_50             = ((status & 0b000000000100000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.load_25             = ((status & 0b000000001000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.brakeUnit           = ((status & 0b000000010000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.brakeLose           = ((status & 0b000000100000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.slowDown            = ((status & 0b000001000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.torque_80           = ((status & 0b000010000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.brakeOpen           = ((status & 0b000100000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.limitSwitch         = ((status & 0b001000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.brakeNotEnough      = ((status & 0b010000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneAmplitudeData.hangOpen            = ((status & 0b100000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        return towerCraneAmplitudeData;
    }

    //解析回转变频器数据
    public TowerCraneTurnAroundData handleTurnAroundData(byte[] bytes) {
        TowerCraneTurnAroundData towerCraneTurnAroundData = new TowerCraneTurnAroundData();
        if (bytes.length != 73) {
            Log.e(Constant.LogTag, "handleLiftData error, length error");
            return null;
        }
        //起始位是00 33，结束位是FA 20
        if (!Tool.byteToHexStr(bytes[1]).equals("03") ||
                !Tool.byteToHexStr(bytes[2]).equals("44")||
                !Tool.byteToHexStr(bytes[bytes.length - 2]).equals("C7")||
                !Tool.byteToHexStr(bytes[bytes.length - 1]).equals("72")) {
            Log.e(Constant.LogTag, "handleLiftData error, head or back error");
            return null;
        }
        int count = 3;
        //运行情况
        int runStatus = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (runStatus == 0) {
            towerCraneTurnAroundData.status = Constant.STATUS_STOP;
        } else if (runStatus == 1) {
            towerCraneTurnAroundData.status = Constant.STATUS_RUN;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, run status error");
        }
        //正转还是反转
        count = count + 2;
        int direction = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        if (direction == 0) {
            towerCraneTurnAroundData.direction = Constant.DIRECTION_FORWARD;
        } else if (direction == 1) {
            towerCraneTurnAroundData.direction = Constant.DIRECTION_BACK;
        } else {
            Log.e(Constant.LogTag, "handleLiftData error, direction error");
        }
        //运行赫兹
        count = count + 2;
        int frequency = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.frequency = (float)frequency / 10;
        //编码器速度
        count = count + 2;
        //电机转速
        count = count + 2;
        towerCraneTurnAroundData.turnSpeed = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        //母线电压
        count = count + 2;
        int generatrixVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.generatrixVoltage = (float)generatrixVoltage / 10;
        //输出电压
        count = count + 2;
        int outputVoltage = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.outputVoltage = (float)outputVoltage / 10;
        //输出电流
        count = count + 2;
        int outputElectricity = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.outputElectricity = (float)outputElectricity / 10;
        //控制方式
        count = count + 2;
        //输出温度
        count = count + 2;
        int temperature  = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.temperature  = (float)temperature  / 10;
        //警告
        count = count + 2;
        int warnCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.warnCode = warnCode;
        //故障
        count = count + 2;
        int errorCode = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1]}, 10);
        towerCraneTurnAroundData.errorCode = errorCode;
        //编码器1 32位 计数 LSW
        count = count + 2;
        //编码器1 32位 计数 MSW
        count = count + 2;
        //编码器2 32位 计数 LSW
        count = count + 2;
        //编码器2 32位 计数 MSW
        count = count + 2;
        //塔机工艺卡DI[01-16]
        count = count + 2;
        //塔机工艺卡DI[17-23]
        count = count + 2;
        //塔机工艺卡DO[6-8]
        count = count + 2;
        //塔机工艺卡状态位指示MSW和塔机工艺卡状态位指示LSW
        count = count + 2;
        int status = Tool.byteToInt(new byte[] { bytes[count], bytes[count + 1], bytes[count + 2], bytes[count + 3]}, 2);
        towerCraneTurnAroundData.statusStop         = ((status & 0b000000000000000000001) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.statusRun          = ((status & 0b000000000000000000010) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.leftSlowDown       = ((status & 0b000000000000000000100) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.rightSlowDown      = ((status & 0b000000000000000001000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.leftDestination    = ((status & 0b000000000000000010000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.rightDestination   = ((status & 0b000000000000000100000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.torque_110         = ((status & 0b000000000000001000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.torque_100         = ((status & 0b000000000000010000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.torque_90          = ((status & 0b000000000000100000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.load_100           = ((status & 0b000000000001000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.load_90            = ((status & 0b000000000010000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.load_50            = ((status & 0b000000000100000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.load_25            = ((status & 0b000000001000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.brakeUnit          = ((status & 0b000000010000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.brakeLose          = ((status & 0b000000100000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.slowDown           = ((status & 0b000001000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.torque_80          = ((status & 0b000010000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.brakeOpen          = ((status & 0b000100000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.limitSwitch        = ((status & 0b001000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.brakeNotEnough     = ((status & 0b010000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneTurnAroundData.hangOpen           = ((status & 0b100000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        return towerCraneTurnAroundData;
    }
}
