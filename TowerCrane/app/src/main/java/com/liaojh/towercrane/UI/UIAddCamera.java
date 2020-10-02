package com.liaojh.towercrane.UI;

import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.R;

public class UIAddCamera implements InterfaceDialog {
    private MainActivity m_activity;

    LinearLayout layoutAddCamera;

    EditText editCameraName, editCameraUserName, editCameraPassword, editCameraIpAddress, editCameraPort, editCameraRtspAddress;

    Button btnAddCamera, btnBack;

    private SurfaceView surfaceViewVideo, surfaceViewVideoFullScreen;

    private Boolean isChange = false;

    private Constant.VideoSaveData videoSaveDataChange;

    public void showChangeVideoSaveData(Constant.VideoSaveData videoSaveData) {
        layoutAddCamera.setVisibility(View.VISIBLE);
        editCameraName.setText(videoSaveData.name);
        editCameraUserName.setText(videoSaveData.userName);
        editCameraPassword.setText(videoSaveData.userPassword);
        editCameraIpAddress.setText(videoSaveData.ipAddress);
        editCameraPort.setText(videoSaveData.port);
        editCameraRtspAddress.setText(videoSaveData.rtspAddress);

        btnAddCamera.setText(m_activity.getResources().getString(R.string.camera_change));

        videoSaveDataChange = videoSaveData;
        isChange = true;
    }

    @Override
    public void show() {
        layoutAddCamera.setVisibility(View.VISIBLE);
        editCameraName.setText("");
        editCameraUserName.setText("");
        editCameraPassword.setText("");
        editCameraIpAddress.setText("");
        editCameraPort.setText("");
        editCameraRtspAddress.setText("");

        btnAddCamera.setText(m_activity.getResources().getString(R.string.camera_add));

        videoSaveDataChange = null;
        isChange = false;
    }

    @Override
    public void hide() {
        layoutAddCamera.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        m_activity = activityIn;
        layoutAddCamera = m_activity.findViewById(R.id.layout_add_camera);
        editCameraName = m_activity.findViewById(R.id.edit_camera_name);
        editCameraUserName = m_activity.findViewById(R.id.edit_camera_user_name);
        editCameraPassword = m_activity.findViewById(R.id.edit_camera_user_password);
        editCameraIpAddress = m_activity.findViewById(R.id.edit_camera_user_ipAddress);
        editCameraPort = m_activity.findViewById(R.id.edit_camera_user_port);
        editCameraRtspAddress = m_activity.findViewById(R.id.edit_camera_rtsp_address);

        btnAddCamera = m_activity.findViewById(R.id.btn_add_camera);
        btnBack = m_activity.findViewById(R.id.btn_camera_manager_back);
        btnAddCamera.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        surfaceViewVideo = m_activity.findViewById(R.id.video_surfaceView);
        surfaceViewVideoFullScreen = m_activity.findViewById(R.id.surface_view_full_screen);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_add_camera:
                Constant.VideoSaveData videoSaveData = new Constant.VideoSaveData();
                videoSaveData.name = editCameraName.getText().toString();
                videoSaveData.userName = editCameraUserName.getText().toString();
                videoSaveData.userPassword = editCameraPassword.getText().toString();
                videoSaveData.ipAddress = editCameraIpAddress.getText().toString();
                videoSaveData.port = editCameraPort.getText().toString();
                videoSaveData.rtspAddress = editCameraRtspAddress.getText().toString();
                if (isChange && videoSaveDataChange != null) {
                    Constant.videoManager.changeCamera(videoSaveData, videoSaveDataChange.ipAddress);
                } else {
                    Constant.videoManager.addCamera(videoSaveData);
                }
                m_activity.uiCameraList.show();
                hide();
                break;
            case R.id.btn_camera_manager_back:
                m_activity.uiCameraList.show();
                hide();
                break;
        }
    }
}
