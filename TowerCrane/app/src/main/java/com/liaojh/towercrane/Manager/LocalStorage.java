package com.liaojh.towercrane.Manager;

import android.content.SharedPreferences;

public class LocalStorage {
    public SharedPreferences m_sp;
    public SharedPreferences.Editor m_spe;

    public LocalStorage(SharedPreferences sp) {
        m_sp = sp;
        m_spe = m_sp.edit();
    }
}
