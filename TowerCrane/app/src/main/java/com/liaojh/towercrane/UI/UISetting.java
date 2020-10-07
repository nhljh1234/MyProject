package com.liaojh.towercrane.UI;

import android.content.Context;
import android.content.DialogInterface;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.LinearLayout;

import com.arcsoft.arcfacedemo.faceserver.FaceServer;
import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.R;

import androidx.appcompat.app.AlertDialog;

public class UISetting implements InterfaceDialog {
    private LinearLayout layoutSetting;
    private Button btnWeight, btnWind, btnAmplitude, btnTurnAround, btnHeight, btnSetCamera, btnClearFace, btnRegister, btnBack;
    private MainActivity m_activity;
    private Constant.SETTING_TYPE showType;

    public void show() {
        showSetting(showType == null ? Constant.SETTING_TYPE.Normal : showType);
    }

    public void hide() {
        layoutSetting.setVisibility(View.GONE);
    }

    public void showSetting(Constant.SETTING_TYPE type) {
        showType = type;
        layoutSetting.setVisibility(View.VISIBLE);
        if (type == Constant.SETTING_TYPE.Normal) {
            btnClearFace.setVisibility(View.GONE);
            btnRegister.setVisibility(View.GONE);
        } else {
            btnClearFace.setVisibility(View.VISIBLE);
            btnRegister.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        layoutSetting = activityIn.findViewById(R.id.layout_setting);

        btnWeight = activityIn.findViewById(R.id.btn_setting_change_weight);
        btnWind = activityIn.findViewById(R.id.btn_setting_change_wind);
        btnAmplitude = activityIn.findViewById(R.id.btn_setting_change_amplitude);
        btnTurnAround = activityIn.findViewById(R.id.btn_setting_change_turn_around);
        btnHeight = activityIn.findViewById(R.id.btn_setting_change_height);
        btnSetCamera = activityIn.findViewById(R.id.btn_setting_change_camera);
        btnClearFace = activityIn.findViewById(R.id.btn_setting_clear_face);
        btnRegister = activityIn.findViewById(R.id.btn_setting_face_register);
        btnBack = activityIn.findViewById(R.id.btn_setting_back);

        btnWeight.setOnClickListener(this);
        btnWind.setOnClickListener(this);
        btnAmplitude.setOnClickListener(this);
        btnTurnAround.setOnClickListener(this);
        btnHeight.setOnClickListener(this);
        btnSetCamera.setOnClickListener(this);
        btnClearFace.setOnClickListener(this);
        btnRegister.setOnClickListener(this);
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
        InputMethodManager inputManger = (InputMethodManager) m_activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
        inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
        switch (view.getId()) {
            case R.id.btn_setting_change_weight:
                m_activity.uiSetCalibration.setCalibrationData(SettingData.getInstance().getWeight());
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_setting_change_wind:
                m_activity.uiSetCalibration.setCalibrationData(SettingData.getInstance().getWind());
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_setting_change_amplitude:
                m_activity.uiSetCalibration.setCalibrationData(SettingData.getInstance().getAmplitude());
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_setting_change_turn_around:
                m_activity.uiSetCalibration.setCalibrationData(SettingData.getInstance().getTurnAround());
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_setting_change_height:
                m_activity.uiSetCalibration.setCalibrationData(SettingData.getInstance().getHeight());
                m_activity.uiSetCalibration.show();
                hide();
                break;
            case R.id.btn_setting_change_camera:
                m_activity.uiCameraList.show();
                hide();
                break;
            case R.id.btn_setting_clear_face:
                int faceNum = FaceServer.getInstance().getFaceNumber(m_activity);
                if (faceNum == 0) {
                    m_activity.showToast(m_activity.getString(R.string.batch_process_no_face_need_to_delete));
                } else {
                    AlertDialog dialog = new AlertDialog.Builder(m_activity)
                            .setTitle(R.string.batch_process_notification)
                            .setMessage(m_activity.getString(R.string.batch_process_confirm_delete, faceNum))
                            .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    FaceServer.getInstance().clearAllFaces(m_activity);
                                    m_activity.showToast("清除成功");
                                }
                            })
                            .setNegativeButton(R.string.cancel, null)
                            .create();
                    dialog.show();
                }
                break;
            case R.id.btn_setting_face_register:
                m_activity.uiFaceRegister.show();
                hide();
                break;
            case R.id.btn_setting_back:
                hide();
                break;
        }
    }
}
