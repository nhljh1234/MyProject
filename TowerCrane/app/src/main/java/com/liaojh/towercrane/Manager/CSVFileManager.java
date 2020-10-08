package com.liaojh.towercrane.Manager;

import android.util.Log;

import java.util.ArrayList;
import com.liaojh.towercrane.Data.CSVFile;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.SettingData;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.SerialPort.SerialUtil;
import com.liaojh.towercrane.Tool.Tool;

public class CSVFileManager {
    private ArrayList<TowerCraneRunData> list = new ArrayList<>();
    private static CSVFileManager instance;

    private CSVFileManager() {

    }

    public static CSVFileManager getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new CSVFileManager();
                }
            }
        }
        return instance;
    }

    public void addData(TowerCraneRunData data) {
        list.add(data);
    }

    public void saveData() {
        if (USBManager.getInstance().getUsbRootFolder() == null) {
            Log.e(Constant.LogTag, "usbManager getUsbRootFolder is null");
            return;
        }
        Boolean success = saveBaseData();
        if (success) {
            list.clear();

        }
    }

    public Boolean saveBaseData() {
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
        return new CSVFile(baseFileName, Constant.CSV_TYPE_BASE).write(baseDataList);
    }
}
