package com.liaojh.towercrane.Manager;
import android.text.TextUtils;
import android.util.Log;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.FaceCheck.IWxFaceCallback;
import com.liaojh.towercrane.FaceCheck.wxfacejni;

import java.io.File;

public class FaceCheckManager {
    private static FaceCheckManager instance;
    private long faceHandle = 0;
    private wxfacejni wxface = new wxfacejni();

    private FaceCheckManager() {

    }

    public static FaceCheckManager getInstance() {
        if (instance == null) {
            synchronized (FaceCheckManager.class) {
                if (instance == null) {
                    instance = new FaceCheckManager();
                }
            }
        }
        return instance;
    }

    public static File getInternalCacheDirectory(MainActivity activity, String type) {
        File appCacheDir = null;
        if (TextUtils.isEmpty(type)){
            appCacheDir = activity.getCacheDir();// /data/data/app_package_name/cache
        }else {
            appCacheDir = new File(activity.getFilesDir(),type);// /data/data/app_package_name/files/type
        }

        if (!appCacheDir.exists()&&!appCacheDir.mkdirs()){
            Log.e("getInternalDirectory","getInternalDirectory fail ,the reason is make directory fail !");
        }
        return appCacheDir;
    }

    public void init(MainActivity activity) {
        String deviceid = "88889999";
        String appName = "wxfacetest";
        String root_Path = getInternalCacheDirectory(activity, null) + "/";
        faceHandle = wxface.wxface_init(deviceid, appName, root_Path, new IWxFaceCallback() {
            @Override
            public int wxstatus_call(long handle, int state, int unused) {
                Log.d("wxstatus_call", "state = " + Integer.toString(state));
                return 0;
            }

            @Override
            public int wxface_return(long handle, int facestate, float score, String faceid, String name, byte[] extdata) {
                Log.d("wxface_return", "facestate = " + Integer.toString(facestate) + ", score = " +
                        Float.toString(score) + ", faceid=" + faceid + ", name=" + name);
                return 0;
            }

            @Override
            public int wxface_boxs(long handle, int faces, int[] xys) {
                Log.d("wxface_boxs", "faces = " + Integer.toString(faces));
                for(int i=0;i<faces;i++) {
                    Log.d("boxs", "x1, y1, x2, y2 = " + String.format("%d,%d,%d,%d", xys[i * 4], xys[i * 4+1], xys[i * 4+2], xys[i * 4+3]));
                }
                return 0;
            }
        });
    }
}
