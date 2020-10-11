package com.liaojh.towercrane.Activity;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.Manager.ArcFaceManager;
import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.NetManager;
import com.liaojh.towercrane.Manager.USBManager;
import com.liaojh.towercrane.Manager.UpdateManager;
import com.liaojh.towercrane.SerialPort.SerialUtil;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Data.TowerCraneRunDataFactory;
import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.Tool.Tool;
import com.liaojh.towercrane.UI.InterfaceUI;
import com.liaojh.towercrane.UI.UIAddCamera;
import com.liaojh.towercrane.UI.UIAmplitudeRunInfo;
import com.liaojh.towercrane.UI.UICameraList;
import com.liaojh.towercrane.UI.UIFaceCheck;
import com.liaojh.towercrane.UI.UIFaceRegister;
import com.liaojh.towercrane.UI.UILogin;
import com.liaojh.towercrane.UI.UISetCalibration;
import com.liaojh.towercrane.UI.UISetTowerData;
import com.liaojh.towercrane.UI.UISetting;
import com.liaojh.towercrane.UI.UITopBar;
import com.liaojh.towercrane.UI.UITowerCraneRunInfo;
import com.liaojh.towercrane.UI.UITurnAroundRunInfo;
import com.liaojh.towercrane.UI.UIUpDownRunInfo;
import com.liaojh.towercrane.UI.UIVideoInfo;

import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;

import com.liaojh.towercrane.R;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends BaseActivity {
    public UITopBar uiTopBar = new UITopBar();
    public UITowerCraneRunInfo uiTowerCraneRunInfo = new UITowerCraneRunInfo();
    public UILogin uiLogin = new UILogin();
    public UISetting uiSetting = new UISetting();
    public UISetCalibration uiSetCalibration = new UISetCalibration();
    public UIAddCamera uiAddCamera = new UIAddCamera();
    public UIVideoInfo uiVideoInfo = new UIVideoInfo();
    public UICameraList uiCameraList = new UICameraList();
    public UIFaceCheck uiFaceCheck = new UIFaceCheck();
    public UIFaceRegister uiFaceRegister = new UIFaceRegister();
    public UISetTowerData uiSetTowerData = new UISetTowerData();

    private InterfaceUI[] uis = new InterfaceUI[]{
            uiTopBar,
            uiTowerCraneRunInfo,
            new UIUpDownRunInfo(),
            new UIAmplitudeRunInfo(),
            new UITurnAroundRunInfo(),
            uiVideoInfo,
            uiLogin,
            uiSetting,
            uiSetCalibration,
            uiAddCamera,
            uiCameraList,
            uiFaceCheck,
            uiFaceRegister,
            uiSetTowerData,
    };

    final private MainActivity activity = this;

    private TowerCraneRunData oldData;

    //csv文件读写计时
    private int timerTimeCsvData = 0;
    //塔吊数据读取计时
    private int timerTimeReadData = 0;
    //网络连接数据更新计时
    private int timerTimeSignalUpdate = 0;
    //人脸识别计时
    private int timerTimeFaceCheck = 0;
    //数据上传计时
    private int timerTimeUpload = 0;
    //心跳包
    private int timerTimeHeart = 0;

    //取所有定时器里面最小的时间
    private int intervalTime = 1;

    private static final String[] NEEDED_PERMISSIONS = new String[]{
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS,
    };

    private static final int ACTION_REQUEST_PERMISSIONS = 1;

    private TowerCraneRunDataFactory towerCraneRunDataFactory = new TowerCraneRunDataFactory();

    //更新主界面时间
    private Timer timer = new Timer();
    private TimerTask timerTask = new TimerTask() {
        @Override
        public void run() {
            //csv文件处理
            timerTimeCsvData = timerTimeCsvData + intervalTime;
            if (timerTimeCsvData >= SettingData.getInstance().getTowerCraneData().csvSaveInterval) {
                timerTimeCsvData = 0;
                Log.e(Constant.LogTag, "timerTimeCsvData");
                CSVFileManager.getInstance().saveData();
            }

            //获取串口数据
            timerTimeReadData = timerTimeReadData + intervalTime;
            if (timerTimeReadData >= SettingData.getInstance().getTowerCraneData().readDataInterval) {
                timerTimeReadData = 0;
                Log.e(Constant.LogTag, "timerTimeReadData");
                final TowerCraneRunData towerCraneRunData = towerCraneRunDataFactory.getRunData();
                if (oldData != null) {
                    towerCraneRunData.setOldData(oldData);
                }
                CSVFileManager.getInstance().addData(towerCraneRunData);
                oldData = towerCraneRunData;
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        for (int i = 0; i < uis.length; i++) {
                            uis[i].onTowerCraneRunDateUpdate(towerCraneRunData);
                        }
                    }
                });
            }

            //更新信号
            timerTimeSignalUpdate = timerTimeSignalUpdate + intervalTime;
            if (timerTimeSignalUpdate >= Constant.SIGNAL_DATA_UPDATE_INTERVAL) {
                timerTimeSignalUpdate = 0;
                Log.e(Constant.LogTag, "timerTimeSignalUpdate");
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        uiTopBar.updateInfo();
                    }
                });
            }

            //人脸识别
            timerTimeFaceCheck = timerTimeFaceCheck + intervalTime;
            if (timerTimeFaceCheck >= SettingData.getInstance().getTowerCraneData().checkFaceInterval) {
                timerTimeFaceCheck = 0;
                Log.e(Constant.LogTag, "timerTimeFaceCheck");
                new AlertDialog.Builder(activity)
                        .setTitle(R.string.batch_process_notification)
                        .setMessage(activity.getString(R.string.check_fail))
                        .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                uiFaceCheck.show();
                            }
                        }).setCancelable(false).create().show();
            }

            //数据上传
            timerTimeUpload = timerTimeUpload + intervalTime;
            if (timerTimeUpload >= SettingData.getInstance().getTowerCraneData().uploadInterval) {
                timerTimeUpload = 0;
                Log.e(Constant.LogTag, "timerTimeUpload");
            }

            //心跳包
            timerTimeHeart = timerTimeHeart + intervalTime;
            if (timerTimeHeart >= SettingData.getInstance().getTowerCraneData().heartInterval) {
                timerTimeHeart = 0;
                Log.e(Constant.LogTag, "timerTimeHeart");
                NetManager.getInstance().sendHeart();
            }
        }
    };

    private void buglyInit() {
        //bugly初始化
        Context context = getApplicationContext();
        // 获取当前包名
        String packageName = context.getPackageName();
        // 获取当前进程名
        String processName = Tool.getProcessName(android.os.Process.myPid());
        // 设置是否为上报进程
        CrashReport.UserStrategy strategy = new CrashReport.UserStrategy(context);
        strategy.setUploadProcess(processName == null || processName.equals(packageName));
        CrashReport.initCrashReport(getApplicationContext(), Constant.BUGLY_APP_ID, true);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        USBManager.getInstance().init(this);
        LocalStorage.getInstance().init(this);
        NetManager.getInstance().connect();
        UpdateManager.getInstance().init(this);

        buglyInit();

        int DPI = Tool.getDPI(this);
        switch (DPI) {
            case 120:
                setContentView(R.layout.activity_main_dpi_120);
                break;
            case 180:
                setContentView(R.layout.activity_main_dpi_180);
                break;
            case 240:
                setContentView(R.layout.activity_main_dpi_240);
                break;
            case 420:
                setContentView(R.layout.activity_main_dpi_420);
                break;
            case 480:
                setContentView(R.layout.activity_main_dpi_480);
                break;
            default:
                if (DPI > 320) {
                    setContentView(R.layout.activity_main_dpi_420);
                } else {
                    setContentView(R.layout.activity_main_dpi_240);
                }
                break;
        }

        if (!checkPermissions(NEEDED_PERMISSIONS)) {
            ActivityCompat.requestPermissions(this, NEEDED_PERMISSIONS, ACTION_REQUEST_PERMISSIONS);
        }

        //去掉头部
        getSupportActionBar().hide();
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);


        for (int i = 0; i < uis.length; i++) {
            uis[i].onUICreate(this);
        }

        intervalTime = Math.min(Constant.SIGNAL_DATA_UPDATE_INTERVAL, SettingData.getInstance().getTowerCraneData().checkFaceInterval);
        intervalTime = Math.min(intervalTime, SettingData.getInstance().getTowerCraneData().csvSaveInterval);
        intervalTime = Math.min(intervalTime, SettingData.getInstance().getTowerCraneData().readDataInterval);
        intervalTime = Math.min(intervalTime, SettingData.getInstance().getTowerCraneData().uploadInterval);
        //开启时间信息更新定时器
        timer.schedule(timerTask, 0, intervalTime * 1000);

        ((LinearLayout) activity.findViewById(R.id.layout_setting)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                uiLogin.show();
            }
        });

        //人脸识别
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //保持亮屏
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        //初始化
        ArcFaceManager.getInstance().active(this);
    }

    @Override
    protected void onStart() {
        super.onStart();

        for (int i = 0; i < uis.length; i++) {
            uis[i].onUIStart();
        }

        SerialUtil.getInstance().connect("ttyS1");
    }


    @Override
    protected void onDestroy() {
        for (int i = 0; i < uis.length; i++) {
            uis[i].onUIDestroy();
        }

        if (timer != null) {// 停止timer
            timer.cancel();
        }

        super.onDestroy();
    }

    @Override
    protected void afterRequestPermission(int requestCode, boolean isAllGranted) {

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {

        }
    }
}