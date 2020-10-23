package com.liaojh.towercrane.UI;

import android.view.View;
import android.widget.LinearLayout;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UINotice implements InterfaceDialog {
    private LinearLayout layoutNotice;
    private MainActivity m_activity;

    @Override
    public void show() {
        layoutNotice.setVisibility(View.VISIBLE);
    }

    @Override
    public void hide() {
        layoutNotice.setVisibility(View.GONE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        m_activity = activityIn;

        layoutNotice = m_activity.findViewById(R.id.layout_notice);
        layoutNotice.setOnClickListener(this);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_notice:
                hide();
                break;
        }
    }
}
