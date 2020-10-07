package com.liaojh.towercrane.Manager;

import android.app.DownloadManager;
import android.net.Uri;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.DownloadUtils.DownloadUtils;
import com.liaojh.towercrane.SerialPort.SerialUtil;

//更新逻辑
public class UpdateManager {
    private static UpdateManager instance;
    private MainActivity m_activity;

    private UpdateManager() {

    }

    public static UpdateManager getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new UpdateManager();
                }
            }
        }
        return instance;
    }

    public void init(MainActivity activity) {
        m_activity = activity;
    }

    public void onReceiveNewVersion(int version, String address) {
        if (version > Constant.Version && m_activity != null) {
            new DownloadUtils(m_activity, address, "qq.apk");
        }
    }
}
