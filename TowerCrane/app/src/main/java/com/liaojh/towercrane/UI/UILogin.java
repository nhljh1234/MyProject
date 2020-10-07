package com.liaojh.towercrane.UI;

import android.app.Instrumentation;
import android.content.Context;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UILogin implements InterfaceDialog {

    private EditText editPassword;
    private Button btnSure, btnBack;
    private LinearLayout layoutLogin;

    private MainActivity m_activity;

    public void show() {
        layoutLogin.setVisibility(View.VISIBLE);
        editPassword.setText("");
    }

    public void hide() {
        layoutLogin.setVisibility(View.GONE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        editPassword = activityIn.findViewById(R.id.edit_password);

        btnSure = activityIn.findViewById(R.id.btn_login_sure);
        btnBack = activityIn.findViewById(R.id.btn_login_back);

        layoutLogin = activityIn.findViewById(R.id.layout_login);
        layoutLogin.setOnClickListener(this);

        btnSure.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        m_activity = activityIn;
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
            case R.id.btn_login_sure:
                if (editPassword.getText().toString().equals(Constant.Password)) {
                    hide();
                    m_activity.uiSetting.showSetting(Constant.SETTING_TYPE.Normal);
                } else if (editPassword.getText().toString().equals(Constant.SuperPassword)) {
                    hide();
                    m_activity.uiSetting.showSetting(Constant.SETTING_TYPE.Super);
                } else {
                    m_activity.showToast(m_activity.getResources().getString(R.string.login_error));
                }
                break;
            case R.id.btn_login_back:
                hide();
                break;
            case R.id.layout_login:
                InputMethodManager inputManger = (InputMethodManager) m_activity.getSystemService(Context.INPUT_METHOD_SERVICE);
                inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
                inputManger.hideSoftInputFromWindow(view.getWindowToken(), 0);
                break;
        }
    }
}
