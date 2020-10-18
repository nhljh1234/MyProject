package com.liaojh.towercrane.UI;

import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Manager.NetManager;
import com.liaojh.towercrane.Manager.SoundManager;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

import com.yf.rk3399_gpio_jni.yf_gpio_manager;

public class UITopBar implements InterfaceUI {
    private MainActivity m_activity;

    private TextView textTimeInfo, textSignalStatus, textFaceCheck;
    private LinearLayout layoutBtnSetting, layoutBtnOutputControl, layoutBtnNotice, layoutBtnCheckFace;
    private ImageView imageSignal;

    private Boolean haveRealName = false;

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

    public void setRealNameStatus(Boolean status) {
        haveRealName = status;
        if (haveRealName) {
            textFaceCheck.setText(m_activity.getString(R.string.have_real_name));
            textFaceCheck.setTextColor(m_activity.getColor(R.color.color_label_blue));
        } else {
            textFaceCheck.setText(m_activity.getString(R.string.have_not_real_name));
            textFaceCheck.setTextColor(m_activity.getColor(R.color.color_label_red));
        }
    }

    @Override
    public void onUICreate(MainActivity activity) {
        m_activity = activity;

        textTimeInfo = m_activity.findViewById(R.id.text_time);
        textSignalStatus = m_activity.findViewById(R.id.text_signal_status);
        textFaceCheck = m_activity.findViewById(R.id.text_face_check);

        layoutBtnSetting = m_activity.findViewById(R.id.layout_btn_setting);
        layoutBtnOutputControl = m_activity.findViewById(R.id.layout_btn_output_control);
        layoutBtnNotice = m_activity.findViewById(R.id.layout_btn_notice);
        layoutBtnCheckFace = m_activity.findViewById(R.id.layout_btn_face_check);

        imageSignal = m_activity.findViewById(R.id.img_signal);

        layoutBtnSetting.setOnClickListener(this);
        layoutBtnOutputControl.setOnClickListener(this);
        layoutBtnNotice.setOnClickListener(this);
        layoutBtnCheckFace.setOnClickListener(this);

        setRealNameStatus(false);
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
                m_activity.uiSetOutputControl.show();
                break;
            case R.id.layout_btn_notice:
                m_activity.uiNotice.show();
                break;
            case R.id.layout_btn_face_check:
                if (haveRealName == false) {
                    m_activity.uiFaceCheck.show();
                }
                break;
        }
    }
}