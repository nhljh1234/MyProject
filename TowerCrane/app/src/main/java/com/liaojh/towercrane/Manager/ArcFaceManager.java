package com.liaojh.towercrane.Manager;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.os.Environment;
import android.util.Log;

import com.arcsoft.arcfacedemo.faceserver.FaceServer;
import com.arcsoft.face.ErrorInfo;
import com.arcsoft.face.FaceEngine;
import com.arcsoft.imageutil.ArcSoftImageFormat;
import com.arcsoft.imageutil.ArcSoftImageUtil;
import com.arcsoft.imageutil.ArcSoftImageUtilError;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.SerialPort.SerialUtil;
import com.liaojh.towercrane.R;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.reactivex.CompletableOnSubscribe;

public class ArcFaceManager {
    private static ArcFaceManager instance;
    private MainActivity m_activity;
    private static ExecutorService m_executorService;
    public static final int MODE_PRIVATE = 0x0000;

    private ArcFaceManager() {

    }

    public static ArcFaceManager getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new ArcFaceManager();
                    m_executorService = Executors.newSingleThreadExecutor();
                }
            }
        }
        return instance;
    }

    public Boolean active(MainActivity activity) {
        m_activity = activity;
        int activeCode = FaceEngine.activeOnline(activity, Constant.APP_ID, Constant.SDK_KEY);
        if (activeCode == ErrorInfo.MOK || activeCode == ErrorInfo.MERR_ASF_ALREADY_ACTIVATED) {
            //本地人脸库初始化
            FaceServer.getInstance().init(activity);
            //startRegisterFace();
            return true;
        }
        return false;
    }

    public void startRegisterFace() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                registerFace();
            }
        }).start();
    }

    private void registerFace() {
        final File[] jpgFiles = m_activity.getExternalFilesDir("register").listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(FaceServer.IMG_SUFFIX);
            }
        });
        m_executorService.execute(new Runnable() {
            @Override
            public void run() {
                final int totalCount = jpgFiles.length;
                for (int i = 0; i < totalCount; i++) {
                    final File jpgFile = jpgFiles[i];
                    Bitmap bitmap = BitmapFactory.decodeFile(jpgFile.getAbsolutePath());
                    if (bitmap == null) {
                        continue;
                    }
                    bitmap = ArcSoftImageUtil.getAlignedBitmap(bitmap, true);
                    if (bitmap == null) {
                        continue;
                    }
                    byte[] bgr24 = ArcSoftImageUtil.createImageData(bitmap.getWidth(), bitmap.getHeight(), ArcSoftImageFormat.BGR24);
                    int transformCode = ArcSoftImageUtil.bitmapToImageData(bitmap, bgr24, ArcSoftImageFormat.BGR24);
                    if (transformCode != ArcSoftImageUtilError.CODE_SUCCESS) {
                        return;
                    }
                    boolean success = FaceServer.getInstance().registerBgr24(m_activity, bgr24, bitmap.getWidth(), bitmap.getHeight(),
                            jpgFile.getName().substring(0, jpgFile.getName().lastIndexOf(".")));
                    if (success) {
                        Log.v(Constant.LogTag, "注册成功");
                    }
                }
            }
        });
    }
}
