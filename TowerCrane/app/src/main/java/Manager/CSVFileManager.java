package Manager;

import android.os.Message;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

import Data.AppGlobalData;
import Data.TowerCraneRunData;
import Tool.CSVFileTool;
import Tool.TimeTool;

public class CSVFileManager {
    private ArrayList<TowerCraneRunData> list = new ArrayList<>();

    public CSVFileManager() {

    }

    public void addData(TowerCraneRunData data) {
        list.add(data);
    }

    public void saveData() {
        saveBaseData();
        list.clear();
    }

    public void saveBaseData() {
        int size = list.size();
        String fileName = TimeTool.getDayTimeString();
        String baseFileName = "";
        ArrayList<Object> baseDataList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TowerCraneRunData data = list.get(i);
            //基础数据
            baseFileName = fileName + "_基础数据.csv";
            String str = "";
            str = str + TimeTool.getTimeString() + ",";
            str = str + data.height;
            if (i != size - 1) {
                str = str + "\r\n";
            }
            baseDataList.add(str);
        }
        new CSVFileTool(baseFileName, AppGlobalData.CSV_FILE_TYPE.Base, baseDataList);
    }
}
