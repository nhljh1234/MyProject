package com.liaojh.towercrane.Tool;

import android.app.Activity;
import android.app.DirectAction;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.util.ArrayList;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Data.Constant;

import androidx.documentfile.provider.DocumentFile;

public class CSVFileTool {
    private Boolean haveSDCard;

    Constant.CSV_FILE_TYPE m_csvFileType;

    private Activity m_activity;

    public CSVFileTool(String fileName, Constant.CSV_FILE_TYPE csvFileType, ArrayList<Object> dataList, BaseActivity activity, Uri uri) {
        m_csvFileType = csvFileType;
        m_activity = activity;
        haveSDCard = Tool.checkSDCardExist(activity);
        if (!haveSDCard) {
            Log.e(Constant.LogTag, "不存在外置SD卡");
            return;
        }

        DocumentFile documentFile = GetCSVFile(fileName, activity, uri);
        CSVFileInit(documentFile);
        writeMsg(dataList, documentFile);
    }

    private void writeMsg(ArrayList<Object> dataList, DocumentFile file) {
        if (dataList.size() == 0) {
            return;
        }
        String str = "";
        try {
            OutputStream outputStream = m_activity.getContentResolver().openOutputStream(file.getUri());
            if (outputStream != null) {
                for (int i = 0; i < dataList.size(); i++) {
                    str = str + dataList.get(i).toString();
                }
                str = str + "\r\n";
                outputStream.write(str.getBytes());
                outputStream.close();
            }
        } catch (IOException e) {
            Log.e("error", "writeMsg csv文件写入失败 " + e.getMessage());
        }
    }

    private void CSVFileInit(DocumentFile file) {
        try {
            OutputStream outputStream = m_activity.getContentResolver().openOutputStream(file.getUri());
            String str = "";
            if (outputStream != null) {
                if (m_csvFileType == Constant.CSV_FILE_TYPE.Base) {
                    str = "时间,高度\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Static) {
                    str = "时间\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Switch) {
                    str = "时间\r\n";
                } else if (m_csvFileType == Constant.CSV_FILE_TYPE.Loop) {
                    str = "时间\r\n";
                }
                outputStream.write(str.getBytes());
                outputStream.close();
            }
        } catch (IOException e) {
            Log.e("error", "CSVFileInit csv文件写入失败 " + e.getMessage());
        }
    }

    private DocumentFile GetCSVFile(String fileName, BaseActivity activity, Uri uri) {
        String dirPath = Tool.getStoragePath(activity);
        DocumentFile documentFileRoot = DocumentFile.fromTreeUri(activity, uri);
        DocumentFile documentFileDir = documentFileRoot.findFile("tower_crane_csv");
        DocumentFile documentFileFile;
        if (documentFileDir == null || !documentFileDir.exists()) {
            documentFileDir = documentFileRoot.createDirectory("tower_crane_csv");
        }
        documentFileFile = documentFileDir.findFile(fileName);
        if (documentFileFile == null || !documentFileFile.exists()) {
            documentFileFile = documentFileDir.createFile("application/csv", fileName);
        }
        return documentFileFile;
    }
}
