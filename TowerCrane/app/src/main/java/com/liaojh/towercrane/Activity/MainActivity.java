package com.liaojh.towercrane.Activity;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Data.TowerCraneRunDataFactory;
import com.liaojh.towercrane.Manager.CSVFileManager;
import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.Tool.CSVFileTool;
import com.liaojh.towercrane.Tool.Tool;
import com.liaojh.towercrane.UI.InterfaceUI;
import com.liaojh.towercrane.UI.UIAmplitudeRunInfo;
import com.liaojh.towercrane.UI.UILogin;
import com.liaojh.towercrane.UI.UITopBar;
import com.liaojh.towercrane.UI.UITowerCraneRunInfo;
import com.liaojh.towercrane.UI.UITurnAroundRunInfo;
import com.liaojh.towercrane.UI.UIUpDownRunInfo;
import com.liaojh.towercrane.UI.UIVideoInfo;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.DocumentsContract;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.MediaController;
import android.widget.VideoView;

import com.liaojh.towercrane.R;

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends BaseActivity {
    private UILogin uiLogin = new UILogin();

    private InterfaceUI[] uis = new InterfaceUI[] {
            new UITopBar(),
            new UITowerCraneRunInfo(),
            new UIUpDownRunInfo(),
            new UIAmplitudeRunInfo(),
            new UITurnAroundRunInfo(),
            new UIVideoInfo(),
            uiLogin,
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

    private static final int ACTIVE_OPEN_DOCUMENT_TREE = 2;

    private final BaseActivity activity = this;

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == Constant.Handler_Type.UpdateTowerCraneInfo) {
                TowerCraneRunData towerCraneRunData = TowerCraneRunDataFactory.getRunData();
                if (oldData != null) {
                    towerCraneRunData.setOldData(oldData);
                }

                timerTimeTotal = timerTimeTotal + Constant.TOWER_RUN_DATE_UPDATE_INTERVAL;
                Constant.csvFileManager.addData(towerCraneRunData);
                if (timerTimeTotal >= Constant.CSV_DATA_WRITE_INTERVAL) {
                    timerTimeTotal = 0;
                    Constant.csvFileManager.saveData(activity);
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

    private void openDir() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        startActivityForResult(intent, ACTIVE_OPEN_DOCUMENT_TREE);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        Constant.localStorage = new LocalStorage(getSharedPreferences("Data", Activity.MODE_PRIVATE));

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

        //开启文件夹权限
        //openDir();

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

        if (!Tool.checkSDCardExist(this)) {
            showToast("不存在外置SD卡");
        }

        for (int i = 0; i < uis.length; i++) {
            uis[i].onUIStart();
        }
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
            if (requestCode == ACTIVE_OPEN_DOCUMENT_TREE) {
                Uri uri = data.getData();
                if (uri != null) {
                    String[] strs = uri.getPath().split("/");
                    String uriSdName = strs[strs.length - 1];
                    strs = Tool.getStoragePath(this).split("/");
                    String sdName = strs[strs.length - 1];
                    Log.e(Constant.LogTag, uriSdName);
                    Log.e(Constant.LogTag, sdName);
                    if (uriSdName.indexOf(sdName) >= 0) {
                        Constant.csvFileManager.setUri(uri);
                    } else {
                        openDir();
                    }
                } else {
                    openDir();
                }
            }
        }
    }
}