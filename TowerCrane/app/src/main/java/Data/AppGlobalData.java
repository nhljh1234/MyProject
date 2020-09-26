package Data;

import java.util.ArrayList;
import java.util.List;

import Manager.ArcFaceManager;
import Manager.CSVFileManager;

public class AppGlobalData {
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
    public static int TOWER_RUN_DATE_UPDATE_INTERVAL = 100;

    //网络数据获取间隔
    public static int SIGNAL_DATA_UPDATE_INTERVAL = 1000;

    public static InterfaceType interfaceType = InterfaceType.Normal;

    public static TowerCraneData towerCraneData = new TowerCraneData();

    public static CSVFileManager csvFileManager = new CSVFileManager();

//    public static String Name = "guest";
//
//    public static String Password = "Guest001";

    public static String Name = "admin";

    public static String Password = "IZUBME";

    public static int Port = 8000;

    public static String LogTag = "test log";

    public static String APP_ID = "7s8skgqES6JBy79xHW5bmcxrRBUVufFAyHAq71vBSwud";

    public static String SDK_KEY = "3A3KeQMjKdB8MJBC7PNXpyGktpEHh9nwTJ5qNZdnwC2y";

    public static ArcFaceManager arcFaceManager = new ArcFaceManager();
}
