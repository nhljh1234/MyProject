package Data;

import android.util.Log;
import android.view.SurfaceView;

import com.hikvision.netsdk.HCNetSDK;
import com.hikvision.netsdk.NET_DVR_DEVICEINFO_V30;
import com.hikvision.netsdk.NET_DVR_PREVIEWINFO;
import com.hikvision.netsdk.RealPlayCallBack;

import org.MediaPlayer.PlayM4.Player;

public class VideoData {
    public String m_address;

    private NET_DVR_DEVICEINFO_V30 m_oNetDvrDeviceInfoV30;

    private int m_iStartChan;

    private int m_iChanNum;

    private int m_iPort = -1;

    private int m_iPlayID = -1;

    public int loginId;

    private Boolean canLogin;

    private Boolean isPlaying = false;

    private SurfaceView m_view;

    public VideoData(String address) {
        m_address = address;

        m_oNetDvrDeviceInfoV30 = new NET_DVR_DEVICEINFO_V30();
        loginId = HCNetSDK.getInstance().NET_DVR_Login_V30(m_address, AppGlobalData.Port, AppGlobalData.Name, AppGlobalData.Password, m_oNetDvrDeviceInfoV30);
        canLogin = loginId >= 0;

        if (m_oNetDvrDeviceInfoV30.byChanNum > 0) {
            m_iStartChan = m_oNetDvrDeviceInfoV30.byStartChan;
            m_iChanNum = m_oNetDvrDeviceInfoV30.byChanNum;
        } else if (m_oNetDvrDeviceInfoV30.byIPChanNum > 0) {
            m_iStartChan = m_oNetDvrDeviceInfoV30.byStartDChan;
            m_iChanNum = m_oNetDvrDeviceInfoV30.byIPChanNum + m_oNetDvrDeviceInfoV30.byHighDChanNum * 256;
        }
    }

    private void updateView(int iDataType, byte[] pDataBuffer, int iDataSize, int iStreamMode) {
        if (HCNetSDK.NET_DVR_SYSHEAD == iDataType) {
            if (m_iPort >= 0) {
                return;
            }
            m_iPort = Player.getInstance().getPort();
            if (iDataSize > 0) {
                if (!Player.getInstance().setStreamOpenMode(m_iPort, iStreamMode)) {
                    Log.e(AppGlobalData.LogTag, "setStreamOpenMode failed");
                    return;
                }
                if (!Player.getInstance().openStream(m_iPort, pDataBuffer, iDataSize, 2 * 1024 * 1024)) {
                    Log.e(AppGlobalData.LogTag, "openStream failed");
                    return;
                }
                if (m_view.getHolder().getSurface() == null) {
                    Log.e(AppGlobalData.LogTag, "getSurface failed");
                }
                if (!Player.getInstance().play(m_iPort, m_view.getHolder())) {
                    Log.e(AppGlobalData.LogTag, "play failed");
                    return;
                }
            }
        } else {
            if (!Player.getInstance().inputData(m_iPort, pDataBuffer, iDataSize)) {
                Log.e(AppGlobalData.LogTag, "inputData failed");
            }
        }
    }

    public void show(SurfaceView view) {

        m_view = view;

        if (isPlaying) {
            return;
        }

        isPlaying = true;

        RealPlayCallBack cbf = new RealPlayCallBack() {
            public void fRealDataCallBack(int iRealHandle, int iDataType,
                                          byte[] pDataBuffer, int iDataSize) {
                updateView(iDataType, pDataBuffer, iDataSize, Player.STREAM_REALTIME);
            }
        };

        NET_DVR_PREVIEWINFO previewInfo = new NET_DVR_PREVIEWINFO();
        previewInfo.lChannel = m_iStartChan;
        previewInfo.dwStreamType = 0; // substream
        previewInfo.bBlocked = 1;

        m_iPlayID = HCNetSDK.getInstance().NET_DVR_RealPlay_V40(loginId, previewInfo, cbf);
    }

    public void stop() {
        if (!isPlaying) {
            return;
        }

//        if (!Player.getInstance().setVideoWindow(m_iPort, 0, null)) {
//            Log.e(AppGlobalData.LogTag, "surfaceDestroyed Player setVideoWindow failed!");
//        }

        if (m_iPort == -1) {
            return;
        }

        if (m_iPlayID == -1) {
            return;
        }

        // release net SDK resource
        //HCNetSDK.getInstance().NET_DVR_Cleanup();

        if (!HCNetSDK.getInstance().NET_DVR_StopRealPlay(m_iPlayID)) {
            Log.e(AppGlobalData.LogTag, "StopRealPlay is failed!Err:" + HCNetSDK.getInstance().NET_DVR_GetLastError());
            return;
        }
        m_iPlayID = -1;

        if (!Player.getInstance().stop(m_iPort)) {
            Log.e(AppGlobalData.LogTag, "stop is failed!");
            return;
        }
        if (!Player.getInstance().closeStream(m_iPort)) {
            Log.e(AppGlobalData.LogTag, "closeStream is failed!");
            return;
        }
        if (!Player.getInstance().freePort(m_iPort)) {
            Log.e(AppGlobalData.LogTag, "freePort is failed!" + m_iPort);
            return;
        }
        m_iPort = -1;

        isPlaying = false;
    }

    public Boolean canLogin() {
        return canLogin;
    }

    public int getIPort() {
        return m_iPort;
    }
}
