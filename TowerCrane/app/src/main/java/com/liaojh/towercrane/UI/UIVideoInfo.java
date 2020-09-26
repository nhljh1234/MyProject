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
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.R;

import org.MediaPlayer.PlayM4.Player;

import java.util.ArrayList;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Data.VideoData;
import com.liaojh.towercrane.Manager.VideoManager;
import com.liaojh.towercrane.Tool.Tool;

public class UIVideoInfo implements InterfaceUI, SurfaceHolder.Callback {
    private ArrayList<LinearLayout> layoutList = new ArrayList<>();
    private ArrayList<TextView> textViewList = new ArrayList<>();

    private ArrayList<VideoData> videoList = new ArrayList<>();

    private VideoData videoDataSelect;

    private int selectIndex;
    private int selectPageIndex;

    private Activity activity;

    private LinearLayout layoutBtnLeft, layoutBtnRight, layoutVideo_1, layoutVideo_2, layoutVideo_3, layoutVideo_4;

    private TextView textVideoName_1, textVideoName_2, textVideoName_3, textVideoName_4, textTest;

    private SurfaceView surfaceView;

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == Constant.Handler_Type.SearchFinish) {
                updateVideoList();
                if (videoManager.getVideoList().size() == 0) {
                    textTest.setText("没有摄像头");
                }
            } else if (msg.obj == Constant.Handler_Type.IPError) {
                textTest.setText("网络错误");
            }
            super.handleMessage(msg);
        }
    };

    private VideoManager videoManager = new VideoManager(handler);

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
            videoList.get(i).stop();
        }

        textTest.setVisibility(View.INVISIBLE);
        for (int i = 0; i < count; i++) {
            int videoIndex = i + (selectPageIndex - 1) * 4 + 1;
            VideoData videoData = videoList.get(videoIndex - 1);
            videoDataSelect = videoData;
            textViewList.get(i).setText("视频" + (i + 1));
            if (videoIndex == selectIndex) {
                layoutList.get(i).setBackgroundColor(activity.getResources().getColor(R.color.color_video_layout_select));
                textViewList.get(i).setTextColor(activity.getResources().getColor(R.color.color_video_text_select));
                //textTest.setText(videoData.videoName);
                videoData.show(surfaceView);
            } else {
                layoutList.get(i).setBackgroundColor(activity.getResources().getColor(R.color.color_video_layout_un_select));
                textViewList.get(i).setTextColor(activity.getResources().getColor(R.color.color_video_text_un_select));
            }
        }
    }

    @Override
    public void onUICreate(Activity activityIn) {
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

        surfaceView = (SurfaceView) activity.findViewById(R.id.video_surfaceView);
        surfaceView.getHolder().addCallback(this);

        layoutBtnLeft.setOnClickListener(this);
        layoutBtnRight.setOnClickListener(this);
        layoutVideo_1.setOnClickListener(this);
        layoutVideo_2.setOnClickListener(this);
        layoutVideo_3.setOnClickListener(this);
        layoutVideo_4.setOnClickListener(this);

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

        videoManager.startSearch(Tool.getLocalIPAddress());
    }

    public void surfaceCreated(SurfaceHolder holder) {
        surfaceView.getHolder().setFormat(PixelFormat.TRANSLUCENT);
        if (videoDataSelect == null || videoDataSelect.getIPort() == -1) {
            return;
        }
        Surface surface = holder.getSurface();
        if (surface.isValid()) {
            if (!Player.getInstance().setVideoWindow(videoDataSelect.getIPort(), 0, holder)) {
                Log.e(Constant.LogTag, "surfaceCreated Player setVideoWindow failed!");
            }
        }
    }

    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    public void surfaceDestroyed(SurfaceHolder holder) {
        if (videoDataSelect == null || videoDataSelect.getIPort() == -1) {
            return;
        }
        if (holder.getSurface().isValid()) {
            if (!Player.getInstance().setVideoWindow(videoDataSelect.getIPort(), 0, null)) {
                Log.e(Constant.LogTag, "surfaceDestroyed Player setVideoWindow failed!");
            }
        }
    }

    @Override
    public void onUIStart() {
        selectIndex = 1;
        selectPageIndex = 1;
        updateVideoList();
    }

    @Override
    public void onUIDestroy() {

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
        }
    }
}
