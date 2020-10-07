package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.Manager.USBManager;
import com.liaojh.towercrane.Manager.VideoManager;

import java.sql.Struct;

public class Constant {
    public enum InterfaceType {
        Normal,
    }

    public enum Handler_Type {
        UpdateTimeInfo,
        UpdateTowerCraneInfo,
        SearchFinish,
        IPError,
        CheckFace,
    }

    public enum Status_Up_Or_Down {
        Up,
        Down,
        Normal,
    }

    public enum Status_Left_Or_Right {
        Left,
        Right,
        Normal,
    }

    public enum Status_Front_Or_Back {
        Front,
        Back,
        Normal,
    }

    public enum Status_Run {
        Stop,
        StopCar,
        Normal,
    }

    public enum CSV_FILE_TYPE {
        Base, //基础数据
        Static, //静态数据
        Switch, //开关机数据
        Loop, //循环数据
    }

    public enum CALIBRATION_TYPE {
        Weight,
        Wind,
        Amplitude,
        TurnAround,
        Height,
    }

    public enum SETTING_TYPE {
        Normal,
        Super,
    }

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
