package com.liaojh.towercrane.UI;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Point;
import android.hardware.Camera;
import android.util.DisplayMetrics;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.LinearLayout;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Camera.CameraHelper;
import com.liaojh.towercrane.Camera.CameraListener;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.R;
import com.yf.rk3399_gpio_jni.yf_gpio_manager;
import java.util.Timer;
import java.util.TimerTask;

public class UIFaceCheck implements InterfaceDialog, ViewTreeObserver.OnGlobalLayoutListener {
    private LinearLayout layoutCheckFace;
    private MainActivity m_activity;
    private TextureView previewView;
    private Button btnBack;

    private CameraHelper cameraHelper;

    private Timer timer;
    private TimerTask timerTask;
    private AlertDialog alertDialog;

    /**
     * 人脸识别时间
     */
    private static final int CHECK_TIME = 20;

    @Override
    public void show() {
        layoutCheckFace.setVisibility(View.VISIBLE);
        cameraHelper.start();
        //开启时间信息更新定时器
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
        timer = new Timer();
        timerTask = new TimerTask() {
            @Override
            public void run() {
                close();
            }
        };
        timer.schedule(timerTask, CHECK_TIME * 1000, CHECK_TIME * 1000);
    }

    @Override
    public void hide() {
        layoutCheckFace.setVisibility(View.GONE);
        cameraHelper.stop();
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        m_activity = activityIn;

        layoutCheckFace = m_activity.findViewById(R.id.layout_face_check);

        btnBack = m_activity.findViewById(R.id.btn_close_face_check);
        btnBack.setOnClickListener(this);

        previewView = m_activity.findViewById(R.id.texture_view_face_check);
        //在布局结束后才做初始化操作
        previewView.getViewTreeObserver().addOnGlobalLayoutListener(this);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_close_face_check:
                hide();
                break;
        }
    }

    @Override
    public void onGlobalLayout() {
        previewView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
        initCamera();
    }

    private void success() {
        m_activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (alertDialog != null) {
                    alertDialog.dismiss();
                }
                m_activity.uiTopBar.setRealNameStatus(true);
                alertDialog = new AlertDialog.Builder(m_activity)
                        .setTitle(R.string.batch_process_notification)
                        .setMessage(m_activity.getString(R.string.check_success))
                        .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                hide();
                            }
                        }).setCancelable(false).create();
                alertDialog.show();
            }
        });
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                    if (layoutCheckFace.getVisibility() != View.VISIBLE) {
                        return;
                    }
                    close();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    private void fail() {
        m_activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (alertDialog != null) {
                    alertDialog.dismiss();
                }
                m_activity.uiTopBar.setRealNameStatus(false);
                alertDialog = new AlertDialog.Builder(m_activity)
                        .setTitle(R.string.batch_process_notification)
                        .setMessage(m_activity.getString(R.string.check_fail))
                        .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                hide();
                            }
                        }).setCancelable(false).create();
                alertDialog.show();
            }
        });
        //输出低电平
        yf_gpio_manager.getInstance().outputLowValue();
    }

    private void close() {
        m_activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hide();
                if (alertDialog != null) {
                    alertDialog.hide();
                    alertDialog = null;
                }
            }
        });
    }

    private void initCamera() {
        DisplayMetrics metrics = new DisplayMetrics();
        m_activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);

        CameraListener cameraListener = new CameraListener() {
            @Override
            public void onCameraOpened(Camera camera, int cameraId, int displayOrientation, boolean isMirror) {

            }


            @Override
            public void onPreview(final byte[] rgb, Camera camera) {

            }

            @Override
            public void onCameraClosed() {

            }

            @Override
            public void onCameraError(Exception e) {

            }

            @Override
            public void onCameraConfigurationChanged(int cameraID, int displayOrientation) {

            }
        };

        cameraHelper = new CameraHelper.Builder()
                .previewViewSize(new Point(previewView.getMeasuredWidth(), previewView.getMeasuredHeight()))
                .rotation(m_activity.getWindowManager().getDefaultDisplay().getRotation())
                .specificCameraId(Camera.CameraInfo.CAMERA_FACING_FRONT)
                .isMirror(false)
                .previewOn(previewView)
                .cameraListener(cameraListener)
                .build();
        cameraHelper.init();
    }
}
