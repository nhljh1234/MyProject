package com.liaojh.towercrane.Data;

import com.liaojh.towercrane.Manager.LocalStorage;

public class OutputControlData {
    private String save_key_load_25 = "save_key_load_25";
    private String save_key_load_50 = "save_key_load_50";
    private String save_key_load_90 = "save_key_load_90";
    private String save_key_load_100 = "save_key_load_100";

    private String save_key_torque_80 = "save_key_torque_80";
    private String save_key_torque_90 = "save_key_torque_90";
    private String save_key_torque_100 = "save_key_torque_100";
    private String save_key_torque_110 = "save_key_torque_110";

    private int load_25, load_50, load_90, load_100, torque_80, torque_90, torque_100, torque_110;

    public OutputControlData() {
        readLocalData();
    }

    public void readLocalData() {
        load_25 = LocalStorage.getInstance().getSp().getInt(save_key_load_25, 0);
        load_50 = LocalStorage.getInstance().getSp().getInt(save_key_load_50, 0);
        load_90 = LocalStorage.getInstance().getSp().getInt(save_key_load_90, 0);
        load_100 = LocalStorage.getInstance().getSp().getInt(save_key_load_100, 0);

        torque_80 = LocalStorage.getInstance().getSp().getInt(save_key_torque_80, 0);
        torque_90 = LocalStorage.getInstance().getSp().getInt(save_key_torque_90, 0);
        torque_100 = LocalStorage.getInstance().getSp().getInt(save_key_torque_100, 0);
        torque_110 = LocalStorage.getInstance().getSp().getInt(save_key_torque_110, 0);
    }

    public Boolean saveLoad_25(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_load_25, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLoad_50(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_load_50, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLoad_90(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_load_90, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveLoad_100(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_load_100, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTorque_80(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_torque_80, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTorque_90(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_torque_90, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTorque_100(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_torque_100, value);
        return LocalStorage.getInstance().getSpe().commit();
    }

    public Boolean saveTorque_110(int value) {
        LocalStorage.getInstance().getSpe().putInt(save_key_torque_110, value);
        return LocalStorage.getInstance().getSpe().commit();
    }


    public String getLoadStr_25() {
        return Constant.OUTPUT_CONTROL[load_25];
    }

    public String getLoadStr_50() {
        return Constant.OUTPUT_CONTROL[load_50];
    }

    public String getLoadStr_90() {
        return Constant.OUTPUT_CONTROL[load_90];
    }

    public String getLoadStr_100() {
        return Constant.OUTPUT_CONTROL[load_100];
    }

    public String getTorqueStr_80() {
        return Constant.OUTPUT_CONTROL[torque_80];
    }

    public String getTorqueStr_90() {
        return Constant.OUTPUT_CONTROL[torque_90];
    }

    public String getTorqueStr_100() {
        return Constant.OUTPUT_CONTROL[torque_100];
    }

    public String getTorqueStr_110() {
        return Constant.OUTPUT_CONTROL[torque_110];
    }


    public int getLoad_25() {
        return load_25;
    }

    public int getLoad_50() {
        return load_50;
    }

    public int getLoad_90() {
        return load_90;
    }

    public int getLoad_100() {
        return load_100;
    }

    public int getTorque_80() {
        return torque_80;
    }

    public int getTorque_90() {
        return torque_90;
    }

    public int getTorque_100() {
        return torque_100;
    }

    public int getTorque_110() {
        return torque_110;
    }
}
