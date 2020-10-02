package com.liaojh.towercrane.UI;

import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.R;

public class UISetting implements InterfaceDialog {
    private LinearLayout layoutSetting;
    private Button btnWeight, btnWind, btnAmplitude, btnTurnAround, btnHeight, btnSetCamera, btnBack;
    private MainActivity m_activity;

    public void show() {
        layoutSetting.setVisibility(View.VISIBLE);
    }

    public void hide() {
        layoutSetting.setVisibility(View.GONE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        layoutSetting = activityIn.findViewById(R.id.layout_setting);

        btnWeight = activityIn.findViewById(R.id.btn_change_weight);
        btnWind = activityIn.findViewById(R.id.btn_change_wind);
        btnAmplitude = activityIn.findViewById(R.id.btn_change_amplitude);
        btnTurnAround = activityIn.findViewById(R.id.btn_change_turn_around);
        btnHeight = activityIn.findViewById(R.id.btn_change_height);
        btnSetCamera = activityIn.findViewById(R.id.btn_change_camera);
        btnBack = activityIn.findViewById(R.id.btn_setting_back);

        btnWeight.setOnClickListener(this);
        btnWind.setOnClickListener(this);
        btnAmplitude.setOnClickListener(this);
        btnTurnAround.setOnClickListener(this);
        btnHeight.setOnClickListener(this);
        btnSetCamera.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        m_activity = activityIn;
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
            case R.id.btn_change_weight:
                m_activity.uiSetCalibration.setCalibrationData(Constant.settingData.weight);
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_change_wind:
                m_activity.uiSetCalibration.setCalibrationData(Constant.settingData.wind);
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_change_amplitude:
                m_activity.uiSetCalibration.setCalibrationData(Constant.settingData.amplitude);
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_change_turn_around:
                m_activity.uiSetCalibration.setCalibrationData(Constant.settingData.turnAround);
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_change_height:
                m_activity.uiSetCalibration.setCalibrationData(Constant.settingData.height);
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_change_camera:
                m_activity.uiCameraList.show();
                hide();
                break;
            case R.id.btn_setting_back:
                hide();
                break;
        }
    }
}
