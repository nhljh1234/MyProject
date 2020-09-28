package com.liaojh.towercrane.Manager;

import android.view.SurfaceView;
import java.util.ArrayList;
import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.VideoData;

import org.videolan.libvlc.IVLCVout;
import org.videolan.libvlc.LibVLC;
import org.videolan.libvlc.MediaPlayer;

public class VideoManager {
    private ArrayList<VideoData> list = new ArrayList<>();
    private VideoData fullScreenVideoData;

    public VideoManager(BaseActivity activity, SurfaceView surfaceViewVideo, SurfaceView surfaceViewFullScreen) {
        smallVideoInit(activity, surfaceViewVideo);
        fullScreenVideoInit(activity, surfaceViewFullScreen);
    }

    private void smallVideoInit(BaseActivity activity, SurfaceView surfaceViewVideo) {
        ArrayList<String> options = new ArrayList<>();
        options.add("-vvv");
        LibVLC libVLC = new LibVLC(activity, options);
        MediaPlayer mediaPlayer = new MediaPlayer(libVLC);
        IVLCVout vlcVout = mediaPlayer.getVLCVout();
        vlcVout.setVideoView(surfaceViewVideo);
        vlcVout.attachViews();

        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.6:554/video1"));
        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.182:554/h264/ch1/main/av_stream"));
        list.add(new VideoData(mediaPlayer, libVLC, surfaceViewVideo, "rtsp://guest:guest_001@192.168.0.189:554/h264/ch1/main/av_stream"));
    }

    private void fullScreenVideoInit(BaseActivity activity, SurfaceView surfaceViewFullScreen) {
        ArrayList<String> options = new ArrayList<>();
        options.add("-vvv");
        LibVLC libVLC = new LibVLC(activity, options);
        MediaPlayer mediaPlayer = new MediaPlayer(libVLC);
        IVLCVout vlcVout = mediaPlayer.getVLCVout();
        vlcVout.setVideoView(surfaceViewFullScreen);
        vlcVout.attachViews();

        fullScreenVideoData = new VideoData(mediaPlayer, libVLC, surfaceViewFullScreen, "");
    }

    public VideoData getFullScreenVideoData() {
        return fullScreenVideoData;
    }

    public ArrayList<VideoData> getVideoList() {
        return list;
    }
}
