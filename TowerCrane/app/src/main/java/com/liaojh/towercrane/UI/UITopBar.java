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
import com.liaojh.towercrane.R;

import java.util.Timer;
import java.util.TimerTask;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

public class UITopBar implements InterfaceUI {
    private MainActivity m_activity;

    TextView textTimeInfo, textSignalStatus;
    LinearLayout layoutBtnSetting, layoutBtnOutputControl, layoutBtnNotice;
    ImageView imageSignal;

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == Constant.Handler_Type.UpdateTimeInfo) {
                //获取时间
                String timeString = String.format("%s %s", Tool.getTimeString(), Tool.getDayString());
                textTimeInfo.setText(timeString);

                //更新网络
                Boolean haveSignal = judgeHaveSignal();
                if (haveSignal) {
                    imageSignal.setImageDrawable(m_activity.getDrawable(R.drawable.network));
                    textSignalStatus.setText(m_activity.getString(R.string.text_signal_normal));
                } else {
                    imageSignal.setImageDrawable(m_activity.getDrawable(R.drawable.network_unavailable));
                    textSignalStatus.setText(m_activity.getString(R.string.text_signal_error));
                }
            }
            super.handleMessage(msg);
        }
    };

    //更新主界面时间
    private Timer timerUpdateTimeAndSignal = new Timer();
    private TimerTask timerTaskUpdateTimeAndSignal = new TimerTask() {
        @Override
        public void run() {
            Message message = new Message();
            message.obj = Constant.Handler_Type.UpdateTimeInfo;
            handler.sendMessage(message);
        }
    };

    private Boolean judgeHaveSignal() {
        ConnectivityManager connectivityManager = (ConnectivityManager) m_activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isAvailable()) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

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
        //开启时间信息更新定时器
        timerUpdateTimeAndSignal.schedule(timerTaskUpdateTimeAndSignal, 0, Constant.SIGNAL_DATA_UPDATE_INTERVAL);
    }

    @Override
    public void onUIStart() {

    }

    @Override
    public void onUIDestroy() {
        if (timerUpdateTimeAndSignal != null) {// 停止timer
            timerUpdateTimeAndSignal.cancel();
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_btn_setting:
                m_activity.uiLogin.show();
                break;
            case R.id.layout_btn_output_control:
                NetManager.getInstance().login();
                break;
            case R.id.layout_btn_notice:
                m_activity.uiFaceCheck.show();
                break;
        }
    }
}
