package com.liaojh.towercrane.UI;

import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.CalibrationData;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.R;

import java.util.concurrent.CopyOnWriteArrayList;

public class UISetCalibration implements InterfaceDialog {

    private EditText editMeasure_1, editDemarcate_1, editMeasure_2, editDemarcate_2, editLowWarn, editLowError, editHighWarn, editHighError;

    private Switch switchLowErrorWork, switchLHighErrorWork;

    private Button btnSure, btnBack;

    private TextView textTitle;

    private LinearLayout layoutSetCalibration;

    private CalibrationData m_calibrationData;

    private MainActivity m_activity;

    private void setTitle(Constant.CALIBRATION_TYPE type) {
        if (type == Constant.CALIBRATION_TYPE.Weight) {
            textTitle.setText(m_activity.getResources().getString(R.string.change_weight));
        } else if (type == Constant.CALIBRATION_TYPE.Wind) {
            textTitle.setText(m_activity.getResources().getString(R.string.change_wind));
        } else if (type == Constant.CALIBRATION_TYPE.Amplitude) {
            textTitle.setText(m_activity.getResources().getString(R.string.change_amplitude));
        } else if (type == Constant.CALIBRATION_TYPE.TurnAround) {
            textTitle.setText(m_activity.getResources().getString(R.string.change_turn_around));
        } else if (type == Constant.CALIBRATION_TYPE.Height) {
            textTitle.setText(m_activity.getResources().getString(R.string.change_height));
        }
    }

    public void setCalibrationData(CalibrationData calibrationData) {
        m_calibrationData = calibrationData;

        editMeasure_1.setText(m_calibrationData.getMeasure_1());
        editDemarcate_1.setText(m_calibrationData.getDemarcate_1());
        editMeasure_2.setText(m_calibrationData.getMeasure_2());
        editDemarcate_2.setText(m_calibrationData.getDemarcate_2());
        editLowWarn.setText(m_calibrationData.getLowWarn());
        editLowError.setText(m_calibrationData.getLowError());
        editHighWarn.setText(m_calibrationData.getHighWarn());
        editHighError.setText(m_calibrationData.getHighError());
        switchLowErrorWork.setChecked(m_calibrationData.getLowErrorWork());
        switchLHighErrorWork.setChecked(m_calibrationData.getHighErrorWork());

        setTitle(calibrationData.getType());
    }

    public void save() {
        if (m_calibrationData == null) {
            m_activity.showToast("保存数据错误");
            return;
        }
        Boolean success = m_calibrationData.saveMeasure_1(Float.parseFloat(editMeasure_1.getText().toString())) &&
                m_calibrationData.saveDemarcate_1(Float.parseFloat(editDemarcate_1.getText().toString())) &&
                m_calibrationData.saveMeasure_2(Float.parseFloat(editMeasure_2.getText().toString())) &&
                m_calibrationData.saveDemarcate_2(Float.parseFloat(editDemarcate_2.getText().toString())) &&
                m_calibrationData.saveLowWarn(Float.parseFloat(editLowWarn.getText().toString())) &&
                m_calibrationData.saveLowError(Float.parseFloat(editLowError.getText().toString())) &&
                m_calibrationData.saveHighWarn(Float.parseFloat(editHighWarn.getText().toString())) &&
                m_calibrationData.saveHighError(Float.parseFloat(editHighWarn.getText().toString())) &&
                m_calibrationData.saveLowErrorWork(switchLowErrorWork.isChecked()) &&
                m_calibrationData.saveHighErrorWork(switchLHighErrorWork.isChecked());

        m_calibrationData.updateValue();

        if (success) {
            m_activity.showToast("保存成功");
        } else {
            m_activity.showToast("保存失败");
        }
    }

    @Override
    public void show() {
        layoutSetCalibration.setVisibility(View.VISIBLE);
    }

    @Override
    public void hide() {
        layoutSetCalibration.setVisibility(View.INVISIBLE);
        m_calibrationData = null;
    }

    @Override
    public void onUICreate(MainActivity activityIn) {

        m_activity = activityIn;

        editMeasure_1 = activityIn.findViewById(R.id.edit_calibration_measure_1);
        editMeasure_2 = activityIn.findViewById(R.id.edit_calibration_measure_2);
        editDemarcate_1 = activityIn.findViewById(R.id.edit_calibration_demarcate_1);
        editDemarcate_2 = activityIn.findViewById(R.id.edit_calibration_demarcate_2);
        editLowWarn = activityIn.findViewById(R.id.edit_calibration_low_warn);
        editLowError = activityIn.findViewById(R.id.edit_calibration_low_error);
        editHighWarn = activityIn.findViewById(R.id.edit_calibration_high_warn);
        editHighError = activityIn.findViewById(R.id.edit_calibration_high_error);

        switchLowErrorWork = activityIn.findViewById(R.id.switch_low_error_control);
        switchLHighErrorWork = activityIn.findViewById(R.id.switch_high_error_control);

        btnSure = activityIn.findViewById(R.id.btn_calibration_change);
        btnBack = activityIn.findViewById(R.id.btn_calibration_back);
        btnSure.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        textTitle = activityIn.findViewById(R.id.text_calibration_title);
        textTitle.setOnClickListener(this);

        layoutSetCalibration = activityIn.findViewById(R.id.layout_set_calibration);

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
            case R.id.btn_calibration_change:
                save();
                hide();
                break;
            case R.id.btn_calibration_back:
                hide();
                break;
            case R.id.text_calibration_title:
                
                break;
        }
    }
}
