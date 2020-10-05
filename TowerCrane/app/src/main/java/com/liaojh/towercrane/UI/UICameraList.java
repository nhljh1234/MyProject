package com.liaojh.towercrane.UI;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.VideoData;
import com.liaojh.towercrane.Manager.VideoManager;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

import java.util.ArrayList;

public class UICameraList implements InterfaceDialog {
    private LinearLayout layoutCameraList;

    private ListView listCamera;

    private Button btnAddCamera, btnBack;

    private MainActivity m_activity;

    @Override
    public void show() {
        layoutCameraList.setVisibility(View.VISIBLE);
        updateList();
    }

    @Override
    public void hide() {
        layoutCameraList.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        m_activity = activityIn;

        layoutCameraList = m_activity.findViewById(R.id.layout_camera_list);

        listCamera = m_activity.findViewById(R.id.list_view_camera);

        btnAddCamera = m_activity.findViewById(R.id.btn_camera_list_add);
        btnBack = m_activity.findViewById(R.id.btn_camera_list_back);

        btnAddCamera.setOnClickListener(this);
        btnBack.setOnClickListener(this);
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
            case R.id.btn_camera_list_add:
                m_activity.uiAddCamera.show();
                hide();
                break;
            case R.id.btn_camera_list_back:
                m_activity.uiSetting.show();
                hide();
                break;
        }
    }

    public void updateList() {
        MyAdapter adapter = new MyAdapter(VideoManager.getInstance().getVideoSaveDataList());
        listCamera.setAdapter(adapter);
    }

    private class MyAdapter extends BaseAdapter {

        private ArrayList<Constant.VideoSaveData> m_list;

        public MyAdapter(ArrayList<Constant.VideoSaveData> list) {
            m_list = list;
        }

        public int getCount() {
            // TODO Auto-generated method stub
            return m_list.size();
        }

        public Object getItem(int position) {
            // TODO Auto-generated method stub
            return m_list.get(position);
        }

        public long getItemId(int position) {
            // TODO Auto-generated method stub
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            // TODO Auto-generated method stub
            LayoutInflater inflater = m_activity.getLayoutInflater();
            final View view = inflater.inflate(R.layout.camera_list_item, null);
            final Constant.VideoSaveData videoSaveData = m_list.get(position);
            TextView textPhone = view.findViewById(R.id.text_camera_item_name);
            TextView textName = view.findViewById(R.id.text_camera_item_address);
            Button btnChange = view.findViewById(R.id.btn_item_change);
            Button btnDelete = view.findViewById(R.id.btn_item_delete);

            textPhone.setText(videoSaveData.name);
            textName.setText(Tool.getRtspAddress(videoSaveData));

            btnChange.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    hide();
                    m_activity.uiAddCamera.showChangeVideoSaveData(videoSaveData);
                    updateList();
                }
            });

            btnDelete.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    VideoManager.getInstance().deleteCamera(videoSaveData.ipAddress);
                    updateList();
                }
            });

            return view;
        }

    }
}
