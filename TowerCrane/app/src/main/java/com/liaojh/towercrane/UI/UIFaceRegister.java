package com.liaojh.towercrane.UI;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.hardware.Camera;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.TextureView;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.arcsoft.arcfacedemo.faceserver.FaceServer;
import com.arcsoft.arcfacedemo.model.DrawInfo;
import com.arcsoft.arcfacedemo.model.FacePreviewInfo;
import com.arcsoft.arcfacedemo.util.ConfigUtil;
import com.arcsoft.arcfacedemo.util.DrawHelper;
import com.arcsoft.arcfacedemo.util.camera.CameraHelper;
import com.arcsoft.arcfacedemo.util.camera.CameraListener;
import com.arcsoft.arcfacedemo.util.face.FaceHelper;
import com.arcsoft.arcfacedemo.util.face.FaceListener;
import com.arcsoft.arcfacedemo.util.face.RecognizeColor;
import com.arcsoft.arcfacedemo.util.face.RequestFeatureStatus;
import com.arcsoft.arcfacedemo.widget.FaceRectView;
import com.arcsoft.face.AgeInfo;
import com.arcsoft.face.ErrorInfo;
import com.arcsoft.face.FaceEngine;
import com.arcsoft.face.FaceFeature;
import com.arcsoft.face.GenderInfo;
import com.arcsoft.face.LivenessInfo;
import com.arcsoft.face.enums.DetectFaceOrientPriority;
import com.arcsoft.face.enums.DetectMode;
import com.arcsoft.imageutil.ArcSoftImageFormat;
import com.arcsoft.imageutil.ArcSoftImageUtil;
import com.arcsoft.imageutil.ArcSoftImageUtilError;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Manager.ArcFaceManager;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;

public class UIFaceRegister implements InterfaceDialog, ViewTreeObserver.OnGlobalLayoutListener {
    private LinearLayout layoutFaceRegister;
    private FaceRectView faceRectView;
    private Button btnRegister, btnBack;
    private EditText editUserName;
    private TextureView previewView;

    private MainActivity m_activity;

    private static final int ACTION_REQUEST_PERMISSIONS = 1;
    private static final int MAX_DETECT_NUM = 1;
    private CameraHelper cameraHelper;
    private DrawHelper drawHelper;
    private Camera.Size previewSize;
    private Integer rgbCameraID = Camera.CameraInfo.CAMERA_FACING_FRONT;
    private FaceEngine ftEngine;
    private FaceEngine frEngine;
    private FaceEngine flEngine;
    private int ftInitCode = -1;
    private int frInitCode = -1;
    private int flInitCode = -1;
    private FaceHelper faceHelper;
    private Boolean canRegister = false;
    private Bitmap bitmapRegister = null;
    private ExecutorService executorService;

    @Override
    public void show() {
        layoutFaceRegister.setVisibility(View.VISIBLE);
        executorService = Executors.newSingleThreadExecutor();
        canRegister = false;
        bitmapRegister = null;
        editUserName.setText("");
        cameraHelper.start();
    }

    @Override
    public void hide() {
        layoutFaceRegister.setVisibility(View.GONE);
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdownNow();
        }
        canRegister = false;
        bitmapRegister = null;
        m_activity.uiSetting.show();
        cameraHelper.stop();
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        layoutFaceRegister = activity.findViewById(R.id.layout_face_register);
        layoutFaceRegister.setOnClickListener(this);

        faceRectView = activity.findViewById(R.id.single_camera_face_rect_view_register);

        previewView = activity.findViewById(R.id.texture_view_face_register);
        //在布局结束后才做初始化操作
        previewView.getViewTreeObserver().addOnGlobalLayoutListener(this);

        editUserName = activity.findViewById(R.id.edit_face_register_user_name);

        btnRegister = activity.findViewById(R.id.btn_face_register);
        btnRegister.setOnClickListener(this);

        btnBack = activity.findViewById(R.id.btn_face_register_back);
        btnBack.setOnClickListener(this);
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
        InputMethodManager inputManger = (InputMethodManager) m_activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
        inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
        switch (view.getId()) {
            case R.id.btn_face_register:
                register();
                break;
            case R.id.btn_face_register_back:
                hide();
                break;
        }
    }

    @Override
    public void onGlobalLayout() {
        previewView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
        initEngine();
        initCamera();
    }

    /**
     * 初始化引擎
     */
    private void initEngine() {
        ftEngine = new FaceEngine();
        ftInitCode = ftEngine.init(m_activity, DetectMode.ASF_DETECT_MODE_VIDEO, DetectFaceOrientPriority.ASF_OP_ALL_OUT,
                16, MAX_DETECT_NUM, FaceEngine.ASF_FACE_DETECT);

        frEngine = new FaceEngine();
        frInitCode = frEngine.init(m_activity, DetectMode.ASF_DETECT_MODE_IMAGE, DetectFaceOrientPriority.ASF_OP_0_ONLY,
                16, MAX_DETECT_NUM, FaceEngine.ASF_FACE_RECOGNITION);

        flEngine = new FaceEngine();
        flInitCode = flEngine.init(m_activity, DetectMode.ASF_DETECT_MODE_IMAGE, DetectFaceOrientPriority.ASF_OP_0_ONLY,
                16, MAX_DETECT_NUM, FaceEngine.ASF_LIVENESS);

        Log.i(Constant.LogTag, "initEngine:  init: " + ftInitCode);

        if (ftInitCode != ErrorInfo.MOK) {
            String error = m_activity.getString(R.string.specific_engine_init_failed, "ftEngine", ftInitCode);
            Log.i(Constant.LogTag, "initEngine: " + error);
            m_activity.showToast(error);
        }
        if (frInitCode != ErrorInfo.MOK) {
            String error = m_activity.getString(R.string.specific_engine_init_failed, "frEngine", frInitCode);
            Log.i(Constant.LogTag, "initEngine: " + error);
            m_activity.showToast(error);
        }
        if (flInitCode != ErrorInfo.MOK) {
            String error = m_activity.getString(R.string.specific_engine_init_failed, "flEngine", flInitCode);
            Log.i(Constant.LogTag, "initEngine: " + error);
            m_activity.showToast(error);
        }
    }

    /**
     * 裁剪图片
     */
    private Bitmap cropBitmap(Bitmap bitmap) {
        int w = bitmap.getWidth(); // 得到图片的宽，高
        int h = bitmap.getHeight();
        return Bitmap.createBitmap(bitmap, 0, 0, w - (w % 4), h - (h % 4), null, false);
    }

    private void initCamera() {
        DisplayMetrics metrics = new DisplayMetrics();
        m_activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
        final MainActivity activity = m_activity;

        final FaceListener faceListener = new FaceListener() {
            @Override
            public void onFail(Exception e) {
                Log.e(Constant.LogTag, "faceListener onFail: " + e.getMessage());
            }

            //请求FR的回调
            @Override
            public void onFaceFeatureInfoGet(@Nullable final FaceFeature faceFeature, final Integer requestId, final Integer errorCode) {
                //FR成功
                if (faceFeature != null) {
                    final Bitmap bitmap = previewView.getBitmap();
                    final Bitmap cropBitmap = previewView.getBitmap(cropBitmap(bitmap));
                    byte[] bgr24 = ArcSoftImageUtil.createImageData(cropBitmap.getWidth(), cropBitmap.getHeight(), ArcSoftImageFormat.BGR24);
                    int transformCode = ArcSoftImageUtil.bitmapToImageData(cropBitmap, bgr24, ArcSoftImageFormat.BGR24);
                    if (transformCode != ArcSoftImageUtilError.CODE_SUCCESS) {
                        canRegister = false;
                        return;
                    }
                    if (FaceServer.getInstance().judgeRegisterBgr24(activity, bgr24, cropBitmap.getWidth(), cropBitmap.getHeight(), editUserName.getText().toString())) {
                        canRegister = true;
                        bitmapRegister = cropBitmap;
                    } else {
                        canRegister = false;
                    }
                }
            }

            @Override
            public void onFaceLivenessInfoGet(@Nullable LivenessInfo livenessInfo, final Integer requestId, Integer errorCode) {

            }
        };


        CameraListener cameraListener = new CameraListener() {
            @Override
            public void onCameraOpened(Camera camera, int cameraId, int displayOrientation, boolean isMirror) {
                Camera.Size lastPreviewSize = previewSize;
                previewSize = camera.getParameters().getPreviewSize();
                drawHelper = new DrawHelper(previewSize.width, previewSize.height, previewView.getWidth(), previewView.getHeight(), displayOrientation
                        , cameraId, isMirror, false, false);
                Log.i(Constant.LogTag, "onCameraOpened: " + drawHelper.toString());
                // 切换相机的时候可能会导致预览尺寸发生变化
                if (faceHelper == null ||
                        lastPreviewSize == null ||
                        lastPreviewSize.width != previewSize.width || lastPreviewSize.height != previewSize.height) {
                    Integer trackedFaceCount = null;
                    // 记录切换时的人脸序号
                    if (faceHelper != null) {
                        trackedFaceCount = faceHelper.getTrackedFaceCount();
                        faceHelper.release();
                    }
                    faceHelper = new FaceHelper.Builder()
                            .ftEngine(ftEngine)
                            .frEngine(frEngine)
                            .flEngine(flEngine)
                            .frQueueSize(MAX_DETECT_NUM)
                            .flQueueSize(MAX_DETECT_NUM)
                            .previewSize(previewSize)
                            .faceListener(faceListener)
                            .trackedFaceCount(trackedFaceCount == null ? ConfigUtil.getTrackedFaceCount(m_activity.getApplicationContext()) : trackedFaceCount)
                            .build();
                }
            }


            @Override
            public void onPreview(final byte[] nv21, Camera camera) {
                if (faceRectView != null) {
                    faceRectView.clearFaceInfo();
                }
                List<FacePreviewInfo> facePreviewInfoList = faceHelper.onPreviewFrame(nv21);
                if (facePreviewInfoList != null && faceRectView != null && drawHelper != null) {
                    drawPreviewInfo(facePreviewInfoList);
                }
                if (facePreviewInfoList != null && facePreviewInfoList.size() > 0 && previewSize != null) {
                    for (int i = 0; i < facePreviewInfoList.size(); i++) {
                        faceHelper.requestFaceFeature(nv21, facePreviewInfoList.get(i).getFaceInfo(), previewSize.width, previewSize.height, FaceEngine.CP_PAF_NV21, facePreviewInfoList.get(i).getTrackId());
                    }
                }
            }

            @Override
            public void onCameraClosed() {
                Log.i(Constant.LogTag, "onCameraClosed: ");
            }

            @Override
            public void onCameraError(Exception e) {
                Log.i(Constant.LogTag, "onCameraError: " + e.getMessage());
            }

            @Override
            public void onCameraConfigurationChanged(int cameraID, int displayOrientation) {
                if (drawHelper != null) {
                    drawHelper.setCameraDisplayOrientation(displayOrientation);
                }
                Log.i(Constant.LogTag, "onCameraConfigurationChanged: " + cameraID + "  " + displayOrientation);
            }
        };

        cameraHelper = new CameraHelper.Builder()
                .previewViewSize(new Point(previewView.getMeasuredWidth(), previewView.getMeasuredHeight()))
                .rotation(m_activity.getWindowManager().getDefaultDisplay().getRotation())
                .specificCameraId(rgbCameraID != null ? rgbCameraID : Camera.CameraInfo.CAMERA_FACING_FRONT)
                .isMirror(false)
                .previewOn(previewView)
                .cameraListener(cameraListener)
                .build();
        cameraHelper.init();
    }

    private void drawPreviewInfo(List<FacePreviewInfo> facePreviewInfoList) {
        List<DrawInfo> drawInfoList = new ArrayList<>();
        for (int i = 0; i < facePreviewInfoList.size(); i++) {
            int color = canRegister ? RecognizeColor.COLOR_SUCCESS : RecognizeColor.COLOR_FAILED;
            String str = canRegister ? "已识别" : "未识别";

            drawInfoList.add(new DrawInfo(drawHelper.adjustRect(facePreviewInfoList.get(i).getFaceInfo().getRect()),
                    GenderInfo.UNKNOWN, AgeInfo.UNKNOWN_AGE, LivenessInfo.UNKNOWN, color, str));
        }
        drawHelper.draw(faceRectView, drawInfoList);
    }

    private void register() {
        if (bitmapRegister == null || canRegister == false || editUserName.getText().toString().length() == 0) {
            return;
        }
        final Bitmap bitmap = bitmapRegister;
        final MainActivity activity = m_activity;
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                byte[] bgr24 = ArcSoftImageUtil.createImageData(bitmap.getWidth(), bitmap.getHeight(), ArcSoftImageFormat.BGR24);
                int transformCode = ArcSoftImageUtil.bitmapToImageData(bitmap, bgr24, ArcSoftImageFormat.BGR24);
                if (transformCode != ArcSoftImageUtilError.CODE_SUCCESS) {
                    return;
                }
                boolean success = FaceServer.getInstance().registerBgr24(activity, bgr24, bitmap.getWidth(), bitmap.getHeight(), editUserName.getText().toString());
                if (success) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            new AlertDialog.Builder(activity)
                                    .setTitle(R.string.batch_process_notification)
                                    .setMessage(R.string.face_register_success)
                                    .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            hide();
                                        }
                                    }).setCancelable(false).create().show();
                        }
                    });
                }
            }
        });
    }
}
