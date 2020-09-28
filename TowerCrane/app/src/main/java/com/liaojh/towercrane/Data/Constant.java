package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.LocalStorage;

public class Constant {
    public enum InterfaceType {
        Normal,
    }

    public enum Handler_Type {
        UpdateTimeInfo,
        UpdateTowerCraneInfo,
        SearchFinish,
        IPError,
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

    //csv数据写入间隔
    public static int CSV_DATA_WRITE_INTERVAL = 1000 * 10;

    //塔吊数据读取间隔
    public static int TOWER_RUN_DATE_UPDATE_INTERVAL = 1000;

    //网络数据获取间隔
    public static int SIGNAL_DATA_UPDATE_INTERVAL = 1000;

    public static InterfaceType interfaceType = InterfaceType.Normal;

    public static TowerCraneData towerCraneData = new TowerCraneData();

    public static CSVFileManager csvFileManager = new CSVFileManager();

//    public static String Name = "guest";
//
//    public static String Password = "Guest001";

    public static String Name = "guest";

    public static String Password = "guest_001";

    public static int Port = 8000;

    public static String LogTag = "test log";

    public static LocalStorage localStorage;

    public static float videoRatio = 4.0f / 3;

    public static String userName = "admin";

    public static String password = "password";
}
