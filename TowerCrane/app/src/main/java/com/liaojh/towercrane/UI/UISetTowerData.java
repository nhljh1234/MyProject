package com.liaojh.towercrane.UI;

import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UISetTowerData implements InterfaceDialog {
    private LinearLayout layoutSetTower;

    private Button btnChange, btnBack;

    private EditText editSpecifications, editMonitorNumber, editTowerNumber, editBackArmLength, editBigArmLength, editTowerHigh,
            editPosX, editPosY, editMagnification, editVolume, editCheckFaceInterval, editUploadInterval, editReadDataInterval,
            editCsvSaveInterval, editHeartInterval;

    private MainActivity m_activity;

    private void updateValue() {
        editSpecifications.setText(SettingData.getInstance().getTowerCraneData().getSpecificationsStr());
        editMonitorNumber.setText(SettingData.getInstance().getTowerCraneData().getMonitorNumberStr());
        editTowerNumber.setText(SettingData.getInstance().getTowerCraneData().getTowerNumberStr());
        editBackArmLength.setText(SettingData.getInstance().getTowerCraneData().getBackArmLengthStr());
        editBigArmLength.setText(SettingData.getInstance().getTowerCraneData().getBigArmLengthStr());
        editTowerHigh.setText(SettingData.getInstance().getTowerCraneData().getTowerHeightStr());
        editPosX.setText(SettingData.getInstance().getTowerCraneData().getPosXStr());
        editPosY.setText(SettingData.getInstance().getTowerCraneData().getPosYStr());
        editMagnification.setText(SettingData.getInstance().getTowerCraneData().getMagnificationStr());
        editVolume.setText(SettingData.getInstance().getTowerCraneData().getVolumeStr());
        editCheckFaceInterval.setText(SettingData.getInstance().getTowerCraneData().getCheckFaceIntervalStr());
        editUploadInterval.setText(SettingData.getInstance().getTowerCraneData().getUploadIntervalStr());
        editReadDataInterval.setText(SettingData.getInstance().getTowerCraneData().getReadDataIntervalStr());
        editCsvSaveInterval.setText(SettingData.getInstance().getTowerCraneData().getCsvSaveIntervalStr());
        editHeartInterval.setText(SettingData.getInstance().getTowerCraneData().getHeartIntervalStr());
    }

    private void save() {
        Boolean success = SettingData.getInstance().getTowerCraneData().saveSpecifications(editSpecifications.getText().toString()) &&
                SettingData.getInstance().getTowerCraneData().saveMonitorNumber(editMonitorNumber.getText().toString()) &&
                SettingData.getInstance().getTowerCraneData().saveTowerNumber(editTowerNumber.getText().toString()) &&
                SettingData.getInstance().getTowerCraneData().saveBackArmLength(Float.parseFloat(editBackArmLength.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveBigArmLength(Float.parseFloat(editBigArmLength.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveTowerHeight(Float.parseFloat(editTowerHigh.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().savePosX(Float.parseFloat(editPosX.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().savePosY(Float.parseFloat(editPosY.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveMagnification(Float.parseFloat(editMagnification.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveVolume(Float.parseFloat(editVolume.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveCheckFaceInterval(Integer.parseInt(editCheckFaceInterval.getText().toString()) * 60) &&
                SettingData.getInstance().getTowerCraneData().saveUploadInterval(Integer.parseInt(editUploadInterval.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveReadDataInterval(Integer.parseInt(editReadDataInterval.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveCsvSaveInterval(Integer.parseInt(editCsvSaveInterval.getText().toString())) &&
                SettingData.getInstance().getTowerCraneData().saveHeartInterval(Integer.parseInt(editHeartInterval.getText().toString()));

        SettingData.getInstance().getTowerCraneData().readLocalData();

        if (success) {
            m_activity.showToast("保存成功");
        } else {
            m_activity.showToast("保存失败");
        }
    }

    @Override
    public void show() {
        layoutSetTower.setVisibility(View.VISIBLE);
        updateValue();
    }

    @Override
    public void hide() {
        layoutSetTower.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        layoutSetTower = activity.findViewById(R.id.layout_set_tower_data);

        btnChange = activity.findViewById(R.id.btn_tower_setting_change);
        btnBack = activity.findViewById(R.id.btn_tower_setting_back);
        btnChange.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        editSpecifications = activity.findViewById(R.id.edit_setting_specifications);
        editMonitorNumber = activity.findViewById(R.id.edit_setting_monitor_number);
        editTowerNumber = activity.findViewById(R.id.edit_setting_tower_number);
        editBackArmLength = activity.findViewById(R.id.edit_setting_back_arm_length);
        editBigArmLength = activity.findViewById(R.id.edit_setting_big_arm_length);
        editTowerHigh = activity.findViewById(R.id.edit_setting_tower_high);
        editPosX = activity.findViewById(R.id.edit_setting_pos_x);
        editPosY = activity.findViewById(R.id.edit_setting_pos_y);
        editMagnification = activity.findViewById(R.id.edit_setting_magnification);
        editVolume = activity.findViewById(R.id.edit_setting_volume);
        editCheckFaceInterval = activity.findViewById(R.id.edit_setting_check_face_interval);
        editUploadInterval = activity.findViewById(R.id.edit_setting_upload_interval);
        editReadDataInterval = activity.findViewById(R.id.edit_setting_read_data_interval);
        editCsvSaveInterval = activity.findViewById(R.id.edit_setting_csv_save_interval);
        editHeartInterval = activity.findViewById(R.id.edit_setting_heart_interval);
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
            case R.id.btn_tower_setting_back:
                m_activity.uiSetting.show();
                hide();
                break;
            case R.id.btn_tower_setting_change:
                save();
                m_activity.uiTowerCraneRunInfo.updateTowerData();
                updateValue();
                break;
        }
    }
}
