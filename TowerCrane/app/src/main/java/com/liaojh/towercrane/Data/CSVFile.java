package com.liaojh.towercrane.Data;

import android.app.Activity;
import android.app.DirectAction;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.ByteBuffer;
import java.util.ArrayList;

import com.github.mjdev.libaums.fs.UsbFile;
import com.github.mjdev.libaums.fs.UsbFileInputStream;
import com.github.mjdev.libaums.fs.UsbFileOutputStream;
import com.github.mjdev.libaums.fs.UsbFileStreamFactory;
import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Manager.USBManager;

import androidx.documentfile.provider.DocumentFile;

public class CSVFile {
    private Constant.CSV_FILE_TYPE m_csvFileType;
    private UsbFile csvFile;

    public CSVFile(String fileName, Constant.CSV_FILE_TYPE csvFileType) {
        m_csvFileType = csvFileType;

        UsbFile usbFile = USBManager.getInstance().getUsbRootFolder();
        if (usbFile == null) {
            return;
        }

        csvFile = GetCSVFile(usbFile, fileName);
    }

    public Boolean write(ArrayList<Object> dataList) {
        if (dataList.size() == 0 || csvFile == null) {
            Log.e(Constant.LogTag, "write csvFile is null");
            return false;
        }
        try {
            StringBuilder str = new StringBuilder();
            for (int i = 0; i < dataList.size(); i++) {
                str.append(dataList.get(i).toString());
            }
            str.append("\r\n");
            csvFile.write(csvFile.getLength(), ByteBuffer.wrap(str.toString().getBytes()));
            csvFile.flush();
            csvFile.close();
            return true;
        } catch (IOException e) {
            Log.e(Constant.LogTag, "writeMsg csv文件写入失败 " + e.getMessage());
        }
        return false;
    }

    //新建文件的话加一个头数据
    private UsbFile GetCSVFile(UsbFile usbFile, String fileName) {
        try {
            UsbFile csvDir = usbFile.search(Constant.CsvDataDirName);
            if (csvDir == null) {
                csvDir = usbFile.createDirectory(Constant.CsvDataDirName);
            }
            UsbFile csvFile = csvDir.search(fileName);
            if (csvFile == null) {
                csvFile = csvDir.createFile(fileName);
                String str = "";
                if (m_csvFileType == Constant.CSV_FILE_TYPE.Base) {
                    str = "时间,高度\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Static) {
                    str = "时间\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Switch) {
                    str = "时间\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Loop) {
                    str = "时间\r\n";
                }
                csvFile.write(0, ByteBuffer.wrap(str.getBytes()));
                csvFile.flush();
                csvFile.close();
            }
            return csvFile;
        } catch (IOException e) {
            Log.e(Constant.LogTag, "CSVFileInit csv文件写入失败 " + e.getMessage());
        }
        return null;
    }
}
