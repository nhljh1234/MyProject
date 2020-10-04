package com.liaojh.towercrane.Manager;

import java.util.ArrayList;
import com.liaojh.towercrane.Data.CSVFile;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

public class CSVFileManager {
    private ArrayList<TowerCraneRunData> list = new ArrayList<>();

    public CSVFileManager() {

    }

    public void addData(TowerCraneRunData data) {
        list.add(data);
    }

    public void saveData() {
        if (Constant.usbManager.getUsbRootFolder() == null) {
            return;
        }
        saveBaseData();
        list.clear();
    }

    public void saveBaseData() {
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
            str = str + data.getHeightStr();
            if (i != size - 1) {
                str = str + "\r\n";
            }
            baseDataList.add(str);
        }
        new CSVFile(baseFileName, Constant.CSV_FILE_TYPE.Base).write(baseDataList);
    }
}
