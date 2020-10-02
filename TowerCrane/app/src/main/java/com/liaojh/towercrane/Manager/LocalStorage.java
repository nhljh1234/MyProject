package com.liaojh.towercrane.Manager;

import android.app.Activity;
import android.content.SharedPreferences;

import com.liaojh.towercrane.Activity.MainActivity;

public class LocalStorage {
    public SharedPreferences m_sp;
    public SharedPreferences.Editor m_spe;
    public MainActivity m_activity;

    public LocalStorage(MainActivity activity) {
        m_activity = activity;
        m_sp = m_activity.getSharedPreferences("Data", Activity.MODE_PRIVATE);
        m_spe = m_sp.edit();
    }
}
