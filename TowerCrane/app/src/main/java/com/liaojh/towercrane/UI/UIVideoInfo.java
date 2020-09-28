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
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
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

    private BaseActivity activity;

    private LinearLayout layoutBtnLeft, layoutBtnRight, layoutVideo_1, layoutVideo_2, layoutVideo_3, layoutVideo_4;

    private TextView textVideoName_1, textVideoName_2, textVideoName_3, textVideoName_4, textTest;

    private SurfaceView surfaceViewVideo, surfaceViewVideoFullScreen;

    private VideoManager videoManager;

    private Button buttonBig;

    private void selectInfoUpdate(int index, int pageIndex) {
        if (pageIndex == selectPageIndex && index == selectIndex) {
            return;
        }
        selectPageIndex = pageIndex;
        selectIndex = index;
        updateVideoList();
    }

    private void updateVideoList() {
        videoList = videoManager.getVideoList();

        int count = Math.min(videoList.size() - (selectPageIndex - 1) * 4, 4);
        layoutVideo_2.setVisibility(count > 1 ? View.VISIBLE : View.GONE);
        layoutVideo_3.setVisibility(count > 2 ? View.VISIBLE : View.GONE);
        layoutVideo_4.setVisibility(count > 3 ? View.VISIBLE : View.GONE);

        textTest.setVisibility(View.VISIBLE);
        if (videoList.size() == 0) {
            textViewList.get(0).setText("无视频");
            layoutList.get(0).setBackgroundColor(activity.getResources().getColor(R.color.color_video_layout_select));
            textViewList.get(0).setTextColor(activity.getResources().getColor(R.color.color_video_text_select));
            textTest.setText("搜索中。。。");
            return;
        }

        for (int i = 0; i < videoList.size(); i++) {
            //停止
            videoList.get(i).stop();
        }

        textTest.setVisibility(View.INVISIBLE);
        for (int i = 0; i < count; i++) {
            int videoIndex = i + (selectPageIndex - 1) * 4 + 1;
            VideoData videoData = videoList.get(videoIndex - 1);
            textViewList.get(i).setText("视频" + (i + 1));
            if (videoIndex == selectIndex) {
                layoutList.get(i).setBackgroundColor(activity.getResources().getColor(R.color.color_video_layout_select));
                textViewList.get(i).setTextColor(activity.getResources().getColor(R.color.color_video_text_select));
                //textTest.setText(videoData.videoName);
                videoDataSelect = videoData;
                //播放
                videoData.play(null);
            } else {
                layoutList.get(i).setBackgroundColor(activity.getResources().getColor(R.color.color_video_layout_un_select));
                textViewList.get(i).setTextColor(activity.getResources().getColor(R.color.color_video_text_un_select));
            }
        }
    }

    @Override
    public void onUICreate(BaseActivity activityIn) {
        activity = activityIn;

        layoutBtnLeft = (LinearLayout) activity.findViewById(R.id.layout_btn_left);
        layoutBtnRight = (LinearLayout) activity.findViewById(R.id.layout_btn_right);
        layoutVideo_1 = (LinearLayout) activity.findViewById(R.id.layout_video_1);
        layoutVideo_2 = (LinearLayout) activity.findViewById(R.id.layout_video_2);
        layoutVideo_3 = (LinearLayout) activity.findViewById(R.id.layout_video_3);
        layoutVideo_4 = (LinearLayout) activity.findViewById(R.id.layout_video_4);

        textVideoName_1 = (TextView) activity.findViewById(R.id.text_video_1);
        textVideoName_2 = (TextView) activity.findViewById(R.id.text_video_2);
        textVideoName_3 = (TextView) activity.findViewById(R.id.text_video_3);
        textVideoName_4 = (TextView) activity.findViewById(R.id.text_video_4);

        textTest = (TextView) activity.findViewById(R.id.text_test);

        surfaceViewVideo = (SurfaceView) activity.findViewById(R.id.video_surfaceView);
        surfaceViewVideoFullScreen = (SurfaceView) activity.findViewById(R.id.surface_view_full_screen);

        buttonBig = (Button) activity.findViewById(R.id.button_big);

        layoutBtnLeft.setOnClickListener(this);
        layoutBtnRight.setOnClickListener(this);
        layoutVideo_1.setOnClickListener(this);
        layoutVideo_2.setOnClickListener(this);
        layoutVideo_3.setOnClickListener(this);
        layoutVideo_4.setOnClickListener(this);
        buttonBig.setOnClickListener(this);
        surfaceViewVideoFullScreen.setOnClickListener(this);

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

        videoManager = new VideoManager(activityIn, surfaceViewVideo, surfaceViewVideoFullScreen);
    }

    @Override
    public void onUIStart() {
        selectIndex = 1;
        selectPageIndex = 1;
        updateVideoList();
    }

    @Override
    public void onUIDestroy() {
        videoList = videoManager.getVideoList();
        for (int i = 0; i < videoList.size(); i++) {
            videoList.get(i).onDestroy();
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onClick(View view) {
        int selectIndexNew;
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
                surfaceViewVideoFullScreen.setVisibility(View.VISIBLE);
                surfaceViewVideo.setVisibility(View.INVISIBLE);
                videoDataSelect.onDestroy();
                videoManager.getFullScreenVideoData().play(videoDataSelect.getUri());
                break;
            case R.id.surface_view_full_screen:
                videoManager.getFullScreenVideoData().onDestroy();
                surfaceViewVideoFullScreen.setVisibility(View.INVISIBLE);
                surfaceViewVideo.setVisibility(View.VISIBLE);
                videoManager = new VideoManager(activity, surfaceViewVideo, surfaceViewVideoFullScreen);
                updateVideoList();
                break;
        }
    }
}
