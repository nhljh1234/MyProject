package com.liaojh.towercrane.Data;

//获取塔吊运行数据的工厂，针对不同的数据接口
public class TowerCraneRunDataFactory {
    public static TowerCraneRunData getRunData() {
        return new TowerCraneRunData();
    }
}
