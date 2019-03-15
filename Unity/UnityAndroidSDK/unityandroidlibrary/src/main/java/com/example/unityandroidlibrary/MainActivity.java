package com.example.unityandroidlibrary;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.app.AlertDialog;
import android.util.Log;

import com.unity3d.player.UnityPlayerActivity;

public class MainActivity extends UnityPlayerActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
    }

    BaseSDK baseSDK = new BaseSDK();

    public String callPlatform(int action, String data) {
        return baseSDK.callPlatform(action, data, this);
    }
}
