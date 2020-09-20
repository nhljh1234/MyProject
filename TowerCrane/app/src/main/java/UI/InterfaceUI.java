package UI;

import android.app.Activity;
import android.os.Message;
import android.view.View;

import Data.TowerCraneRunData;

public interface InterfaceUI extends View.OnClickListener {
    public abstract void onUICreate(Activity activityIn);
    public abstract void onUIStart();
    public abstract void onUIDestroy();
    public abstract void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData);
}
