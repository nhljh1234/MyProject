package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.media.Image;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Data.TowerCraneLiftData;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UIUpDownRunInfo implements InterfaceUI {
    private Activity activity;

    private TextView textStatusRun, textStatusStop, textGeneratrix, textOutputVoltage, textOutputElectricity, textRunFrequency,
            textTurnSpeed, textTemperature;

    private TextView textUpSlowDown, textDownSlowDown, textUpDestination, textDownDestination, textLoad_100, textLoad_90, textLoad_50,
            textLoad_25, textBrakeUnit, textBrakeLose, textRunSlowDown, textBrakeOpen, textLimitSwitch;

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

        textStatusRun = activity.findViewById(R.id.text_up_down_status_run);
        textStatusStop = activity.findViewById(R.id.text_up_down_status_stop);
        textGeneratrix = activity.findViewById(R.id.text_up_down_generatrix);
        textOutputVoltage = activity.findViewById(R.id.text_up_down_output_voltage);
        textOutputElectricity = activity.findViewById(R.id.text_up_down_output_electricity);
        textRunFrequency = activity.findViewById(R.id.text_up_down_run_frequency);
        textTurnSpeed = activity.findViewById(R.id.text_up_down_turn_speed);
        textTemperature = activity.findViewById(R.id.text_up_down_temperature);

        textUpSlowDown = activity.findViewById(R.id.text_up_down_up_slow_down);
        textDownSlowDown = activity.findViewById(R.id.text_up_down_down_slow_down);
        textUpDestination = activity.findViewById(R.id.text_up_down_up_destination);
        textDownDestination = activity.findViewById(R.id.text_up_down_down_destination);
        textLoad_100 = activity.findViewById(R.id.text_up_down_load_100);
        textLoad_90 = activity.findViewById(R.id.text_up_down_load_90);
        textLoad_50 = activity.findViewById(R.id.text_up_down_load_50);
        textLoad_25 = activity.findViewById(R.id.text_up_down_load_25);
        textBrakeUnit = activity.findViewById(R.id.text_up_down_brake_unit);
        textBrakeLose = activity.findViewById(R.id.text_up_down_brake);
        textRunSlowDown = activity.findViewById(R.id.text_up_down_run_slow_down);
        textBrakeOpen = activity.findViewById(R.id.text_up_down_brake_open);
        textLimitSwitch = activity.findViewById(R.id.text_up_down_limit_switch);

        textUpDownCommunicationStatus = activity.findViewById(R.id.text_up_down_waring);
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

        textStatusRun.setText(towerCraneLiftData.getStatusRunStr());
        textStatusStop.setText(towerCraneLiftData.getStatusStopStr());
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
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_100(), textLoad_100);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_90(), textLoad_90);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_50(), textLoad_50);
        updateTextWaringInfo(towerCraneLiftData.judgeLoadIsWaring_25(), textLoad_25);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeUnitIsWaring(), textBrakeUnit);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeLoseIsWaring(), textBrakeLose);
        updateTextWaringInfo(towerCraneLiftData.judgeRunSlowDownIsWaring(), textRunSlowDown);
        updateTextWaringInfo(towerCraneLiftData.judgeBrakeOpenIsWaring(), textBrakeOpen);
        updateTextWaringInfo(towerCraneLiftData.judgeLimitSwitchIsWaring(), textLimitSwitch);

        textUpDownCommunicationStatus.setText(towerCraneLiftData.getWarnOrErrorStr());
    }

    @Override
    public void onClick(View view) {

    }
}
