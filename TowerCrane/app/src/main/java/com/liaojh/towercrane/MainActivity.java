package com.liaojh.towercrane;

import Data.AppGlobalData;
import Data.TowerCraneRunData;
import Data.TowerCraneRunDataFactory;
import Tool.Tool;
import UI.UIAmplitudeRunInfo;
import UI.UITopBar;
import UI.UITowerCraneRunInfo;
import UI.UITurnAroundRunInfo;
import UI.UIUpDownRunInfo;
import UI.UIVideoInfo;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.WindowManager;

import com.hikvision.netsdk.ExceptionCallBack;
import com.hikvision.netsdk.HCNetSDK;

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {
    private UITopBar uiTopBar = new UITopBar();
    private UITowerCraneRunInfo uiTowerCraneRunInfo = new UITowerCraneRunInfo();
    private UIUpDownRunInfo uiUpDownRunInfo = new UIUpDownRunInfo();
    private UIAmplitudeRunInfo uiAmplitudeRunInfo = new UIAmplitudeRunInfo();
    private UITurnAroundRunInfo uiTurnAroundRunInfo = new UITurnAroundRunInfo();
    private UIVideoInfo uiVideoInfo = new UIVideoInfo();

    private TowerCraneRunData oldData;

    private int timerTimeTotal = 0;

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == AppGlobalData.Handler_Type.UpdateTowerCraneInfo) {
                TowerCraneRunData towerCraneRunData = TowerCraneRunDataFactory.getRunData();
                if (oldData != null) {
                    towerCraneRunData.setOldData(oldData);
                }

                timerTimeTotal = timerTimeTotal + AppGlobalData.TOWER_RUN_DATE_UPDATE_INTERVAL;
                AppGlobalData.csvFileManager.addData(towerCraneRunData);
                if (timerTimeTotal >= AppGlobalData.CSV_DATA_WRITE_INTERVAL) {
                    timerTimeTotal = 0;
                    AppGlobalData.csvFileManager.saveData();
                }

                oldData = towerCraneRunData;
                uiTopBar.onTowerCraneRunDateUpdate(towerCraneRunData);
                uiTowerCraneRunInfo.onTowerCraneRunDateUpdate(towerCraneRunData);
                uiUpDownRunInfo.onTowerCraneRunDateUpdate(towerCraneRunData);
                uiAmplitudeRunInfo.onTowerCraneRunDateUpdate(towerCraneRunData);
                uiTurnAroundRunInfo.onTowerCraneRunDateUpdate(towerCraneRunData);
                uiVideoInfo.onTowerCraneRunDateUpdate(towerCraneRunData);
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
            message.obj = AppGlobalData.Handler_Type.UpdateTowerCraneInfo;
            handler.sendMessage(message);
        }
    };

    private boolean initSdk() {
        // init net sdk
        if (!HCNetSDK.getInstance().NET_DVR_Init()) {
            Log.e(AppGlobalData.LogTag, "HCNetSDK init is failed!");
            return false;
        }
        HCNetSDK.getInstance().NET_DVR_SetLogToFile(3, "/mnt/sdcard/sdklog/", true);

        ExceptionCallBack oExceptionCbf = new ExceptionCallBack() {
            public void fExceptionCallBack(int iType, int iUserID, int iHandle) {
                System.out.println("recv exception, type:" + iType);
            }
        };
        if (!HCNetSDK.getInstance().NET_DVR_SetExceptionCallBack(oExceptionCbf)) {
            Log.e(AppGlobalData.LogTag, "NET_DVR_SetExceptionCallBack error");
            return false;
        }
        return true;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

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

        initSdk();

        if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        }

        //去掉头部
        getSupportActionBar().hide();
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        uiTopBar.onUICreate(this);
        uiTowerCraneRunInfo.onUICreate(this);
        uiUpDownRunInfo.onUICreate(this);
        uiAmplitudeRunInfo.onUICreate(this);
        uiTurnAroundRunInfo.onUICreate(this);
        uiVideoInfo.onUICreate(this);
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (!Tool.checkSDCardExist()) {
            new AlertDialog.Builder(this).setTitle("提示").setMessage("没有检测到SD卡").setPositiveButton("确定", null).show();
        }

        uiTopBar.onUIStart();
        uiTowerCraneRunInfo.onUIStart();
        uiUpDownRunInfo.onUIStart();
        uiAmplitudeRunInfo.onUIStart();
        uiTurnAroundRunInfo.onUIStart();
        uiVideoInfo.onUIStart();

        timerTimeTotal = 0;
        //开启时间信息更新定时器
        timerUpdateTowerCraneRunInfo.schedule(timerTaskUpdateTowerCraneRunInfo, 0, AppGlobalData.TOWER_RUN_DATE_UPDATE_INTERVAL);
    }

    @Override
    protected void onDestroy() {
        uiTopBar.onUIDestroy();
        uiTowerCraneRunInfo.onUIDestroy();
        uiUpDownRunInfo.onUIDestroy();
        uiAmplitudeRunInfo.onUIDestroy();
        uiTurnAroundRunInfo.onUIDestroy();
        uiVideoInfo.onUIDestroy();

        if (timerTaskUpdateTowerCraneRunInfo != null) {// 停止timer
            timerTaskUpdateTowerCraneRunInfo.cancel();
        }

        super.onDestroy();
    }
}