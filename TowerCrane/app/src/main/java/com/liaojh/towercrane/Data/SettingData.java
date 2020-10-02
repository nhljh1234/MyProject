package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Activity.BaseActivity;

public class SettingData {
    private String m_base_key_demarcate_1 = "KEY_DEMARCATE_1_";//标定值1 表示实际值 - x
    private String m_base_key_demarcate_2 = "KEY_DEMARCATE_2_";//标定值2 表示实际值 - x
    private String m_base_key_measure_1 = "KEY_MEASURE_1_";//当值1 表示测量值 - y
    private String m_base_key_measure_2 = "KEY_MEASURE_2_";//当值2 表示测量值 - y
    private String m_base_key_low_warn = "KEY_LOW_WARN_";//低预警值
    private String m_base_key_low_error = "KEY_LOW_ERROR_";//低报警值
    private String m_base_key_high_warn = "KEY_HIGH_WARN_";//高预警差值
    private String m_base_key_high_error = "KEY_HIGH_ERROR_";//高报警差值
    private String m_base_key_low_error_work = "KEY_LOW_ERROR_WORK_";//低预警值控制
    private String m_base_key_high_error_work = "KEY_HIGH_ERROR_WORK_";//高预警值控制

    private String key_weight = "WEIGHT"; //载重
    private String key_wind = "WIND"; //风力
    private String key_amplitude = "AMPLITUDE"; //幅度
    private String key_turnAround = "TURN_AROUND"; //回转
    private String key_height = "HEIGHT"; //高度

    public CalibrationData weight;
    public CalibrationData wind;
    public CalibrationData amplitude;
    public CalibrationData turnAround;
    public CalibrationData height;

    public SettingData() {

    }

    public void init() {
        weight = buildData(key_weight, Constant.CALIBRATION_TYPE.Weight);
        wind = buildData(key_wind, Constant.CALIBRATION_TYPE.Wind);
        amplitude = buildData(key_amplitude, Constant.CALIBRATION_TYPE.Amplitude);
        turnAround = buildData(key_turnAround, Constant.CALIBRATION_TYPE.TurnAround);
        height = buildData(key_height, Constant.CALIBRATION_TYPE.Height);
    }

    private CalibrationData buildData(String key, Constant.CALIBRATION_TYPE type) {
        return new CalibrationData(
                m_base_key_demarcate_1 + key,
                m_base_key_demarcate_2 + key,
                m_base_key_measure_1 + key,
                m_base_key_measure_2 + key,
                m_base_key_low_warn + key,
                m_base_key_low_error + key,
                m_base_key_high_warn + key,
                m_base_key_high_error + key,
                m_base_key_low_error_work + key,
                m_base_key_high_error_work + key,
                type
        );
    }
}
