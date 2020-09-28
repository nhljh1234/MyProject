package com.liaojh.towercrane.UI;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.R;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;

public class UILogin implements InterfaceUI{

    private EditText editUserName, editPassword;
    private Button btnSure, btnBack;
    private LinearLayout loginLayout;

    private BaseActivity m_activity;

    public void show() {
        loginLayout.setVisibility(View.VISIBLE);
    }

    public void hide() {
        loginLayout.setVisibility(View.GONE);
    }

    @Override
    public void onUICreate(BaseActivity activityIn) {
        editUserName = (EditText) activityIn.findViewById(R.id.edit_user_name);
        editPassword = (EditText) activityIn.findViewById(R.id.edit_password);

        btnSure = (Button) activityIn.findViewById(R.id.btn_login_sure);
        btnBack = (Button) activityIn.findViewById(R.id.btn_login_back);

        loginLayout = (LinearLayout) activityIn.findViewById(R.id.layout_login);

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
                if (editUserName.getText().toString().equals(Constant.userName) && editPassword.getText().toString().equals(Constant.password)) {
                    hide();
                } else {
                    m_activity.showToast(m_activity.getResources().getString(R.string.text_label_login_error));
                }
                break;
            case R.id.btn_login_back:
                hide();
                break;
        }
    }
}
