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
import com.liaojh.towercrane.Data.TowerCraneTurnAroundData;

public class UITurnAroundRunInfo implements InterfaceUI {
    private Activity activity;

    private ImageView imageStatus, imageGeneratrix, imageOutputVoltage, imageOutputElectricity, imageRunFrequency, imageTurnSpeed,
            imageTemperature;

    private TextView textStatus, textGeneratrix, textOutputVoltage, textOutputElectricity, textRunFrequency, textTurnSpeed,
            textTemperature;

    private TextView textLeftDestination, textRightDestination, textBrakeUnit, textRunSlowDown;

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
    public void onUICreate(MainActivity activityIn) {
        activity = activityIn;

        imageStatus = activity.findViewById(R.id.image_turn_around_status);
        imageGeneratrix = activity.findViewById(R.id.image_turn_around_generatrix);
        imageOutputVoltage = activity.findViewById(R.id.image_turn_around_output_voltage);
        imageOutputElectricity = activity.findViewById(R.id.image_turn_around_output_electricity);
        imageRunFrequency = activity.findViewById(R.id.image_turn_around_run_frequency);
        imageTurnSpeed = activity.findViewById(R.id.image_turn_around_turn_speed);
        imageTemperature = activity.findViewById(R.id.image_turn_around_temperature);

        textStatus = activity.findViewById(R.id.text_turn_around_status);
        textGeneratrix = activity.findViewById(R.id.text_turn_around_generatrix);
        textOutputVoltage = activity.findViewById(R.id.text_turn_around_output_voltage);
        textOutputElectricity = activity.findViewById(R.id.text_turn_around_output_electricity);
        textRunFrequency = activity.findViewById(R.id.text_turn_around_run_frequency);
        textTurnSpeed = activity.findViewById(R.id.text_turn_around_turn_speed);
        textTemperature = activity.findViewById(R.id.text_turn_around_temperature);

        textLeftDestination = activity.findViewById(R.id.text_turn_around_left_destination);
        textRightDestination = activity.findViewById(R.id.text_turn_around_right_destination);
        textBrakeUnit = activity.findViewById(R.id.text_turn_around_brake_unit);
        textRunSlowDown = activity.findViewById(R.id.text_turn_around_run_slow_down);

        textUpDownCommunicationStatus = activity.findViewById(R.id.text_turn_around_waring);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {
        TowerCraneTurnAroundData towerCraneTurnAroundData = towerCraneRunData.towerCraneTurnAroundData;

        updateImageWaringInfo(towerCraneTurnAroundData.judgeStatusIsWaring(), imageStatus, textStatus);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeGeneratrixVoltageIsWaring(), imageGeneratrix, textGeneratrix);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeOutputVoltageIsWaring(), imageOutputVoltage, textOutputVoltage);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeOutputElectricityIsWaring(), imageOutputElectricity, textOutputElectricity);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeRunFrequencyIsWaring(), imageRunFrequency, textRunFrequency);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeTurnSpeedIsWaring(), imageTurnSpeed, textTurnSpeed);
        updateImageWaringInfo(towerCraneTurnAroundData.judgeTemperatureIsWaring(), imageTemperature, textTemperature);

        textStatus.setText(towerCraneTurnAroundData.getStatusStr());
        textGeneratrix.setText(towerCraneTurnAroundData.getGeneratrixVoltageStr());
        textOutputVoltage.setText(towerCraneTurnAroundData.getOutputVoltageStr());
        textOutputElectricity.setText(towerCraneTurnAroundData.getOutputElectricityStr());
        textRunFrequency.setText(towerCraneTurnAroundData.getRunFrequencyStr());
        textTurnSpeed.setText(towerCraneTurnAroundData.getTurnSpeedStr());
        textTemperature.setText(towerCraneTurnAroundData.getTemperatureStr());

        updateTextWaringInfo(towerCraneTurnAroundData.judgeLeftDestinationIsWaring(), textLeftDestination);
        updateTextWaringInfo(towerCraneTurnAroundData.judgeRightDestinationIsWaring(), textRightDestination);
        updateTextWaringInfo(towerCraneTurnAroundData.judgeBrakeUnitIsWaring(), textBrakeUnit);
        updateTextWaringInfo(towerCraneTurnAroundData.judgeRunSlowDownIsWaring(), textRunSlowDown);

        if (towerCraneTurnAroundData.judgeCommunicationIsWaring()) {
            textUpDownCommunicationStatus.setVisibility(View.VISIBLE);
        } else {
            textUpDownCommunicationStatus.setVisibility(View.INVISIBLE);
        }
    }

    @Override
    public void onClick(View view) {

    }
}
