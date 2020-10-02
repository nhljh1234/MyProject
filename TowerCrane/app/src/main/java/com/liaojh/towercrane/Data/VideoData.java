package com.liaojh.towercrane.Data;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Debug;
import android.util.DebugUtils;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Tool.Tool;

import org.videolan.libvlc.IVLCVout;
import org.videolan.libvlc.LibVLC;
import org.videolan.libvlc.Media;
import org.videolan.libvlc.MediaPlayer;
import org.videolan.libvlc.util.VLCVideoLayout;

import java.util.ArrayList;

public class VideoData {
    private LibVLC m_libVLC;
    private MediaPlayer m_mediaPlayer;
    private String m_uri;
    private SurfaceView m_surfaceViewVideo;

    public Constant.VideoSaveData m_videoSaveData;

    public VideoData(MediaPlayer mediaPlayer, LibVLC libVLC, SurfaceView surfaceViewVideo, Constant.VideoSaveData videoSaveData) {
        if (videoSaveData != null) {
            m_videoSaveData = videoSaveData;
            m_uri = Tool.getRtspAddress(videoSaveData);
        }
        m_mediaPlayer = mediaPlayer;
        m_libVLC = libVLC;
        m_surfaceViewVideo = surfaceViewVideo;

        m_mediaPlayer.setEventListener(new MediaPlayer.EventListener() {
            @Override
            public void onEvent(MediaPlayer.Event event) {
                if (event.type == MediaPlayer.Event.Playing) {
                    updateSurfaceView();
                }
            }
        });
    }

    private void updateSurfaceView() {
        int width = m_surfaceViewVideo.getMeasuredWidth();
        int height = m_surfaceViewVideo.getMeasuredHeight();

        m_mediaPlayer.getVLCVout().setWindowSize(width, height);
        m_mediaPlayer.setScale(0);
    }

    public String getUri() {
        return m_uri;
    }

    public void play(String uri) {
        uri = uri == null ? m_uri : uri;
        if (uri == null) {
            Log.e(Constant.LogTag, "uri is null");
            return;
        }
        IVLCVout vlcVout = m_mediaPlayer.getVLCVout();
        if (!vlcVout.areViewsAttached()) {
            vlcVout.setVideoView(m_surfaceViewVideo);
            vlcVout.attachViews();
        }
        Media media = new Media(m_libVLC, Uri.parse(uri));
        media.addOption(":no-audio");
        media.addOption(":network-caching=10");
        m_mediaPlayer.setMedia(media);
        m_mediaPlayer.play();
        media.release();
    }

    public void stop() {
        if (m_mediaPlayer != null) {
            m_mediaPlayer.stop();

//            IVLCVout vlcVout = m_mediaPlayer.getVLCVout();
//            vlcVout.detachViews();

//            Canvas canvas = m_surfaceViewVideo.getHolder().lockCanvas(null);
//            if (canvas != null) {
//                canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
//                m_surfaceViewVideo.draw(canvas);
//            }
            //m_mediaPlayer.getVLCVout().detachViews();
        }
    }

    public void onDestroy() {
        if (m_mediaPlayer != null) {
            m_mediaPlayer.release();
        }
        if (m_libVLC != null) {
            m_libVLC.release();
        }
        m_mediaPlayer = null;
        m_libVLC = null;
    }
}
