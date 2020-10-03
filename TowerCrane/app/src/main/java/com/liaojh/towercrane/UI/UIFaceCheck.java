package com.liaojh.towercrane.UI;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.RectF;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.params.InputConfiguration;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.Image;
import android.media.ImageReader;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.util.Log;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Gravity;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import androidx.core.app.ActivityCompat;

import static android.os.Looper.getMainLooper;

public class UIFaceCheck implements InterfaceDialog {
    private LinearLayout layoutCheckFace;

    private TextureView textureView;

    private MainActivity m_activity;

    private CameraDevice mCameraDevice;
    private CameraManager mCameraManager;//摄像头管理器
    private Handler childHandler, mainHandler;
    private String mCameraID;//摄像头Id 0 为后  1 为前
    private CameraCaptureSession m_cameraCaptureSession;
    private Size m_previewSize;

    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();

    ///为了使照片竖直显示
    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }


    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == Constant.Handler_Type.CheckFace) {
                takePicture();
            }
            super.handleMessage(msg);
        }
    };

    //更新主界面时间
    private Timer timerCheckFace = new Timer();
    private TimerTask timerTaskCheckFace = new TimerTask() {
        @Override
        public void run() {
            if (mCameraDevice == null) {
                return;
            }
            Message message = new Message();
            message.obj = Constant.Handler_Type.CheckFace;
            handler.sendMessage(message);
        }
    };

    /**
     * 摄像头创建监听
     */
    private CameraDevice.StateCallback stateCallback = new CameraDevice.StateCallback() {
        @Override
        public void onOpened(CameraDevice camera) {//打开摄像头
            mCameraDevice = camera;
            //开启预览
            startPreview();
        }

        @Override
        public void onDisconnected(CameraDevice camera) {//关闭摄像头
            if (mCameraDevice != null) {
                mCameraDevice.close();
                mCameraDevice = null;
            }
        }

        @Override
        public void onError(CameraDevice camera, int error) {//发生错误
            m_activity.showToast("摄像头开启失败");
        }
    };

    /**
     * 拍照
     */
    private void takePicture() {
        if (mCameraDevice == null) {
            return;
        }

        Bitmap bitmap = Bitmap.createBitmap(m_previewSize.getWidth(), m_previewSize.getHeight(), Bitmap.Config.RGB_565);
        textureView.getBitmap(bitmap);

    }

    private Size getOptimalSize(Size[] sizeMap, int width, int height) {
        List<Size> sizeList = new ArrayList<>();
        for (Size option : sizeMap) {
            if (width > height) {
                if (option.getWidth() > width && option.getHeight() > height) {
                    sizeList.add(option);
                }
            } else {
                if (option.getWidth() > height && option.getHeight() > width) {
                    sizeList.add(option);
                }
            }
        }
        if (sizeList.size() > 0) {
            return Collections.min(sizeList, new Comparator<Size>() {
                @Override
                public int compare(Size lhs, Size rhs) {
                    return Long.signum(lhs.getWidth() * lhs.getHeight() - rhs.getWidth() * rhs.getHeight());
                }
            });
        }
        return sizeMap[0];
    }

    /**
     * 开始预览
     */
    private void startPreview() {
        try {
            SurfaceTexture mSurfaceTexture = textureView.getSurfaceTexture();
            mSurfaceTexture.setDefaultBufferSize(m_previewSize.getWidth(), m_previewSize.getHeight());
            Surface previewSurface = new Surface(mSurfaceTexture);
            // 创建预览需要的CaptureRequest.Builder
            final CaptureRequest.Builder previewRequestBuilder = mCameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            // 将surface作为CaptureRequest.Builder的目标
            previewRequestBuilder.addTarget(previewSurface);
            // 创建CameraCaptureSession，该对象负责管理处理预览请求和拍照请求
            mCameraDevice.createCaptureSession(Arrays.asList(previewSurface), new CameraCaptureSession.StateCallback() // ③
            {
                @Override
                public void onConfigured(CameraCaptureSession cameraCaptureSession) {
                    if (mCameraDevice == null) {
                        return;
                    }
                    try {
                        // 自动对焦
                        previewRequestBuilder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
                        // 显示预览
                        CaptureRequest previewRequest = previewRequestBuilder.build();
                        m_cameraCaptureSession = cameraCaptureSession;
                        m_cameraCaptureSession.setRepeatingRequest(previewRequest, null, childHandler);
                    } catch (CameraAccessException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onConfigureFailed(CameraCaptureSession cameraCaptureSession) {
                    m_activity.showToast("摄像头配置失败");
                }
            }, childHandler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void initCamera() {
        HandlerThread handlerThread = new HandlerThread("Camera");
        handlerThread.start();
        childHandler = new Handler(handlerThread.getLooper());
        mainHandler = new Handler(getMainLooper());
        mCameraID = "" + CameraCharacteristics.LENS_FACING_FRONT;//后摄像头
        //获取摄像头管理
        mCameraManager = (CameraManager) m_activity.getSystemService(Context.CAMERA_SERVICE);
        try {
            //遍历所有摄像头
            for (String cameraId : mCameraManager.getCameraIdList()) {
                if (ActivityCompat.checkSelfPermission(m_activity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    CameraCharacteristics characteristics = mCameraManager.getCameraCharacteristics(cameraId);
                    Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
                    //此处默认打开后置摄像头
                    if (facing != null && facing == CameraCharacteristics.LENS_FACING_FRONT)
                        continue;
                    //获取StreamConfigurationMap，它是管理摄像头支持的所有输出格式和尺寸
                    StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
                    assert map != null;
                    //根据TextureView的尺寸设置预览尺寸
                    m_previewSize = getOptimalSize(map.getOutputSizes(SurfaceTexture.class), textureView.getWidth(), textureView.getHeight());

                    //configureTransform();

                    //修改textureView尺寸
//                    LinearLayout.LayoutParams lpNew = new LinearLayout.LayoutParams(textureView.getWidth(), (int) (textureView.getWidth() * (((float) m_previewSize.getHeight()) / m_previewSize.getWidth())));
//                    lpNew.gravity = Gravity.CENTER;
//                    textureView.setLayoutParams(lpNew);

                    mCameraID = cameraId;
                    //根据屏幕的显示方向调整预览方向
                    //configureTransform(textureView.getHeight(), textureView.getWidth());
                    mCameraManager.openCamera(mCameraID, stateCallback, mainHandler);
                    break;
                }
            }
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void show() {
        layoutCheckFace.setVisibility(View.VISIBLE);
        textureView.setVisibility(View.VISIBLE);
        if (mCameraManager != null) {
            startPreview();
        }
    }

    @Override
    public void hide() {
        layoutCheckFace.setVisibility(View.INVISIBLE);
        textureView.setVisibility(View.INVISIBLE);

        if (m_cameraCaptureSession != null) {
            try {
                m_cameraCaptureSession.stopRepeating();
                m_cameraCaptureSession = null;
            } catch (CameraAccessException e) {

            }
        }
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        layoutCheckFace = m_activity.findViewById(R.id.layout_face_check);
        layoutCheckFace.setOnClickListener(this);

        textureView = m_activity.findViewById(R.id.texture_view_face_check);
        textureView.setSurfaceTextureListener(new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
                if (m_activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
                    initCamera();
                } else {
                    m_activity.showToast("找不到摄像头");
                }
            }

            @Override
            public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

            }

            @Override
            public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
                return false;
            }

            @Override
            public void onSurfaceTextureUpdated(SurfaceTexture surface) {

            }
        });

        //开启时间信息更新定时器
        timerCheckFace.schedule(timerTaskCheckFace, 0, Constant.FACE_CHECK_INTERVAL);
    }

    @Override
    public void onUIStart() {
        if (mCameraManager != null) {
            startPreview();
        }
    }

    @Override
    public void onUIDestroy() {
        if (timerCheckFace != null) {// 停止timer
            timerCheckFace.cancel();
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_face_check:
                hide();
                break;
        }
    }
}
