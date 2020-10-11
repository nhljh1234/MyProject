package com.liaojh.towercrane.Manager;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.widget.Toast;

import com.github.mjdev.libaums.UsbMassStorageDevice;
import com.github.mjdev.libaums.fs.FileSystem;
import com.github.mjdev.libaums.fs.UsbFile;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.SerialPort.SerialUtil;

public class USBManager {
    private static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";
    //当前U盘所在文件目录
    private UsbFile rootFolder;
    //当前处接U盘列表
    private UsbMassStorageDevice[] storageDevices;
    private static USBManager instance;

    private USBManager() {

    }

    public static USBManager getInstance() {
        if (instance == null) {
            synchronized (USBManager.class) {
                if (instance == null) {
                    instance = new USBManager();
                }
            }
        }
        return instance;
    }

    private BroadcastReceiver usbBroadcastReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            switch (action) {
                case ACTION_USB_PERMISSION://接受到自定义广播
                    UsbDevice usbDevice = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    //允许权限申请
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (usbDevice != null) {
                            Toast.makeText(context, "检测到U盘", Toast.LENGTH_LONG).show();
                            //用户已授权，可以进行读取操作
                            readDevice(getUsbMass(usbDevice));
                        } else {
                            Toast.makeText(context, "没有插入U盘", Toast.LENGTH_LONG).show();
                        }
                    } else {
                        Toast.makeText(context, "未获取到U盘权限", Toast.LENGTH_LONG).show();
                    }
                    break;
                case UsbManager.ACTION_USB_DEVICE_ATTACHED://接收到U盘设备插入广播
                    UsbDevice device_add = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (device_add != null) {
                        Toast.makeText(context, "U盘插入", Toast.LENGTH_LONG).show();
                        //接收到U盘插入广播，尝试读取U盘设备数据
                        redUDiskDevsList(context);
                    }
                    break;
                case UsbManager.ACTION_USB_DEVICE_DETACHED://接收到U盘设设备拔出广播
                    rootFolder = null;
                    Toast.makeText(context, "U盘拔出", Toast.LENGTH_LONG).show();
                    break;
            }
        }
    };

    public void init(MainActivity activity) {
        ///< 监听otg插入 拔出
        IntentFilter usbDeviceStateFilter = new IntentFilter();
        usbDeviceStateFilter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        usbDeviceStateFilter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        activity.registerReceiver(usbBroadcastReceiver, usbDeviceStateFilter);
        //注册监听自定义广播
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        activity.registerReceiver(usbBroadcastReceiver, filter);
        //初始化
        redUDiskDevsList(activity);
    }

    public UsbFile getUsbRootFolder() {
        return rootFolder;
    }

    /**
     * @description U盘设备读取
     * @author ldm
     * @time 2017/9/1 17:20
     */
    private void redUDiskDevsList(Context context) {
        //设备管理器
        UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        //获取U盘存储设备
        storageDevices = UsbMassStorageDevice.getMassStorageDevices(context);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, new Intent(ACTION_USB_PERMISSION), 0);
        //一般手机只有1个OTG插口
        for (UsbMassStorageDevice device : storageDevices) {
            //读取设备是否有权限
            if (usbManager.hasPermission(device.getUsbDevice())) {
                readDevice(device);
            } else {
                //没有权限，进行申请
                usbManager.requestPermission(device.getUsbDevice(), pendingIntent);
            }
        }
        if (storageDevices.length == 0) {
            Toast.makeText(context, "请插入可用的U盘", Toast.LENGTH_LONG).show();
        }
    }

    /**
     * 获取对应的U盘设备
     *
     * @param usbDevice
     * @return
     */
    private UsbMassStorageDevice getUsbMass(UsbDevice usbDevice) {
        for (UsbMassStorageDevice device : storageDevices) {
            if (usbDevice.equals(device.getUsbDevice())) {
                return device;
            }
        }
        return null;
    }

    /**
     * @param device
     */
    private void readDevice(UsbMassStorageDevice device) {
        try {
            device.init();
            FileSystem currentFs = device.getPartitions().get(0).getFileSystem();
            //设置当前文件对象为根目录
            rootFolder = currentFs.getRootDirectory();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
