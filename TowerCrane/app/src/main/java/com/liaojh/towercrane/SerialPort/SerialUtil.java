package com.liaojh.towercrane.SerialPort;

import android.util.Log;

import com.kongqw.serialportlibrary.SerialPortManager;
import com.kongqw.serialportlibrary.listener.OnOpenSerialPortListener;
import com.kongqw.serialportlibrary.listener.OnSerialPortDataListener;
import com.liaojh.towercrane.Data.Constant;

import java.io.File;

public class SerialUtil {
    private SerialPortManager mSerialPortManager = new SerialPortManager();
    private static SerialUtil instance = null;

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
     * @return
     */
    public boolean Connect() {
        return Connect("ttyS0");
    }

    /**
     * 链接串口
     * @param PortName 设备节点名称
     * @return
     */
    public boolean Connect(String PortName) {
        return mSerialPortManager.openSerialPort(new File("dev/" + PortName), 115200);
    }

    /**
     * 写入数据
     * @param val
     */
    public void write(String val) {
        mSerialPortManager.sendBytes(val.getBytes());
    }

    public void write(byte[] val) {
        mSerialPortManager.sendBytes(val);
    }
}