package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.Manager.USBManager;
import com.liaojh.towercrane.Manager.VideoManager;

import java.sql.Struct;
import java.util.HashMap;
import java.util.Map;

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

    //变频器错误状态
    public static final int STATUS_NORMAL = 17;
    public static final int STATUS_ERROR = 19;

    //变频器运行情况
    public static final int STATUS_RUN = 20;
    public static final int STATUS_STOP = 21;

    //正转还是反转
    public static final int DIRECTION_FORWARD = 22;
    public static final int DIRECTION_BACK = 23;

    //定标选项
    public static String[] CALIBRATION_CONTROL = new String[] {
            "NC", "J1闭合", "J1开启", "J2闭合", "J2开启", "J3闭合", "J3开启", "J4闭合", "J4开启", "J5闭合", "J5开启",
            "J6闭合", "J6开启",  "J7闭合", "J7开启",  "J8闭合", "J8开启"
    };

    public static HashMap<String, String> ERROR_CODE = new HashMap<String, String>() {
        {
            put("W_1", "系统没有准备好");
            put("W_2", "没有驱动使能信号");
            put("W_3", "端子本地警告");
            put("W_4", "端子远程警告");
            put("W_6", "过温");
            put("W_9", "DP通讯警告");
            put("W_10", "MODBUS通讯警告");
            put("W_15", "参数设置错误");
            put("W_18", "温度检测异常");
            put("W_20", "从机没准备好");
            put("W_21", "从机1通讯错误");

            put("E_50", "U相上桥臂故障(不可复位)");
            put("E_51", "U相下桥臂故障(不可复位)");
            put("E_52", "V相上桥臂故障(不可复位)");
            put("E_53", "V相下桥臂故障(不可复位)");
            put("E_54", "W相上桥臂故障(不可复位)");
            put("E_55", "W相下桥臂故障(不可复位)");
            put("E_56", "从机故障(不可复位)");
            put("E_57", "内置制动单元(不可复位)");
            put("E_100", "过压");
            put("E_105", "欠压");
            put("E_110", "过流");
            put("E_111", "过载");
            put("E_112", "对地短路");
            put("E_113", "输入缺相");
            put("E_114", "输出缺相");
            put("E_115", "过速");
            put("E_116", "开环矢量控制错误");
            put("E_117", "电机堵转");
            put("E_118", "编码器错误");
            put("E_119", "速度异常");
            put("E_121", "变频器IGBT1过热");
            put("E_122", "变频器IGBT2过热");
            put("E_123", "变频器IGBT3过热");
            put("E_124", "变频器IGBT4过热");
            put("E_125", "变频器IGBT5过热");
            put("E_126", "变频器IGBT6过热");
            put("E_127", "变频器IGBT7过热");
            put("E_128", "变频器IGBT8过热");
            put("E_137", "风扇堵转");
            put("E_138", "温度采样故障");
            put("E_151", "U相上桥IGBT故障");
            put("E_152", "U相下桥IGBT故障");
            put("E_153", "V相上桥IGBT故障");
            put("E_154", "V相下桥IGBT故障");
            put("E_155", "W相上桥IGBT故障");
            put("E_156", "W相下桥IGBT故障");
            put("E_157", "内置制动单元故障");
            put("E_160", "从机故障");
            put("E_161", "从机没有准备好");
            put("E_162", "从机1CAN故障");
            put("E_167", "CAN通讯错误");
            put("E_170", "自学习失败");
            put("E_180", "DP通讯错误");
            put("E_181", "DP通讯警告");
            put("E_200", "端子本地故障");
            put("E_201", "端子远程故障");
            put("E_202", "Modbus通讯故障");
            put("E_203", "没有驱动控制信号");
            put("E_210", "键盘操作器故障");
            put("E_220", "存储器CRC效验错误");
            put("E_221", "参数错误");
        }
    };

    //网络数据获取间隔
    public static int SIGNAL_DATA_UPDATE_INTERVAL = 1;

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

    public static String FACE_APP_ID = "2i39BTFEN2a9vMaLijVUnApgh8VrTfdM62QR6Gqe4Ju3";

    public static String FACE_SDK_KEY = "3yYGqGYBBYZUP9FSdAbht78z4sbbcJhZQ6DSiMMxMrWv";

    public static String BUGLY_APP_ID = "a5e518088b";

    public static String BUGLY_APP_KEY = "ec1a4cfd-bf63-4502-b667-adb0939853ca";

    public static String SOUND_APP_KEY = "w2oyk3iumk7b237t6fefjhppvnwutmj5ylsckiif";

    public static String SOUND_APP_SECRET = "645a1f079ab071b584f5cb9bfb4cfb79";

    //版本号
    public static int Version = 1;
}
