package com.liaojh.towercrane.SerialPort;

import android.util.Log;

import com.kongqw.serialportlibrary.SerialPortManager;
import com.kongqw.serialportlibrary.listener.OnOpenSerialPortListener;
import com.kongqw.serialportlibrary.listener.OnSerialPortDataListener;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Manager.SerialDataManager;
import com.liaojh.towercrane.Tool.Tool;

import java.io.File;

public class SerialUtil {
    private SerialPortManager mSerialPortManager = new SerialPortManager();
    private static SerialUtil instance = null;
    private MainActivity m_activity;


    private SerialUtil() {

    }

    // 此处使用单例模式
    public static SerialUtil getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new SerialUtil();
                    instance.mSerialPortManager.setOnSerialPortDataListener(instance.onSerialPortDataListener);
                    instance.mSerialPortManager.setOnOpenSerialPortListener(instance.onOpenSerialPortListener);
                }
            }
        }
        return instance;
    }

    private OnSerialPortDataListener onSerialPortDataListener = new OnSerialPortDataListener() {
        @Override
        public void onDataReceived(byte[] bytes) {
            Log.e(Constant.LogTag, "收到了数据。");
        }

        @Override
        public void onDataSent(byte[] bytes) {
            Log.e(Constant.LogTag, "发送了数据。");
        }
    };

    private OnOpenSerialPortListener onOpenSerialPortListener = new OnOpenSerialPortListener() {
        @Override
        public void onSuccess(File device) {
            Log.e(Constant.LogTag, "链接" + device.getName() +"成功");
        }

        @Override
        public void onFail(File device, Status status) {
            Log.e(Constant.LogTag, "链接" + device.getName() +"失败");
        }
    };


    /**
     * 链接串口
     * @param PortName 设备节点名称
     * @return
     */
    public void connect(final String PortName, MainActivity activity) {
        m_activity = activity;
        new Thread(new Runnable() {
            @Override
            public void run() {
                mSerialPortManager.openSerialPort(new File("dev/" + PortName), 115200);
            }
        }).start();
    }

    /**
     * 写入数据
     * @param val
     */
    public void write(final String val) {
        byte[] bytes = Tool.hexStrToBytes(val);
    }

    public void write(final byte[] bytes) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                mSerialPortManager.sendBytes(bytes);
            }
        });
    }

    public void test() {
        TowerCraneRunData testData = new TowerCraneRunData();
        String data;
        data = "0B03440000000100000000000013E80000000000020157000000004810002900000000000000000000000000010000006500000000000000000000000000002710000013880000FA20";
        testData.towerCraneLiftData = SerialDataManager.getInstance().handleLiftData(Tool.hexStrToBytes(data));
        data = "0C034400010001FF8C0000FF1A14540372004500000167000000000000000004CA0031C80600130001000000020001006500000000000000000000000000002710000013880000C772";
        testData.towerCraneTurnAroundData = SerialDataManager.getInstance().handleTurnAroundData(Tool.hexStrToBytes(data));
        data = "0D03440001000000640000012C146E031300270000016E000000000000000039FC00480001000000010000000200010065000000000000000000000000000027100000138800009543";
        testData.towerCraneAmplitudeData = SerialDataManager.getInstance().handleAmplitudeData(Tool.hexStrToBytes(data));

        if (m_activity != null) {
            m_activity.onReceiveTowerData(testData);
        }
    }
}