package Tool;

import android.app.Activity;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import Data.AppGlobalData;

import static android.content.Context.MODE_PRIVATE;

public class CSVFileTool {
    private Boolean haveSDCard;

    private String filePath;

    AppGlobalData.CSV_FILE_TYPE csvFileType;

    public CSVFileTool(String fileName, AppGlobalData.CSV_FILE_TYPE csvFileTypeIn, ArrayList<Object> dataList) {
        csvFileType = csvFileTypeIn;

        haveSDCard = Tool.checkSDCardExist();
        if (!haveSDCard) {
            return;
        }

        String dirPath = Environment.getExternalStorageDirectory().getPath() + "/Pictures/data/tower_crane_csv";
        filePath = dirPath + "/" + fileName;
        File dir = new File(dirPath);
        //判断文件夹是否存在
        if (!dir.exists()) {
            dir.mkdirs();
        }
        //判断文件是否存在，不存在要新建一个
        File file = GetCSVFile(filePath);
        if (file == null) {
            return;
        }
        writeMsg(dataList, file);
    }

    private void writeMsg(ArrayList<Object> dataList, File file) {
        if (dataList.size() == 0) {
            return;
        }
        String str = "";
        try {
            FileWriter fw = new FileWriter(file, true);
            if (fw != null) {
                for (int i = 0; i < dataList.size(); i++) {
                    str = str + dataList.get(i).toString();
                }
                str = str + "\r\n";
                fw.write(str);
                fw.close();
            }
        } catch (IOException e) {
            Log.e("error", "writeMsg csv文件写入失败 " + e.getMessage());
        }
    }

    private void CSVFileInit(File file) {
        try {
            FileWriter fw = new FileWriter(file);
            String str = "";
            if (fw != null) {
                if (csvFileType == AppGlobalData.CSV_FILE_TYPE.Base) {
                    str = "时间,高度\r\n";
                } else if (csvFileType == AppGlobalData.CSV_FILE_TYPE.Static) {
                    str = "时间\r\n";
                } else if (csvFileType == AppGlobalData.CSV_FILE_TYPE.Switch) {
                    str = "时间\r\n";
                } else if (csvFileType == AppGlobalData.CSV_FILE_TYPE.Loop) {
                    str = "时间\r\n";
                }
                fw.write(str);
                fw.close();
            }
        } catch (IOException e) {
            Log.e("error", "CSVFileInit csv文件写入失败 " + e.getMessage());
        }
    }

    private File GetCSVFile(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            try {
                file.createNewFile();
                //初始化文件
                CSVFileInit(file);
                return file;
            } catch (IOException e) {
                Log.e("error", "csv文件创建失败 " + e.getMessage());
                return null;
            }
        }
        return file;
    }
}
