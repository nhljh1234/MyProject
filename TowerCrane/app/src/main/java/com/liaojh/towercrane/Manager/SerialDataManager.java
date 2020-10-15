package com.liaojh.towercrane.Manager;

import android.os.Debug;
import android.util.Log;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Tool.Tool;

import java.util.concurrent.Executors;

public class SerialDataManager {
    private static SerialDataManager instance;

    private SerialDataManager() {

    }

    public static SerialDataManager getInstance() {
        if (instance == null) {
            synchronized (ArcFaceManager.class) {
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
            towerCraneLiftData.runStatus = Constant.STATUS_RUN;
        } else if (runStatus == 1) {
            towerCraneLiftData.runStatus = Constant.STATUS_STOP;
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
        towerCraneLiftData.statusStop       = ((status & 0b000000000000000000001) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.statusRun        = ((status & 0b000000000000000000010) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.upSlowDown       = ((status & 0b000000000000000000100) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.downSlowDown     = ((status & 0b000000000000000001000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.upDestination    = ((status & 0b000000000000000010000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.downDestination  = ((status & 0b000000000000000100000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.force_110        = ((status & 0b000000000000001000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.force_100        = ((status & 0b000000000000010000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.force_90         = ((status & 0b000000000000100000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_100         = ((status & 0b000000000001000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_90          = ((status & 0b000000000010000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_50          = ((status & 0b000000000100000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.load_25          = ((status & 0b000000001000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeUnit        = ((status & 0b000000010000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeLose        = ((status & 0b000000100000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.slowDown         = ((status & 0b000001000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.force_80         = ((status & 0b000010000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeOpen        = ((status & 0b000100000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.limitSwitch      = ((status & 0b001000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.brakeNotEnough   = ((status & 0b010000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        towerCraneLiftData.hangOpen         = ((status & 0b100000000000000000000) == 0) ? Constant.STATUS_NORMAL : Constant.STATUS_ERROR;
        return towerCraneLiftData;
    }
}
