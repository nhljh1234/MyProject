package com.liaojh.towercrane.Data;

import android.annotation.SuppressLint;
import com.liaojh.towercrane.Manager.LocalStorage;

//定标数据
public class CalibrationData {
    private String m_key_demarcate_1;//标定值1 表示实际值 - x
    private String m_key_demarcate_2;//标定值2 表示实际值 - x
    private String m_key_measure_1;//当值1 表示测量值 - y
    private String m_key_measure_2;//当值2 表示测量值 - y
    private String m_key_low_warn;//低预警值
    private String m_key_low_error;//低报警值
    private String m_key_high_warn;//高预警差值
    private String m_key_high_error;//高报警差值
    private String m_key_low_error_work;//低预警值控制
    private String m_key_high_error_work;//高预警值控制

    private float demarcate_1;//标定值1 表示实际值 - y
    private float demarcate_2;//标定值2 表示实际值 - y
    private float measure_1;//当值1 表示测量值 - x
    private float measure_2;//当值2 表示测量值 - x
    private float low_warn;//低预警值
    private float low_error;//低报警值
    private float high_warn;//高预警差值
    private float high_error;//高报警差值
    private int low_error_work;//低预警值控制
    private int high_error_work;//高预警值控制

    private int m_type;

    private float mathA; //函数 y = ax + b
    private float mathB; //函数 y = ax + b

    @SuppressLint("CommitPrefEdits")
    public CalibrationData(String key_demarcate_1, String key_demarcate_2, String key_measure_1, String key_measure_2,
                           String key_low_warn, String key_low_error, String key_high_warn, String key_high_error,
                           String key_low_error_work, String key_high_error_work, int type) {
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

        updateValue();

        m_type = type;

        mathAB();
    }

    public void updateValue() {
        demarcate_1 = LocalStorage.getInstance().getSp().getFloat(m_key_demarcate_1, 5);
        demarcate_2 = LocalStorage.getInstance().getSp().getFloat(m_key_demarcate_2, 100);
        measure_1 = LocalStorage.getInstance().getSp().getFloat(m_key_measure_1, 0);
        measure_2 = LocalStorage.getInstance().getSp().getFloat(m_key_measure_2, 5);
        low_warn = LocalStorage.getInstance().getSp().getFloat(m_key_low_warn, 0);
        low_error = LocalStorage.getInstance().getSp().getFloat(m_key_low_error, 0);
        high_warn = LocalStorage.getInstance().getSp().getFloat(m_key_high_warn, 0);
        high_error = LocalStorage.getInstance().getSp().getFloat(m_key_high_error, 0);
        low_error_work = LocalStorage.getInstance().getSp().getInt(m_key_low_error_work, 0);
        high_error_work = LocalStorage.getInstance().getSp().getInt(m_key_high_error_work, 0);
    }

    //计算a和b的值
    private void mathAB() {
        mathA = (demarcate_2 - measure_1) / (measure_2 - measure_1);
        mathB = demarcate_1 - measure_1 * mathA;
    }

    public int getType() {
        return m_type;
    }

    public Boolean saveDemarcate_1(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_demarcate_1, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveDemarcate_2(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_demarcate_2, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveMeasure_1(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_measure_1, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveMeasure_2(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_measure_2, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLowWarn(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_low_warn, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLowError(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_low_error, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveHighWarn(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_high_warn, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveHighError(float value) {
        LocalStorage.getInstance().getSpe().putFloat(m_key_high_error, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLowErrorWork(int value) {
        LocalStorage.getInstance().getSpe().putInt(m_key_low_error_work, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveHighErrorWork(int value) {
        LocalStorage.getInstance().getSpe().putInt(m_key_high_error_work, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public float getDemarcateNum(float measure) {
        return measure * mathA + mathB;
    }

    public String getDemarcateStr_1() {
        return String.format("%.1f", demarcate_1);
    }

    public String getDemarcateStr_2() {
        return String.format("%.1f", demarcate_2);
    }

    public String getMeasureStr_1() {
        return String.format("%.1f", measure_1);
    }

    public String getMeasureStr_2() {
        return String.format("%.1f", measure_2);
    }

    public String getLowWarnStr() {
        return String.format("%.1f", low_warn);
    }

    public String getLowErrorStr() {
        return String.format("%.1f", low_error);
    }

    public String getHighWarnStr() {
        return String.format("%.1f", high_warn);
    }

    public String getHighErrorStr() {
        return String.format("%.1f", high_error);
    }

    public String getLowErrorControlStr() {
        return Constant.CALIBRATION_CONTROL[low_error_work];
    }

    public String getHighErrorControlStr() {
        return Constant.CALIBRATION_CONTROL[high_error_work];
    }

    public int getLowErrorControl() {
        return low_error_work;
    }

    public int getHighErrorControl() {
        return high_error_work;
    }
}
