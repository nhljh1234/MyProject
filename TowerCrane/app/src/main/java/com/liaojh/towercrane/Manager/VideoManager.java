package com.liaojh.towercrane.Manager;

import android.util.Log;
import android.view.SurfaceView;

import java.util.ArrayList;
import java.util.List;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.VideoData;

import org.json.JSONArray;
import org.json.JSONObject;
import org.videolan.libvlc.IVLCVout;
import org.videolan.libvlc.LibVLC;
import org.videolan.libvlc.MediaPlayer;

public class VideoManager {
    private ArrayList<VideoData> list = new ArrayList<>();
    private VideoData fullScreenVideoData;
    private MainActivity m_activity;

    public ArrayList<Constant.VideoSaveData> getVideoSaveDataList() {
        ArrayList<Constant.VideoSaveData> list = new ArrayList<>();

        try {
            String saveData = Constant.localStorage.m_sp.getString(Constant.VideoSaveKey, "");
            if (saveData.length() == 0) {
                return list;
            }
            JSONArray jsonArray = new JSONArray(saveData);
            for (int i = 0; i < jsonArray.length(); i++) {
                Constant.VideoSaveData videoSaveData = new Constant.VideoSaveData();
                // JSON数组里面的具体-JSON对象
                JSONObject videoObject = jsonArray.getJSONObject(i);
                videoSaveData.name = videoObject.getString("name");
                videoSaveData.userName = videoObject.getString("userName");
                videoSaveData.userPassword = videoObject.getString("userPassword");
                videoSaveData.ipAddress = videoObject.getString("ipAddress");
                videoSaveData.port = videoObject.getString("port");
                videoSaveData.rtspAddress = videoObject.getString("rtspAddress");
                list.add(videoSaveData);
            }
        } catch (Exception e) {
            m_activity.showToast("读取摄像头数据失败");
            e.printStackTrace();
        }

        return list;
    }

    public void changeCamera(Constant.VideoSaveData videoSaveData, String ipAddressChange) {
        ArrayList<Constant.VideoSaveData> videoList = getVideoSaveDataList();
        ArrayList<Constant.VideoSaveData> newList = new ArrayList<>();
        for (int i = 0; i < videoList.size(); i++) {
            if (videoList.get(i).ipAddress.equals(ipAddressChange)) {
                newList.add(videoSaveData);
            } else {
                newList.add(videoList.get(i));
            }
        }
        saveVideo(newList);
        m_activity.uiVideoInfo.videoInfoUpdate();
    }

    public void deleteCamera(String ipAddress) {
        ArrayList<Constant.VideoSaveData> videoList = getVideoSaveDataList();
        ArrayList<Constant.VideoSaveData> newList = new ArrayList<>();
        for (int i = 0; i < videoList.size(); i++) {
            if (!videoList.get(i).ipAddress.equals(ipAddress)) {
                newList.add(videoList.get(i));
            }
        }
        saveVideo(newList);
        m_activity.uiVideoInfo.videoInfoUpdate();
    }

    public void addCamera(Constant.VideoSaveData videoSaveData) {
        ArrayList<Constant.VideoSaveData> videoList = getVideoSaveDataList();
        for (int i = 0; i < videoList.size(); i++) {
            String ipAddress = videoList.get(i).ipAddress;
            if (videoSaveData.ipAddress.equals(ipAddress)) {
                m_activity.showToast("该IP地址已存在数据");
                return;
            }
        }
        videoList.add(videoSaveData);
        saveVideo(videoList);
        m_activity.uiVideoInfo.videoInfoUpdate();
    }

    public void saveVideo(ArrayList<Constant.VideoSaveData> videoList) {
        try {
            JSONArray jsonArray = new JSONArray();
            for (int i = 0; i < videoList.size(); i++) {
                JSONObject videoObject = new JSONObject();
                videoObject.put("name", videoList.get(i).name);
                videoObject.put("userName", videoList.get(i).userName);
                videoObject.put("userPassword", videoList.get(i).userPassword);
                videoObject.put("ipAddress", videoList.get(i).ipAddress);
                videoObject.put("port", videoList.get(i).port);
                videoObject.put("rtspAddress", videoList.get(i).rtspAddress);
                jsonArray.put(videoObject);
            }
            Constant.localStorage.m_spe.putString(Constant.VideoSaveKey, jsonArray.toString());
            Boolean result = Constant.localStorage.m_spe.commit();
            if (!result) {
                m_activity.showToast("保存摄像头数据失败");
            }
        } catch (Exception e) {
            m_activity.showToast("保存摄像头数据失败");
            e.printStackTrace();
        }
    }

    public void smallVideoInit(MainActivity activity, SurfaceView surfaceViewVideo) {
        ArrayList<String> options = new ArrayList<>();
        options.add("-vvv");
        LibVLC libVLC = new LibVLC(activity, options);
        MediaPlayer mediaPlayer = new MediaPlayer(libVLC);

        m_activity = activity;

        list = new ArrayList<>();
        ArrayList<Constant.VideoSaveData> videoList = getVideoSaveDataList();
        for (int i = 0; i < videoList.size(); i++) {
            list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, videoList.get(i)));
        }

//        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.6:554/video1"));
//        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.182:554/h264/ch1/main/av_stream"));
//        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.189:554/h264/ch1/main/av_stream"));
    }

    public void fullScreenVideoInit(MainActivity activity, SurfaceView surfaceViewFullScreen) {
        ArrayList<String> options = new ArrayList<>();
        options.add("-vvv");
        LibVLC libVLC = new LibVLC(activity, options);
        MediaPlayer mediaPlayer = new MediaPlayer(libVLC);

        m_activity = activity;

        fullScreenVideoData = new VideoData(mediaPlayer, libVLC, surfaceViewFullScreen, null);
    }

    public VideoData getFullScreenVideoData() {
        return fullScreenVideoData;
    }

    public ArrayList<VideoData> getVideoList() {
        return list;
    }
}
