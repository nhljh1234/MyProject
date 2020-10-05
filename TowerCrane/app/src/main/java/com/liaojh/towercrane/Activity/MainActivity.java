package com.liaojh.towercrane.Activity;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.NetManager;
import com.liaojh.towercrane.Manager.USBManager;
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
import com.liaojh.towercrane.UI.UILogin;
import com.liaojh.towercrane.UI.UISetCalibration;
import com.liaojh.towercrane.UI.UISetting;
import com.liaojh.towercrane.UI.UITopBar;
import com.liaojh.towercrane.UI.UITowerCraneRunInfo;
import com.liaojh.towercrane.UI.UITurnAroundRunInfo;
import com.liaojh.towercrane.UI.UIUpDownRunInfo;
import com.liaojh.towercrane.UI.UIVideoInfo;

import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
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

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends BaseActivity {
    public UILogin uiLogin = new UILogin();
    public UISetting uiSetting = new UISetting();
    public UISetCalibration uiSetCalibration = new UISetCalibration();
    public UIAddCamera uiAddCamera = new UIAddCamera();
    public UIVideoInfo uiVideoInfo = new UIVideoInfo();
    public UICameraList uiCameraList = new UICameraList();
    public UIFaceCheck uiFaceCheck = new UIFaceCheck();

    private InterfaceUI[] uis = new InterfaceUI[] {
            new UITopBar(),
            new UITowerCraneRunInfo(),
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
    };

    private TowerCraneRunData oldData;

    private int timerTimeTotal = 0;

    private static final String[] NEEDED_PERMISSIONS = new String[]{
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS,
    };

    private static final int ACTION_REQUEST_PERMISSIONS = 1;

    private final BaseActivity activity = this;

    private TowerCraneRunDataFactory towerCraneRunDataFactory = new TowerCraneRunDataFactory();

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == Constant.Handler_Type.UpdateTowerCraneInfo) {
                TowerCraneRunData towerCraneRunData = towerCraneRunDataFactory.getRunData();
                if (oldData != null) {
                    towerCraneRunData.setOldData(oldData);
                }

                timerTimeTotal = timerTimeTotal + Constant.TOWER_RUN_DATE_UPDATE_INTERVAL;
                CSVFileManager.getInstance().addData(towerCraneRunData);
                if (timerTimeTotal >= Constant.CSV_DATA_WRITE_INTERVAL) {
                    timerTimeTotal = 0;
                    CSVFileManager.getInstance().saveData();
                }

                oldData = towerCraneRunData;
                for (int i = 0; i < uis.length; i++) {
                    uis[i].onTowerCraneRunDateUpdate(towerCraneRunData);
                }
            }
            super.handleMessage(msg);
        }
    };

    //更新主界面时间
    private Timer timerUpdateTowerCraneRunInfo = new Timer();
    private TimerTask timerTaskUpdateTowerCraneRunInfo = new TimerTask() {
        @Override
        public void run() {
            Message message = new Message();
            message.obj = Constant.Handler_Type.UpdateTowerCraneInfo;
            handler.sendMessage(message);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        USBManager.getInstance().init(this);
        LocalStorage.getInstance().init(this);
        NetManager.getInstance().connect();

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

        timerTimeTotal = 0;
        //开启时间信息更新定时器
        timerUpdateTowerCraneRunInfo.schedule(timerTaskUpdateTowerCraneRunInfo, 0, Constant.TOWER_RUN_DATE_UPDATE_INTERVAL);

        ((LinearLayout) activity.findViewById(R.id.layout_setting)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                uiLogin.show();
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();

        for (int i = 0; i < uis.length; i++) {
            uis[i].onUIStart();
        }

        //SerialUtil.getInstance().Connect("ttyS1");
    }



    @Override
    protected void onDestroy() {
        for (int i = 0; i < uis.length; i++) {
            uis[i].onUIDestroy();
        }

        if (timerTaskUpdateTowerCraneRunInfo != null) {// 停止timer
            timerTaskUpdateTowerCraneRunInfo.cancel();
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