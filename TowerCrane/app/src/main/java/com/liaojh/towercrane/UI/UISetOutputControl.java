package com.liaojh.towercrane.UI;

import android.content.DialogInterface;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.OutputControlData;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

import androidx.appcompat.app.AlertDialog;

public class UISetOutputControl implements InterfaceDialog {
    private LinearLayout layoutOutputControl;
    private TextView textLoad_25, textLoad_50, textLoad_90, textLoad_100, textTorque_80, textTorque_90, textTorque_100, textTorque_110;
    private LinearLayout layoutControl_1, layoutControl_2, layoutControl_3, layoutControl_4, layoutControl_5, layoutControl_6, layoutControl_7, layoutControl_8;
    private LinearLayout layoutLoad_25, layoutLoad_50, layoutLoad_90, layoutLoad_100, layoutTorque_80, layoutTorque_90, layoutTorque_100, layoutTorque_110;
    private MainActivity m_activity;
    private Button btnBack, btnSave;

    private final int typeLoad_25 = 1;
    private final int typeLoad_50 = 2;
    private final int typeLoad_90 = 3;
    private final int typeLoad_100 = 4;
    private final int typeTorque_80 = 5;
    private final int typeTorque_90 = 6;
    private final int typeTorque_100 = 7;
    private final int typeTorque_110 = 8;

    private int load_select_25, load_select_50, load_select_90, load_select_100, torque_select_80, torque_select_90, torque_select_100, torque_select_110;

    private int load_25, load_50, load_90, load_100, torque_80, torque_90, torque_100, torque_110;

    @Override
    public void show() {
        layoutOutputControl.setVisibility(View.VISIBLE);
        showData();
    }

    @Override
    public void hide() {
        layoutOutputControl.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        m_activity = activityIn;

        layoutOutputControl = m_activity.findViewById(R.id.layout_set_output_control);

        textLoad_25 = m_activity.findViewById(R.id.text_load_25);
        textLoad_50 = m_activity.findViewById(R.id.text_load_50);
        textLoad_90 = m_activity.findViewById(R.id.text_load_90);
        textLoad_100 = m_activity.findViewById(R.id.text_load_100);
        textTorque_80 = m_activity.findViewById(R.id.text_torque_80);
        textTorque_90 = m_activity.findViewById(R.id.text_torque_90);
        textTorque_100 = m_activity.findViewById(R.id.text_torque_100);
        textTorque_110 = m_activity.findViewById(R.id.text_torque_110);

        layoutLoad_25 = m_activity.findViewById(R.id.layout_load_25);
        layoutLoad_50 = m_activity.findViewById(R.id.layout_load_50);
        layoutLoad_90 = m_activity.findViewById(R.id.layout_load_90);
        layoutLoad_100 = m_activity.findViewById(R.id.layout_load_100);
        layoutTorque_80 = m_activity.findViewById(R.id.layout_torque_80);
        layoutTorque_90 = m_activity.findViewById(R.id.layout_torque_90);
        layoutTorque_100 = m_activity.findViewById(R.id.layout_torque_100);
        layoutTorque_110 = m_activity.findViewById(R.id.layout_torque_110);
        layoutLoad_25.setOnClickListener(this);
        layoutLoad_50.setOnClickListener(this);
        layoutLoad_90.setOnClickListener(this);
        layoutLoad_100.setOnClickListener(this);
        layoutTorque_80.setOnClickListener(this);
        layoutTorque_90.setOnClickListener(this);
        layoutTorque_100.setOnClickListener(this);
        layoutTorque_110.setOnClickListener(this);

        layoutControl_1 = m_activity.findViewById(R.id.layout_output_control_1);
        layoutControl_2 = m_activity.findViewById(R.id.layout_output_control_2);
        layoutControl_3 = m_activity.findViewById(R.id.layout_output_control_3);
        layoutControl_4 = m_activity.findViewById(R.id.layout_output_control_4);
        layoutControl_5 = m_activity.findViewById(R.id.layout_output_control_5);
        layoutControl_6 = m_activity.findViewById(R.id.layout_output_control_6);
        layoutControl_7 = m_activity.findViewById(R.id.layout_output_control_7);
        layoutControl_8 = m_activity.findViewById(R.id.layout_output_control_8);

        btnBack = m_activity.findViewById(R.id.btn_output_control_back);
        btnSave = m_activity.findViewById(R.id.btn_output_control_save);
        btnBack.setOnClickListener(this);
        btnSave.setOnClickListener(this);
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
            case R.id.btn_output_control_back:
                hide();
                break;
            case R.id.btn_output_control_save:
                save();
                break;
            case R.id.layout_load_25:
                showControlAlert(typeLoad_25);
                break;
            case R.id.layout_load_50:
                showControlAlert(typeLoad_50);
                break;
            case R.id.layout_load_90:
                showControlAlert(typeLoad_90);
                break;
            case R.id.layout_load_100:
                showControlAlert(typeLoad_100);
                break;
            case R.id.layout_torque_80:
                showControlAlert(typeTorque_80);
                break;
            case R.id.layout_torque_90:
                showControlAlert(typeTorque_90);
                break;
            case R.id.layout_torque_100:
                showControlAlert(typeTorque_100);
                break;
            case R.id.layout_torque_110:
                showControlAlert(typeTorque_110);
                break;
        }
    }

    public void save() {
        OutputControlData outputControlData = SettingData.getInstance().getOutputControlData();
        if (outputControlData == null) {
            m_activity.showToast("保存数据错误");
            return;
        }
        Boolean success = outputControlData.saveLoad_25(load_25) &&
                outputControlData.saveLoad_50(load_50) &&
                outputControlData.saveLoad_90(load_90) &&
                outputControlData.saveLoad_100(load_100) &&
                outputControlData.saveTorque_80(torque_80) &&
                outputControlData.saveTorque_90(torque_90) &&
                outputControlData.saveTorque_100(torque_100) &&
                outputControlData.saveTorque_110(torque_110);

        SettingData.getInstance().getOutputControlData().readLocalData();
        showData();

        if (success) {
            m_activity.showToast("保存成功");
        } else {
            m_activity.showToast("保存失败");
        }
    }

    private void showData() {
        load_25 = SettingData.getInstance().getOutputControlData().getLoad_25();
        load_50 = SettingData.getInstance().getOutputControlData().getLoad_50();
        load_90 = SettingData.getInstance().getOutputControlData().getLoad_90();
        load_100 = SettingData.getInstance().getOutputControlData().getLoad_100();
        torque_80 = SettingData.getInstance().getOutputControlData().getTorque_80();
        torque_90 = SettingData.getInstance().getOutputControlData().getTorque_90();
        torque_100 = SettingData.getInstance().getOutputControlData().getTorque_100();
        torque_110 = SettingData.getInstance().getOutputControlData().getTorque_110();

        textLoad_25.setText(SettingData.getInstance().getOutputControlData().getLoadStr_25());
        textLoad_50.setText(SettingData.getInstance().getOutputControlData().getLoadStr_50());
        textLoad_90.setText(SettingData.getInstance().getOutputControlData().getLoadStr_90());
        textLoad_100.setText(SettingData.getInstance().getOutputControlData().getLoadStr_100());
        textTorque_80.setText(SettingData.getInstance().getOutputControlData().getTorqueStr_80());
        textTorque_90.setText(SettingData.getInstance().getOutputControlData().getTorqueStr_90());
        textTorque_100.setText(SettingData.getInstance().getOutputControlData().getTorqueStr_100());
        textTorque_110.setText(SettingData.getInstance().getOutputControlData().getTorqueStr_110());
    }

    private void showControlAlert(final int type) {
        AlertDialog.Builder builder = new AlertDialog.Builder(m_activity);//内部使用构建者的设计模式
        final String[] items = Constant.OUTPUT_CONTROL;
        builder.setTitle("控制选择");
        builder.setSingleChoiceItems(items, type,
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int which) {
                        switch (type) {
                            case typeLoad_25:
                                load_select_25 = which;
                                break;
                            case typeLoad_50:
                                load_select_50 = which;
                                break;
                            case typeLoad_90:
                                load_select_90 = which;
                                break;
                            case typeLoad_100:
                                load_select_100 = which;
                                break;
                            case typeTorque_80:
                                torque_select_80 = which;
                                break;
                            case typeTorque_90:
                                torque_select_90 = which;
                                break;
                            case typeTorque_100:
                                torque_select_100 = which;
                                break;
                            case typeTorque_110:
                                torque_select_110 = which;
                                break;
                        }
                    }
                }).setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                switch (type) {
                    case typeLoad_25:
                        load_25 = load_select_25;
                        textLoad_25.setText(Constant.OUTPUT_CONTROL[load_25]);
                        break;
                    case typeLoad_50:
                        load_50 = load_select_50;
                        textLoad_25.setText(Constant.OUTPUT_CONTROL[load_50]);
                        break;
                    case typeLoad_90:
                        load_90 = load_select_90;
                        textLoad_90.setText(Constant.OUTPUT_CONTROL[load_90]);
                        break;
                    case typeLoad_100:
                        load_100 = load_select_100;
                        textLoad_100.setText(Constant.OUTPUT_CONTROL[load_100]);
                        break;
                    case typeTorque_80:
                        torque_80 = torque_select_80;
                        textTorque_80.setText(Constant.OUTPUT_CONTROL[torque_80]);
                        break;
                    case typeTorque_90:
                        torque_90 = torque_select_90;
                        textTorque_90.setText(Constant.OUTPUT_CONTROL[torque_90]);
                        break;
                    case typeTorque_100:
                        torque_100 = torque_select_100;
                        textTorque_100.setText(Constant.OUTPUT_CONTROL[torque_100]);
                        break;
                    case typeTorque_110:
                        torque_110 = torque_select_110;
                        textTorque_110.setText(Constant.OUTPUT_CONTROL[torque_110]);
                        break;
                }
            }
        }).setNegativeButton(R.string.cancel, null).create().show();//创建对象
    }
}
