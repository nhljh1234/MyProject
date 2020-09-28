package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.os.Message;
import android.view.View;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public interface InterfaceUI extends View.OnClickListener {
    public abstract void onUICreate(BaseActivity activityIn);
    public abstract void onUIStart();
    public abstract void onUIDestroy();
    public abstract void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData);
}
