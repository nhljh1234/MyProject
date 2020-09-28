package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.media.Image;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UIUpDownRunInfo implements InterfaceUI {
    private Activity activity;

    private ImageView imageStatus, imageBrakeCheck, imageGeneratrix, imageOutputVoltage, imageOutputElectricity, imageRunFrequency,
            imageTurnSpeed, imageTemperature;

    private TextView textStatus, textBrakeCheck, textGeneratrix, textOutputVoltage, textOutputElectricity, textRunFrequency,
            textTurnSpeed, textTemperature;

    private TextView textUpSlowDown, textDownSlowDown, textUpDestination, textDownDestination, textLoad100, textLoad90, textLoad50,
            textLoad25, textBrakeUnit, textBrake, textRunSlowDown, textBrakeOpen, textLimitSwitch;

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
    public void onUICreate(BaseActivity activityIn) {
        activity = activityIn;

        imageStatus = (ImageView) activity.findViewById(R.id.image_up_down_status);
        imageBrakeCheck = (ImageView) activity.findViewById(R.id.image_up_down_brake_check);
        imageGeneratrix = (ImageView) activity.findViewById(R.id.image_up_down_generatrix);
        imageOutputVoltage = (ImageView) activity.findViewById(R.id.image_up_down_output_voltage);
        imageOutputElectricity = (ImageView) activity.findViewById(R.id.image_up_down_output_electricity);
        imageRunFrequency = (ImageView) activity.findViewById(R.id.image_up_down_run_frequency);
        imageTurnSpeed = (ImageView) activity.findViewById(R.id.image_up_down_turn_speed);
        imageTemperature = (ImageView) activity.findViewById(R.id.image_up_down_temperature);

        textStatus = (TextView) activity.findViewById(R.id.text_up_down_status);
        textBrakeCheck = (TextView) activity.findViewById(R.id.text_up_down_brake_check);
        textGeneratrix = (TextView) activity.findViewById(R.id.text_up_down_generatrix);
        textOutputVoltage = (TextView) activity.findViewById(R.id.text_up_down_output_voltage);
        textOutputElectricity = (TextView) activity.findViewById(R.id.text_up_down_output_electricity);
        textRunFrequency = (TextView) activity.findViewById(R.id.text_up_down_run_frequency);
        textTurnSpeed = (TextView) activity.findViewById(R.id.text_up_down_turn_speed);
        textTemperature = (TextView) activity.findViewById(R.id.text_up_down_temperature);

        textUpSlowDown = (TextView) activity.findViewById(R.id.text_up_down_up_slow_down);
        textDownSlowDown = (TextView) activity.findViewById(R.id.text_up_down_down_slow_down);
        textUpDestination = (TextView) activity.findViewById(R.id.text_up_down_up_destination);
        textDownDestination = (TextView) activity.findViewById(R.id.text_up_down_down_destination);
        textLoad100 = (TextView) activity.findViewById(R.id.text_up_down_load_100);
        textLoad90 = (TextView) activity.findViewById(R.id.text_up_down_load_90);
        textLoad50 = (TextView) activity.findViewById(R.id.text_up_down_load_50);
        textLoad25 = (TextView) activity.findViewById(R.id.text_up_down_load_25);
        textBrakeUnit = (TextView) activity.findViewById(R.id.text_up_down_brake_unit);
        textBrake = (TextView) activity.findViewById(R.id.text_up_down_brake);
        textRunSlowDown = (TextView) activity.findViewById(R.id.text_up_down_run_slow_down);
        textBrakeOpen = (TextView) activity.findViewById(R.id.text_up_down_brake_open);
        textLimitSwitch = (TextView) activity.findViewById(R.id.text_up_down_limit_switch);

        textUpDownCommunicationStatus = (TextView) activity.findViewById(R.id.text_up_down_waring);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {
        TowerCraneLiftData towerCraneLiftData = towerCraneRunData.towerCraneLiftData;

        updateImageWaringInfo(towerCraneLiftData.judgeStatusIsWaring(), imageStatus, textStatus);
        updateImageWaringInfo(towerCraneLiftData.judgeBrakeCheckIsWaring(), imageBrakeCheck, textBrakeCheck);
        updateImageWaringInfo(towerCraneLiftData.judgeGeneratrixVoltageIsWaring(), imageGeneratrix, textGeneratrix);
        updateImageWaringInfo(towerCraneLiftData.judgeOutputVoltageIsWaring(), imageOutputVoltage, textOutputVoltage);
        updateImageWaringInfo(towerCraneLiftData.judgeOutputElectricityIsWaring(), imageOutputElectricity, textOutputElectricity);
        updateImageWaringInfo(towerCraneLiftData.judgeRunFrequencyIsWaring(), imageRunFrequency, textRunFrequency);
        updateImageWaringInfo(towerCraneLiftData.judgeTurnSpeedIsWaring(), imageTurnSpeed, textTurnSpeed);
        updateImageWaringInfo(towerCraneLiftData.judgeTemperatureIsWaring(), imageTemperature, textTemperature);

        textStatus.setText(towerCraneLiftData.getStatusStr());
        textBrakeCheck.setText(towerCraneLiftData.getBrakeCheckStr());
        textGeneratrix.setText(towerCraneLiftData.getGeneratrixVoltageStr());
        textOutputVoltage.setText(towerCraneLiftData.getOutputVoltageStr());
        textOutputElectricity.setText(towerCraneLiftData.getOutputElectricityStr());
        textRunFrequency.setText(towerCraneLiftData.getRunFrequencyStr());
        textTurnSpeed.setText(towerCraneLiftData.getTurnSpeedStr());
        textTemperature.setText(towerCraneLiftData.getTemperatureStr());

        updateTextWaringInfo(towerCraneLiftData.judgeUpSlowDownIsWaring(), textUpSlowDown);
        updateTextWaringInfo(towerCraneLiftData.judgeDownSlowDownIsWaring(), textDownSlowDown);
        updateTextWaringInfo(towerCraneLiftData.judgeUpDestinationIsWaring(), textUpDestination);
        updateTextWaringInfo(towerCraneLiftData.judgeDownDestinationIsWaring(), textDownDestination);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_100(), textLoad100);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_90(), textLoad90);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_50(), textLoad50);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_25(), textLoad25);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeUnitIsWaring(), textBrakeUnit);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeIsWaring(), textBrake);
        updateTextWaringInfo(towerCraneLiftData.judgeRunSlowDownIsWaring(), textRunSlowDown);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeOpenIsWaring(), textBrakeOpen);
        updateTextWaringInfo(towerCraneLiftData.judgeLimitSwitchIsWaring(), textLimitSwitch);

        if (towerCraneLiftData.judgeCommunicationIsWaring()) {
            textUpDownCommunicationStatus.setVisibility(View.VISIBLE);
        } else {
            textUpDownCommunicationStatus.setVisibility(View.GONE);
        }
    }

    @Override
    public void onClick(View view) {

    }
}
