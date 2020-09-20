package Manager;

import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.util.Log;

import com.hikvision.netsdk.ExceptionCallBack;
import com.hikvision.netsdk.HCNetSDK;
import com.hikvision.netsdk.NET_DVR_DEVICEINFO_V30;

import java.util.ArrayList;

import Data.AppGlobalData;
import Data.VideoData;

public class VideoManager {
    ArrayList<VideoData> videoList = new ArrayList<>();

    private Handler m_handler;

    private int count = 0;

    private synchronized void OnSearchFinish(VideoData videoData) {
        if (videoData != null) {
            videoList.add(videoData);
        }
        count++;
        if (count == 256) {
            Message message = new Message();
            message.obj = AppGlobalData.Handler_Type.SearchFinish;
            m_handler.sendMessage(message);
        }
    }

    public VideoManager(Handler handler) {
        m_handler = handler;
    }

    public ArrayList<VideoData> getVideoList() {
        return videoList;
    }

    public void startSearch(String ip) {
        count = 0;
        videoList = new ArrayList<>();

        if (ip == null) {
            Message message = new Message();
            message.obj = AppGlobalData.Handler_Type.IPError;
            m_handler.sendMessage(message);
        } else {
            String[] ips = ip.split("\\.");
            String ipHead = ips[0] + "." + ips[1] + "." + ips[2];
            for (int j = 0; j <= 255; j++) {
                final String address = ipHead + "." + j;
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        VideoData videoData = new VideoData(address);
                        SystemClock.sleep(1000);
                        if (videoData.canLogin()) {
                            OnSearchFinish(videoData);
                        } else {
                            OnSearchFinish(null);
                        }
                    }
                }).start();
            }
        }
    }
}
