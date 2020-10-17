package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.LocalStorage;
import com.liaojh.towercrane.SerialPort.SerialUtil;

//塔吊自身数据
public class TowerCraneData {
    private static TowerCraneData instance;

    //规格
    public String specifications = "QTZ6012";
    //监控编号
    public String monitorNumber = "TT0020836";
    //应用版本，这个是写死的
    public int version = Constant.Version;
    //编号
    public String towerNumber = "0001";
    //后臂长
    public float backArmLength = 10;
    //大臂长
    public float bigArmLength = 55;
    //塔高
    public float towerHeight = 80;
    //坐标X
    public float posX = 0;
    //坐标Y
    public float posY = 0;
    //倍率
    public float magnification = 2;
    //音量
    public float volume = 30;
    //人脸检测间隔，单位为秒
    public int checkFaceInterval = 60 * 60;
    //数据上传间隔，单位为秒
    public int uploadInterval = 20;
    //串口数据读取间隔，单位为秒
    public int readDataInterval = 1;
    //csv数据写入间隔，单位为秒
    public int csvSaveInterval = 10;
    //心跳数据上传间隔
    public int heartInterval = 60;

    private String SAVE_KEY_TOWER_CRANE_DATA_SPECIFICATIONS = "SAVE_KEY_TOWER_CRANE_DATA_SPECIFICATIONS";
    private String SAVE_KEY_TOWER_CRANE_DATA_MONITOR_NUMBER =  "SAVE_KEY_TOWER_CRANE_DATA_MONITOR_NUMBER";
    private String SAVE_KEY_TOWER_CRANE_DATA_TOWER_NUMBER =  "SAVE_KEY_TOWER_CRANE_DATA_NUMBER";
    private String SAVE_KEY_TOWER_CRANE_DATA_BACK_ARM_LENGTH =  "SAVE_KEY_TOWER_CRANE_DATA_BACK_ARM_LENGTH";
    private String SAVE_KEY_TOWER_CRANE_DATA_BIG_ARM_LENGTH =  "SAVE_KEY_TOWER_CRANE_DATA_BIG_ARM_LENGTH";
    private String SAVE_KEY_TOWER_CRANE_DATA_TOWER_HEIGHT = "SAVE_KEY_TOWER_CRANE_DATA_TOWER_HEIGHT";
    private String SAVE_KEY_TOWER_CRANE_DATA_POS_X = "SAVE_KEY_TOWER_CRANE_DATA_POS_X";
    private String SAVE_KEY_TOWER_CRANE_DATA_POS_Y = "SAVE_KEY_TOWER_CRANE_DATA_POS_Y";
    private String SAVE_KEY_TOWER_CRANE_DATA_MAGNIFICATION = "SAVE_KEY_TOWER_CRANE_DATA_MAGNIFICATION";
    private String SAVE_KEY_TOWER_CRANE_DATA_VOLUME = "SAVE_KEY_TOWER_CRANE_DATA_VOLUME";
    private String SAVE_KEY_TOWER_CRANE_DATA_FACE_CHECK_INTERVAL = "SAVE_KEY_TOWER_CRANE_DATA_FACE_CHECK_INTERVAL";
    private String SAVE_KEY_TOWER_CRANE_DATA_UPLOAD_INTERVAL = "SAVE_KEY_TOWER_CRANE_DATA_UPLOAD_INTERVAL";
    private String SAVE_KEY_TOWER_CRANE_DATA_READ_DATA_INTERVAL = "SAVE_KEY_TOWER_CRANE_DATA_READ_DATA_INTERVAL";
    private String SAVE_KEY_TOWER_CRANE_DATA_CSV_SAVE_INTERVAL = "SAVE_KEY_TOWER_CRANE_DATA_CSV_SAVE_INTERVAL";
    private String SAVE_KEY_TOWER_CRANE_DATA_HEART_INTERVAL = "SAVE_KEY_TOWER_CRANE_DATA_HEART_INTERVAL";

    public TowerCraneData () {
        readLocalData();
    }

    public void readLocalData() {
        specifications = LocalStorage.getInstance().getSp().getString(SAVE_KEY_TOWER_CRANE_DATA_SPECIFICATIONS, "QTZ0001");
        monitorNumber = LocalStorage.getInstance().getSp().getString(SAVE_KEY_TOWER_CRANE_DATA_MONITOR_NUMBER, "TT0020836");
        towerNumber = LocalStorage.getInstance().getSp().getString(SAVE_KEY_TOWER_CRANE_DATA_TOWER_NUMBER, "0001");
        backArmLength = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_BACK_ARM_LENGTH, 10);
        bigArmLength = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_BIG_ARM_LENGTH, 55);
        towerHeight = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_TOWER_HEIGHT, 80);
        posX = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_POS_X, 0);
        posY = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_POS_Y, 0);
        magnification = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_MAGNIFICATION, 2);
        volume = LocalStorage.getInstance().getSp().getFloat(SAVE_KEY_TOWER_CRANE_DATA_VOLUME, 30);
        checkFaceInterval = LocalStorage.getInstance().getSp().getInt(SAVE_KEY_TOWER_CRANE_DATA_FACE_CHECK_INTERVAL, 60) * 60;
        uploadInterval = LocalStorage.getInstance().getSp().getInt(SAVE_KEY_TOWER_CRANE_DATA_UPLOAD_INTERVAL, 20);
        readDataInterval = LocalStorage.getInstance().getSp().getInt(SAVE_KEY_TOWER_CRANE_DATA_READ_DATA_INTERVAL, 1);
        csvSaveInterval = LocalStorage.getInstance().getSp().getInt(SAVE_KEY_TOWER_CRANE_DATA_CSV_SAVE_INTERVAL, 10);
        heartInterval = LocalStorage.getInstance().getSp().getInt(SAVE_KEY_TOWER_CRANE_DATA_HEART_INTERVAL, 60);
    }

    public Boolean saveSpecifications(String specifications) {
        LocalStorage.getInstance().getSpe().putString(SAVE_KEY_TOWER_CRANE_DATA_SPECIFICATIONS, specifications);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveMonitorNumber(String monitorNumber) {
        LocalStorage.getInstance().getSpe().putString(SAVE_KEY_TOWER_CRANE_DATA_MONITOR_NUMBER, monitorNumber);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTowerNumber(String towerNumber) {
        LocalStorage.getInstance().getSpe().putString(SAVE_KEY_TOWER_CRANE_DATA_TOWER_NUMBER, towerNumber);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveBackArmLength(float backArmLength) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_BACK_ARM_LENGTH, backArmLength);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveBigArmLength(float bigArmLength) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_BIG_ARM_LENGTH, bigArmLength);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTowerHeight(float towerHeight) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_TOWER_HEIGHT, towerHeight);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean savePosX(float posX) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_POS_X, posX);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean savePosY(float posY) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_POS_Y, posY);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveMagnification(float magnification) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_MAGNIFICATION, magnification);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveVolume(float volume) {
        LocalStorage.getInstance().getSpe().putFloat(SAVE_KEY_TOWER_CRANE_DATA_VOLUME, volume);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveCheckFaceInterval(int checkFaceInterval) {
        checkFaceInterval = Math.max(checkFaceInterval, 60);
        LocalStorage.getInstance().getSpe().putInt(SAVE_KEY_TOWER_CRANE_DATA_FACE_CHECK_INTERVAL, checkFaceInterval);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveUploadInterval(int uploadInterval) {
        uploadInterval = Math.max(uploadInterval, 20);
        LocalStorage.getInstance().getSpe().putInt(SAVE_KEY_TOWER_CRANE_DATA_UPLOAD_INTERVAL, uploadInterval);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveReadDataInterval(int readDataInterval) {
        readDataInterval = Math.max(readDataInterval, 1);
        LocalStorage.getInstance().getSpe().putInt(SAVE_KEY_TOWER_CRANE_DATA_READ_DATA_INTERVAL, readDataInterval);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveCsvSaveInterval(int csvSaveInterval) {
        csvSaveInterval = Math.max(csvSaveInterval, 10);
        LocalStorage.getInstance().getSpe().putInt(SAVE_KEY_TOWER_CRANE_DATA_CSV_SAVE_INTERVAL, csvSaveInterval);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveHeartInterval(int heartInterval) {
        heartInterval = Math.max(heartInterval, 60);
        LocalStorage.getInstance().getSpe().putInt(SAVE_KEY_TOWER_CRANE_DATA_HEART_INTERVAL, heartInterval);
        return LocalStorage.getInstance().getSpe().commit();
    }


    public String getSpecificationsStr() {
        return specifications;
    }

    public String getMonitorNumberStr() {
        return monitorNumber;
    }

    public String getTowerNumberStr() {
        return towerNumber;
    }

    public String getBackArmLengthStr() {
        return String.format("%.1f", backArmLength);
    }

    public String getBigArmLengthStr() {
        return String.format("%.1f", bigArmLength);
    }

    public String getTowerHeightStr() {
        return String.format("%.1f", towerHeight);
    }

    public String getPosXStr() {
        return String.format("%.1f", posX);
    }

    public String getPosYStr() {
        return String.format("%.1f", posY);
    }

    public String getMagnificationStr() {
        return String.format("%.1f", magnification);
    }

    public String getVolumeStr() {
        return String.format("%.1f", volume);
    }

    public String getCheckFaceIntervalStr() {
        return String.format("%d", checkFaceInterval);
    }

    public String getUploadIntervalStr() {
        return String.format("%d", uploadInterval);
    }

    public String getReadDataIntervalStr() {
        return String.format("%d", readDataInterval);
    }

    public String getCsvSaveIntervalStr() {
        return String.format("%d", csvSaveInterval);
    }

    public String getHeartIntervalStr() {
        return String.format("%d", heartInterval);
    }
}
