package com.example.unityandroidlibrary;

import com.unity3d.player.UnityPlayer;

public class UnityCallback {
    //回调的挂件名字
    private static String OBJECT_NAME = "Android";
    //回调Unity
    //每个场景需要挂一个Android物体，上面挂回调脚本
    public static void callUnity(String funcName, String value) {
        UnityPlayer.UnitySendMessage(OBJECT_NAME, funcName, value);
    }
}
