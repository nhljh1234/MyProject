package com.liaojh.towercrane.UI;
import android.view.View;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public interface InterfaceUI extends View.OnClickListener {
    public abstract void onUICreate(MainActivity activityIn);
    public abstract void onUIStart();
    public abstract void onUIDestroy();
    public abstract void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData);
}
