package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.Manager.USBManager;
import com.liaojh.towercrane.Manager.VideoManager;

import java.sql.Struct;

public class Constant {
    //handler类型
    public static final int HANDLER_TYPE_UPDATE_TIME_INFO = 1;
    public static final int HANDLER_TYPE_UPDATE_TOWER_INFO = 2;

    //运行状态
    public static final int RUN_STATUS_RISE_UP = 3;
    public static final int RUN_STATUS_RISE_DOWN = 4;
    public static final int RUN_STATUS_RISE_NORMAL = 5;

    public static final int RUN_STATUS_TURN_LEFT = 3;
    public static final int RUN_STATUS_TURN_RIGHT = 4;
    public static final int RUN_STATUS_TURN_NORMAL = 6;

    public static final int RUN_STATUS_HEAD_FRONT = 7;
    public static final int RUN_STATUS_HEAD_BACK = 8;
    public static final int RUN_STATUS_HEAD_NORMAL = 9;

    //csv数据类型
    public static final int CSV_TYPE_BASE = 10;
    public static final int CSV_TYPE_STATIC = 11;
    public static final int CSV_TYPE_SWITCH = 12;
    public static final int CSV_TYPE_LOOP = 13;

    //定标数据类型
    public static final int CALIBRATION_TYPE_WEIGHT = 10;
    public static final int CALIBRATION_TYPE_WIND = 11;
    public static final int CALIBRATION_TYPE_AMPLITUDE = 12;
    public static final int CALIBRATION_TYPE_TURN_AROUND = 13;
    public static final int CALIBRATION_TYPE_HEIGHT = 14;

    //设置界面类型
    public static final int SETTING_TYPE_NORMAL = 15;
    public static final int SETTING_TYPE_SUPER = 16;

    //定标选项
    public static String[] CALIBRATION_CONTROL = new String[] {
            "NC", "J1闭合", "J1开启", "J2闭合", "J2开启", "J3闭合", "J3开启", "J4闭合", "J4开启", "J5闭合", "J5开启",
            "J6闭合", "J6开启",  "J7闭合", "J7开启",  "J8闭合", "J8开启"
    };

    //csv数据写入间隔
    public static int CSV_DATA_WRITE_INTERVAL = 1000 * 10;

    //塔吊数据读取间隔
    public static int TOWER_RUN_DATE_UPDATE_INTERVAL = 1000;

    //网络数据获取间隔
    public static int SIGNAL_DATA_UPDATE_INTERVAL = 1000;

    public static String LogTag = "test log";

    public static String Password = "11";

    public static String SuperPassword = "3840509";

    public static class VideoSaveData {
        public String name;
        public String userName;
        public String userPassword;
        public String ipAddress;
        public String port;
        public String rtspAddress;
    }

    public static String VideoSaveKey = "VideoSaveKey";

    public static String CsvDataDirName = "csv_data";

    public static String APP_ID = "7s8skgqES6JBy79xHW5bmcxrRBUVufFAyHAq71vBSwud";

    public static String SDK_KEY = "3A3KeQMjKdB8MJBC7PNXpyGktpEHh9nwTJ5qNZdnwC2y";

    //版本号
    public static int Version = 1;
}
