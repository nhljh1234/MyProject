package com.liaojh.towercrane.UI;

import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
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

import androidx.appcompat.app.AlertDialog;

public class UISetCalibration implements InterfaceDialog {

    private EditText editMeasure_1, editDemarcate_1, editMeasure_2, editDemarcate_2, editLowWarn, editLowError, editHighWarn, editHighError;

    private TextView textLowErrorControl, textHighErrorControl;

    private Button btnSure, btnBack;

    private TextView textTitle;

    private LinearLayout layoutSetCalibration;

    private CalibrationData m_calibrationData;

    private MainActivity m_activity;

    private int lowErrorControl, highErrorControl;

    private int lowErrorControlSelect, highErrorControlSelect;

    private final int LOW_ERROR_CONTROL = 1;
    private final int HIGH_ERROR_CONTROL = 2;

    private void setTitle(int type) {
        switch (type) {
            case Constant.CALIBRATION_TYPE_WEIGHT:
                textTitle.setText(m_activity.getResources().getString(R.string.change_weight));
                break;
            case Constant.CALIBRATION_TYPE_WIND:
                textTitle.setText(m_activity.getResources().getString(R.string.change_wind));
                break;
            case Constant.CALIBRATION_TYPE_AMPLITUDE:
                textTitle.setText(m_activity.getResources().getString(R.string.change_amplitude));
                break;
            case Constant.CALIBRATION_TYPE_TURN_AROUND:
                textTitle.setText(m_activity.getResources().getString(R.string.change_turn_around));
                break;
            case Constant.CALIBRATION_TYPE_HEIGHT:
                textTitle.setText(m_activity.getResources().getString(R.string.change_height));
                break;
        }
    }

    public void setCalibrationData(CalibrationData calibrationData) {
        m_calibrationData = calibrationData;

        editMeasure_1.setText(m_calibrationData.getMeasureStr_1());
        editDemarcate_1.setText(m_calibrationData.getDemarcateStr_1());
        editMeasure_2.setText(m_calibrationData.getMeasureStr_2());
        editDemarcate_2.setText(m_calibrationData.getDemarcateStr_2());
        editLowWarn.setText(m_calibrationData.getLowWarnStr());
        editLowError.setText(m_calibrationData.getLowErrorStr());
        editHighWarn.setText(m_calibrationData.getHighWarnStr());
        editHighError.setText(m_calibrationData.getHighErrorStr());
        textLowErrorControl.setText(m_calibrationData.getLowErrorControlStr());
        textHighErrorControl.setText(m_calibrationData.getHighErrorControlStr());

        lowErrorControl = m_calibrationData.getLowErrorControl();
        highErrorControl = m_calibrationData.getHighErrorControl();

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
                m_calibrationData.saveLowErrorWork(lowErrorControl) &&
                m_calibrationData.saveHighErrorWork(highErrorControl);

        m_calibrationData.readLocalData();

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

        textLowErrorControl = activityIn.findViewById(R.id.text_low_error_control);
        textHighErrorControl = activityIn.findViewById(R.id.text_high_error_control);
        textLowErrorControl.setOnClickListener(this);
        textHighErrorControl.setOnClickListener(this);

        btnSure = activityIn.findViewById(R.id.btn_calibration_change);
        btnBack = activityIn.findViewById(R.id.btn_calibration_back);
        btnSure.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        textTitle = activityIn.findViewById(R.id.text_calibration_title);
        textTitle.setOnClickListener(this);

        layoutSetCalibration = activityIn.findViewById(R.id.layout_set_calibration);
        layoutSetCalibration.setOnClickListener(this);

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
            case R.id.btn_calibration_change:
                save();
                m_activity.uiSetting.show();
                hide();
                break;
            case R.id.btn_calibration_back:
                m_activity.uiSetting.show();
                hide();
                break;
            case R.id.text_low_error_control:
                showControlAlert(LOW_ERROR_CONTROL);
                break;
            case R.id.text_high_error_control:
                showControlAlert(HIGH_ERROR_CONTROL);
                break;
        }
    }

    private void showControlAlert(final int type) {
        AlertDialog.Builder builder = new AlertDialog.Builder(m_activity);//内部使用构建者的设计模式
        final String[] items = Constant.CALIBRATION_CONTROL;
        builder.setTitle("控制选择");
        builder.setSingleChoiceItems(items, (type == LOW_ERROR_CONTROL ? lowErrorControl : highErrorControl),
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int which) {
                        switch (type) {
                            case LOW_ERROR_CONTROL:
                                lowErrorControlSelect = which;
                                break;
                            case HIGH_ERROR_CONTROL:
                                highErrorControlSelect = which;
                                break;
                        }
                    }
                }).setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int which) {
                        switch (type) {
                            case LOW_ERROR_CONTROL:
                                lowErrorControl = lowErrorControlSelect;
                                textLowErrorControl.setText(Constant.CALIBRATION_CONTROL[lowErrorControl]);
                                break;
                            case HIGH_ERROR_CONTROL:
                                highErrorControl = highErrorControlSelect;
                                textHighErrorControl.setText(Constant.CALIBRATION_CONTROL[highErrorControl]);
                                break;
                        }
                    }
                }).setNegativeButton(R.string.cancel, null).create().show();//创建对象
    }
}
