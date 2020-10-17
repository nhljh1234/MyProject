package com.liaojh.towercrane.UI;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.PixelFormat;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.R;

import java.util.ArrayList;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Data.VideoData;
import com.liaojh.towercrane.Manager.VideoManager;
import com.liaojh.towercrane.Tool.Tool;

import org.videolan.libvlc.util.VLCVideoLayout;

public class UIVideoInfo implements InterfaceUI {
    private ArrayList<LinearLayout> layoutList = new ArrayList<>();
    private ArrayList<TextView> textViewList = new ArrayList<>();

    private ArrayList<VideoData> videoList = new ArrayList<>();

    private VideoData videoDataSelect;

    private int selectIndex;
    private int selectPageIndex;

    private MainActivity m_activity;

    private LinearLayout layoutBtnLeft, layoutBtnRight, layoutVideo_1, layoutVideo_2, layoutVideo_3, layoutVideo_4;

    private TextView textVideoName_1, textVideoName_2, textVideoName_3, textVideoName_4, textTest;

    private SurfaceView surfaceViewVideo, surfaceViewVideoFullScreen;

    private FrameLayout frameLayoutFullVideo;

    private Button buttonBig;

    private Button buttonSmall;

    private void selectInfoUpdate(int index, int pageIndex) {
        if (pageIndex == selectPageIndex && index == selectIndex) {
            return;
        }
        selectPageIndex = pageIndex;
        selectIndex = index;
        updateVideoList();
    }

    private void updateVideoList() {
        videoList = VideoManager.getInstance().getVideoList();

        int count = Math.min(videoList.size() - (selectPageIndex - 1) * 4, 4);
        layoutVideo_2.setVisibility(count > 1 ? View.VISIBLE : View.GONE);
        layoutVideo_3.setVisibility(count > 2 ? View.VISIBLE : View.GONE);
        layoutVideo_4.setVisibility(count > 3 ? View.VISIBLE : View.GONE);

        textTest.setVisibility(View.VISIBLE);
        if (videoList.size() == 0) {
            textViewList.get(0).setText("无视频");
            layoutList.get(0).setBackgroundColor(m_activity.getColor(R.color.color_video_layout_select));
            textViewList.get(0).setTextColor(m_activity.getColor(R.color.color_video_text_select));
            textTest.setText("搜索中。。。");
            return;
        }

        if (videoDataSelect != null) {
            videoDataSelect.stop();
        }

        textTest.setVisibility(View.INVISIBLE);
        for (int i = 0; i < count; i++) {
            int videoIndex = i + (selectPageIndex - 1) * 4 + 1;
            VideoData videoData = videoList.get(videoIndex - 1);
            textViewList.get(i).setText(videoData.m_videoSaveData.name);
            if (videoIndex == selectIndex) {
                layoutList.get(i).setBackgroundColor(m_activity.getColor(R.color.color_video_layout_select));
                textViewList.get(i).setTextColor(m_activity.getColor(R.color.color_video_text_select));
                //textTest.setText(videoData.videoName);
                videoDataSelect = videoData;
                //播放
                videoData.play(null);
            } else {
                layoutList.get(i).setBackgroundColor(m_activity.getColor(R.color.color_video_layout_un_select));
                textViewList.get(i).setTextColor(m_activity.getColor(R.color.color_video_text_un_select));
            }
        }
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        layoutBtnLeft = m_activity.findViewById(R.id.layout_btn_left);
        layoutBtnRight = m_activity.findViewById(R.id.layout_btn_right);
        layoutVideo_1 = m_activity.findViewById(R.id.layout_video_1);
        layoutVideo_2 = m_activity.findViewById(R.id.layout_video_2);
        layoutVideo_3 = m_activity.findViewById(R.id.layout_video_3);
        layoutVideo_4 = m_activity.findViewById(R.id.layout_video_4);

        textVideoName_1 = m_activity.findViewById(R.id.text_video_1);
        textVideoName_2 = m_activity.findViewById(R.id.text_video_2);
        textVideoName_3 = m_activity.findViewById(R.id.text_video_3);
        textVideoName_4 = m_activity.findViewById(R.id.text_video_4);

        textTest = m_activity.findViewById(R.id.text_test);

        surfaceViewVideo = m_activity.findViewById(R.id.video_surfaceView);
        surfaceViewVideoFullScreen = m_activity.findViewById(R.id.surface_view_full_screen);

        frameLayoutFullVideo = m_activity.findViewById(R.id.frame_layout_full_video);

        buttonBig = m_activity.findViewById(R.id.button_big);
        buttonSmall = m_activity.findViewById(R.id.button_small);

        layoutBtnLeft.setOnClickListener(this);
        layoutBtnRight.setOnClickListener(this);
        layoutVideo_1.setOnClickListener(this);
        layoutVideo_2.setOnClickListener(this);
        layoutVideo_3.setOnClickListener(this);
        layoutVideo_4.setOnClickListener(this);
        buttonBig.setOnClickListener(this);
        buttonSmall.setOnClickListener(this);
        surfaceViewVideoFullScreen.setOnClickListener(this);
        frameLayoutFullVideo.setOnClickListener(this);

        layoutList = new ArrayList<>();
        layoutList.add(layoutVideo_1);
        layoutList.add(layoutVideo_2);
        layoutList.add(layoutVideo_3);
        layoutList.add(layoutVideo_4);

        textViewList = new ArrayList<>();
        textViewList.add(textVideoName_1);
        textViewList.add(textVideoName_2);
        textViewList.add(textVideoName_3);
        textViewList.add(textVideoName_4);

        VideoManager.getInstance().smallVideoInit(m_activity, surfaceViewVideo);
        VideoManager.getInstance().fullScreenVideoInit(m_activity, surfaceViewVideoFullScreen);
    }

    @Override
    public void onUIStart() {
        selectIndex = 1;
        selectPageIndex = 1;
        updateVideoList();
    }

    @Override
    public void onUIDestroy() {
        videoList = VideoManager.getInstance().getVideoList();
        for (int i = 0; i < videoList.size(); i++) {
            videoList.get(i).onDestroy();
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    //增加设备的时候刷新
    public void videoInfoUpdate() {
        if (videoDataSelect != null) {
            videoDataSelect.onDestroy();
            videoDataSelect = null;
        }
        VideoManager.getInstance().smallVideoInit(m_activity, surfaceViewVideo);
        onUIStart();
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_btn_left:
                if (selectPageIndex <= 1) {
                    break;
                }
                selectInfoUpdate(selectIndex, selectPageIndex - 1);
                break;
            case R.id.layout_btn_right:
                if (selectPageIndex * 4 >= videoList.size()) {
                    break;
                }
                selectInfoUpdate(selectIndex, selectPageIndex + 1);
                break;
            case R.id.layout_video_1:
                selectInfoUpdate((selectPageIndex - 1) * 4 + 1, selectPageIndex);
                break;
            case R.id.layout_video_2:
                selectInfoUpdate((selectPageIndex - 1) * 4 + 2, selectPageIndex);
                break;
            case R.id.layout_video_3:
                selectInfoUpdate((selectPageIndex - 1) * 4 + 3, selectPageIndex);
                break;
            case R.id.layout_video_4:
                selectInfoUpdate((selectPageIndex - 1) * 4 + 4, selectPageIndex);
                break;
            case R.id.button_big:
                if (videoDataSelect == null) {
                    break;
                }
                frameLayoutFullVideo.setVisibility(View.VISIBLE);
                videoDataSelect.stop();
                VideoManager.getInstance().getFullScreenVideoData().play(videoDataSelect.getUri());
                break;
            case R.id.button_small:
                if (videoDataSelect == null) {
                    break;
                }
                frameLayoutFullVideo.setVisibility(View.INVISIBLE);
                VideoManager.getInstance().getFullScreenVideoData().stop();
                videoDataSelect.play(null);
                //updateVideoList();
                break;
        }
    }
}
