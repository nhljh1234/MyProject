package com.liaojh.towercrane.Manager;

import android.app.Activity;
import android.content.SharedPreferences;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.SerialPort.SerialUtil;

public class LocalStorage {
    private SharedPreferences m_sp;
    private SharedPreferences.Editor m_spe;
    private MainActivity m_activity;

    private static LocalStorage instance;

    private LocalStorage() {

    }

    public static LocalStorage getInstance() {
        if (instance == null) {
            synchronized (LocalStorage.class) {
                if (instance == null) {
                    instance = new LocalStorage();
                }
            }
        }
        return instance;
    }

    public SharedPreferences getSp() {
        return m_sp;
    }

    public SharedPreferences.Editor getSpe() {
        return m_spe;
    }

    public void init(MainActivity activity) {
        m_activity = activity;
        m_sp = m_activity.getSharedPreferences("Data", Activity.MODE_PRIVATE);
        m_spe = m_sp.edit();
    }
}
