package com.liaojh.towercrane.Data;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;

import com.liaojh.towercrane.Activity.BaseActivity;

//定标数据
public class CalibrationData {
    private String m_key_demarcate_1;//标定值1 表示实际值 - x
    private String m_key_demarcate_2;//标定值2 表示实际值 - x
    private String m_key_measure_1;//当值1 表示测量值 - y
    private String m_key_measure_2;//当值2 表示测量值 - y
    private String m_key_low_warn;//低预警值
    private String m_key_low_error;//低报警值
    private String m_key_high_warn;//高预警值
    private String m_key_high_error;//高报警值
    private String m_key_low_error_work;//低预警值控制
    private String m_key_high_error_work;//高预警值控制

    private float demarcate_1;//标定值1 表示实际值 - y
    private float demarcate_2;//标定值2 表示实际值 - y
    private float measure_1;//当值1 表示测量值 - x
    private float measure_2;//当值2 表示测量值 - x
    private float low_warn;//低预警值
    private float low_error;//低报警值
    private float high_warn;//高预警值
    private float high_error;//高报警值
    private Boolean low_error_work;//低预警值控制
    private Boolean high_error_work;//高预警值控制

    private SharedPreferences sp;
    private SharedPreferences.Editor spEditor;

    private float mathA; //函数 y = ax + b
    private float mathB; //函数 y = ax + b

    @SuppressLint("CommitPrefEdits")
    public CalibrationData(String key_demarcate_1, String key_demarcate_2, String key_measure_1, String key_measure_2,
                           String key_low_warn, String key_low_error, String key_high_warn, String key_high_error,
                           String key_low_error_work, String key_high_error_work,
                           BaseActivity activity) {
        m_key_demarcate_1 = key_demarcate_1;
        m_key_demarcate_2 = key_demarcate_2;
        m_key_measure_1 = key_measure_1;
        m_key_measure_2 = key_measure_2;
        m_key_low_warn = key_low_warn;
        m_key_low_error = key_low_error;
        m_key_high_warn = key_high_warn;
        m_key_high_error = key_high_error;
        m_key_low_error_work = key_low_error_work;
        m_key_high_error_work = key_high_error_work;

        sp = activity.getSharedPreferences("Data", Activity.MODE_PRIVATE);
        spEditor = sp.edit();
        demarcate_1 = sp.getFloat(m_key_demarcate_1, 5);
        demarcate_2 = sp.getFloat(m_key_demarcate_2, 100);
        measure_1 = sp.getFloat(m_key_measure_1, 0);
        measure_2 = sp.getFloat(m_key_measure_2, 5);
        low_warn = sp.getFloat(m_key_low_warn, 0);
        low_error = sp.getFloat(m_key_low_error, 0);
        high_warn = sp.getFloat(m_key_high_warn, 0);
        high_error = sp.getFloat(m_key_high_error, 0);
        low_error_work = sp.getBoolean(m_key_low_error_work, true);
        high_error_work = sp.getBoolean(m_key_high_error_work, true);

        mathAB();
    }

    //计算a和b的值
    private void mathAB() {
        mathA = (demarcate_2 - measure_1) / (measure_2 - measure_1);
        mathB = demarcate_1 - measure_1 * mathA;
    }

    public void SaveDemarcate_1(float value) {
        spEditor.putFloat(m_key_demarcate_1, value);
    }

    public void SaveDemarcate_2(float value) {
        spEditor.putFloat(m_key_demarcate_2, value);
    }

    public void SaveMeasure_1(float value) {
        spEditor.putFloat(m_key_measure_1, value);
    }

    public void SaveMeasure_2(float value) {
        spEditor.putFloat(m_key_measure_2, value);
    }

    public void SaveLowWarn(float value) {
        spEditor.putFloat(m_key_low_warn, value);
    }

    public void SaveLowError(float value) {
        spEditor.putFloat(m_key_low_error, value);
    }

    public void SaveHighWarn(float value) {
        spEditor.putFloat(m_key_high_warn, value);
    }

    public void SaveHighError(float value) {
        spEditor.putFloat(m_key_high_error, value);
    }

    public void SaveLowErrorWork(Boolean value) {
        spEditor.putBoolean(m_key_low_error_work, value);
    }

    public void SaveHighErrorWork(Boolean value) {
        spEditor.putBoolean(m_key_high_error_work, value);
    }

    public float getDemarcateNum(float measure) {
        return measure * mathA + mathB;
    }

    public String getDemarcate_1() {
        return String.format("%.1f", demarcate_1);
    }

    public String getDemarcate_2() {
        return String.format("%.1f", demarcate_2);
    }

    public String getMeasure_1() {
        return String.format("%.1f", measure_1);
    }

    public String getMeasure_2() {
        return String.format("%.1f", measure_2);
    }

    public String getLowWarn() {
        return String.format("%.1f", low_warn);
    }

    public String getLowError() {
        return String.format("%.1f", low_error);
    }

    public String getHighWarn() {
        return String.format("%.1f", high_warn);
    }

    public String getHighError() {
        return String.format("%.1f", high_error);
    }

    public String getLowErrorWorkStr() {
        return low_error_work ? "NC" : "OFF";
    }

    public String getHighErrorWorkStr() {
        return high_error_work ? "NC" : "OFF";
    }
}
