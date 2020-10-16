package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.media.Image;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Data.TowerCraneAmplitudeData;
import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Data.TowerCraneRunData;

import org.w3c.dom.Text;

public class UIAmplitudeRunInfo implements InterfaceUI {
    private Activity activity;

    private TextView textStatusRun, textStatusStop, textGeneratrix, textOutputVoltage, textOutputElectricity, textRunFrequency, textTurnSpeed,
            textTemperature;

    private TextView textFrontSlowDown, textBackSlowDown, textFrontDestination, textBackDestination, textTorque100, textTorque90, textTorque80,
            textBrakeUnit, textRunSlowDown;

    private TextView textUpDownCommunicationStatus;

    private void updateTextWaringInfo(Boolean warning, TextView view) {
        if (warning) {
            view.setTextColor(activity.getResources().getColor(R.color.color_label_red));
            view.setText(activity.getString(R.string.text_error));
        } else {
            view.setTextColor(activity.getResources().getColor(R.color.color_label_blue));
            view.setText(activity.getString(R.string.text_normal));
        }
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        activity = activityIn;

        textStatusRun = (TextView) activity.findViewById(R.id.text_amplitude_status_run);
        textStatusStop = (TextView) activity.findViewById(R.id.text_amplitude_status_stop);
        textGeneratrix = (TextView) activity.findViewById(R.id.text_amplitude_generatrix);
        textOutputVoltage = (TextView) activity.findViewById(R.id.text_amplitude_output_voltage);
        textOutputElectricity = (TextView) activity.findViewById(R.id.text_amplitude_output_electricity);
        textRunFrequency = (TextView) activity.findViewById(R.id.text_amplitude_run_frequency);
        textTurnSpeed = (TextView) activity.findViewById(R.id.text_amplitude_turn_speed);
        textTemperature = (TextView) activity.findViewById(R.id.text_amplitude_temperature);

        textFrontSlowDown = (TextView) activity.findViewById(R.id.text_amplitude_front_slow_down);
        textBackSlowDown = (TextView) activity.findViewById(R.id.text_amplitude_back_slow_down);
        textFrontDestination = (TextView) activity.findViewById(R.id.text_amplitude_front_destination);
        textBackDestination = (TextView) activity.findViewById(R.id.text_amplitude_back_destination);
        textTorque100 = (TextView) activity.findViewById(R.id.text_amplitude_torque_100);
        textTorque90 = (TextView) activity.findViewById(R.id.text_amplitude_torque_90);
        textTorque80 = (TextView) activity.findViewById(R.id.text_amplitude_torque_80);
        textBrakeUnit = (TextView) activity.findViewById(R.id.text_amplitude_brake_unit);
        textRunSlowDown = (TextView) activity.findViewById(R.id.text_amplitude_run_slow_downn);

        textUpDownCommunicationStatus = (TextView) activity.findViewById(R.id.text_amplitude_waring);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {
        TowerCraneAmplitudeData towerCraneAmplitudeData = towerCraneRunData.towerCraneAmplitudeData;

        textStatusRun.setText(towerCraneAmplitudeData.getStatusRunStr());
        textStatusStop.setText(towerCraneAmplitudeData.getStatusStopStr());
        textGeneratrix.setText(towerCraneAmplitudeData.getGeneratrixVoltageStr());
        textOutputVoltage.setText(towerCraneAmplitudeData.getOutputVoltageStr());
        textOutputElectricity.setText(towerCraneAmplitudeData.getOutputElectricityStr());
        textRunFrequency.setText(towerCraneAmplitudeData.getRunFrequencyStr());
        textTurnSpeed.setText(towerCraneAmplitudeData.getTurnSpeedStr());
        textTemperature.setText(towerCraneAmplitudeData.getTemperatureStr());

        updateTextWaringInfo(towerCraneAmplitudeData.judgeFrontSlowDownIsWaring(), textFrontSlowDown);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeBackSlowDownIsWaring(), textBackSlowDown);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeFrontDestinationIsWaring(), textFrontDestination);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeBackDestinationIsWaring(), textBackDestination);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeTorqueIsWaring_100(), textTorque100);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeTorqueIsWaring_90(), textTorque90);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeTorqueIsWaring_80(), textTorque80);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeBrakeUnitIsWaring(), textBrakeUnit);
        updateTextWaringInfo(towerCraneAmplitudeData.judgeRunSlowDownIsWaring(), textRunSlowDown);

        textUpDownCommunicationStatus.setText(towerCraneAmplitudeData.getWarnOrErrorStr());
    }

    @Override
    public void onClick(View view) {

    }
}
