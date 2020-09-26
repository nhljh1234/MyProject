package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.media.Image;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Data.TowerCraneAmplitudeData;
import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UIAmplitudeRunInfo implements InterfaceUI {
    private Activity activity;

    private ImageView imageStatus, imageGeneratrix, imageOutputVoltage, imageOutputElectricity, imageRunFrequency, imageTurnSpeed,
            imageTemperature;

    private TextView textStatus, textGeneratrix, textOutputVoltage, textOutputElectricity, textRunFrequency, textTurnSpeed,
            textTemperature;

    private TextView textFrontSlowDown, textBackSlowDown, textFrontDestination, textBackDestination, textTorque100, textTorque90, textTorque80,
            textBrakeUnit, textRunSlowDown;

    private TextView textUpDownCommunicationStatus;

    private void updateImageWaringInfo(Boolean isWaring, ImageView imageView, TextView textView) {
        if (isWaring) {
            imageView.setImageDrawable(activity.getDrawable(R.drawable.yibiaopan_red));
            textView.setTextColor(activity.getResources().getColor(R.color.color_label_red));
        } else {
            imageView.setImageDrawable(activity.getDrawable(R.drawable.yibiaopan_blue));
            textView.setTextColor(activity.getResources().getColor(R.color.color_label_blue));
        }
    }

    private void updateTextWaringInfo(Boolean isWaring, TextView view) {
        if (isWaring) {
            view.setTextColor(activity.getResources().getColor(R.color.color_label_red));
            view.setText(activity.getString(R.string.text_waring));
        } else {
            view.setTextColor(activity.getResources().getColor(R.color.color_label_blue));
            view.setText(activity.getString(R.string.text_normal));
        }
    }

    @Override
    public void onUICreate(Activity activityIn) {
        activity = activityIn;

        imageStatus = (ImageView) activity.findViewById(R.id.image_amplitude_status);
        imageGeneratrix = (ImageView) activity.findViewById(R.id.image_amplitude_generatrix);
        imageOutputVoltage = (ImageView) activity.findViewById(R.id.image_amplitude_output_voltage);
        imageOutputElectricity = (ImageView) activity.findViewById(R.id.image_amplitude_output_electricity);
        imageRunFrequency = (ImageView) activity.findViewById(R.id.image_amplitude_run_frequency);
        imageTurnSpeed = (ImageView) activity.findViewById(R.id.image_amplitude_turn_speed);
        imageTemperature = (ImageView) activity.findViewById(R.id.image_amplitude_temperature);

        textStatus = (TextView) activity.findViewById(R.id.text_amplitude_status);
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

        updateImageWaringInfo(towerCraneAmplitudeData.judgeStatusIsWaring(), imageStatus, textStatus);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeGeneratrixVoltageIsWaring(), imageGeneratrix, textGeneratrix);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeOutputVoltageIsWaring(), imageOutputVoltage, textOutputVoltage);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeOutputElectricityIsWaring(), imageOutputElectricity, textOutputElectricity);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeRunFrequencyIsWaring(), imageRunFrequency, textRunFrequency);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeTurnSpeedIsWaring(), imageTurnSpeed, textTurnSpeed);
        updateImageWaringInfo(towerCraneAmplitudeData.judgeTemperatureIsWaring(), imageTemperature, textTemperature);

        textStatus.setText(towerCraneAmplitudeData.getStatusStr());
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

        if (towerCraneAmplitudeData.judgeCommunicationIsWaring()) {
            textUpDownCommunicationStatus.setVisibility(View.VISIBLE);
        } else {
            textUpDownCommunicationStatus.setVisibility(View.GONE);
        }
    }

    @Override
    public void onClick(View view) {

    }
}
