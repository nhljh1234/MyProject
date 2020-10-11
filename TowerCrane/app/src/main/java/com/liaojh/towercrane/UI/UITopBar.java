package com.liaojh.towercrane.UI;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Manager.NetManager;
import com.liaojh.towercrane.Manager.UpdateManager;
import com.liaojh.towercrane.R;

import java.util.Timer;
import java.util.TimerTask;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;
import com.tencent.bugly.crashreport.CrashReport;

public class UITopBar implements InterfaceUI {
    private MainActivity m_activity;

    TextView textTimeInfo, textSignalStatus;
    LinearLayout layoutBtnSetting, layoutBtnOutputControl, layoutBtnNotice;
    ImageView imageSignal;

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    public void updateInfo() {
        //获取时间
        String timeString = String.format("%s %s", Tool.getTimeString(), Tool.getDayString());
        textTimeInfo.setText(timeString);

        if (NetManager.getInstance().judgeHaveSignal()) {
            imageSignal.setImageDrawable(m_activity.getDrawable(R.drawable.network));
            textSignalStatus.setText(m_activity.getString(R.string.text_signal_normal));
        } else {
            imageSignal.setImageDrawable(m_activity.getDrawable(R.drawable.network_unavailable));
            textSignalStatus.setText(m_activity.getString(R.string.text_signal_error));
        }
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        textTimeInfo = m_activity.findViewById(R.id.text_time);
        textSignalStatus = m_activity.findViewById(R.id.text_signal_status);

        layoutBtnSetting = m_activity.findViewById(R.id.layout_btn_setting);
        layoutBtnOutputControl = m_activity.findViewById(R.id.layout_btn_output_control);
        layoutBtnNotice = m_activity.findViewById(R.id.layout_btn_notice);

        imageSignal = m_activity.findViewById(R.id.img_signal);

        layoutBtnSetting.setOnClickListener(this);
        layoutBtnOutputControl.setOnClickListener(this);
        layoutBtnNotice.setOnClickListener(this);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_btn_setting:
                m_activity.uiLogin.show();
                break;
            case R.id.layout_btn_output_control:
                //UpdateManager.getInstance().onReceiveNewVersion(2, "https://729c93f0b85ca2e0830a29dfc831d189.dlied1.cdntips.net/dlied1.qq.com/qqweb/QQ_1/android_apk/Androidqq_8.4.8.4810_537065343.apk?mkey=5f7d47171b9a3f96&f=0f9e&cip=27.154.25.99&proto=https&access_type=$header_ApolloNet");
                //CrashReport.testJavaCrash();
                break;
            case R.id.layout_btn_notice:
                m_activity.uiFaceCheck.show();
                break;
        }
    }
}
