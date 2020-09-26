package com.liaojh.towercrane.Manager;

import android.net.Uri;

import java.util.ArrayList;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.CSVFileTool;
import com.liaojh.towercrane.Tool.Tool;

public class CSVFileManager {
    private ArrayList<TowerCraneRunData> list = new ArrayList<>();

    private Uri m_uri;

    public CSVFileManager() {

    }

    public void setUri(Uri uri) {
        m_uri = uri;
    }

    public void addData(TowerCraneRunData data) {
        list.add(data);
    }

    public void saveData(BaseActivity activity) {
        if (m_uri == null) {
            return;
        }
        saveBaseData(activity);
        list.clear();
    }

    public void saveBaseData(BaseActivity activity) {
        int size = list.size();
        String fileName = Tool.getDayTimeString();
        String baseFileName = "";
        ArrayList<Object> baseDataList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TowerCraneRunData data = list.get(i);
            //基础数据
            baseFileName = fileName + "_基础数据.csv";
            String str = "";
            str = str + Tool.getTimeString() + ",";
            str = str + data.height;
            if (i != size - 1) {
                str = str + "\r\n";
            }
            baseDataList.add(str);
        }
        new CSVFileTool(baseFileName, Constant.CSV_FILE_TYPE.Base, baseDataList, activity, m_uri);
    }
}
