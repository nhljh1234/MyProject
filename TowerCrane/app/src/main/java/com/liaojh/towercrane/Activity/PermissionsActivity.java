package com.liaojh.towercrane.Activity;

import android.Manifest;
import android.app.Application;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import com.liaojh.towercrane.R;

import android.view.WindowManager;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;

public class PermissionsActivity extends BaseActivity {

    private static final String[] NEEDED_PERMISSIONS = new String[]{
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
    };

    private static final int ACTION_REQUEST_PERMISSIONS = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permissions);

        //去掉头部
        getSupportActionBar().hide();
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        checkPermission();
    }

    @Override
    void afterRequestPermission(int requestCode, boolean isAllGranted) {
        if (!isAllGranted) {
            new AlertDialog.Builder(this)
                    .setTitle(R.string.batch_process_notification)
                    .setMessage(this.getString(R.string.check_permission_fail))
                    .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            System.exit(0);
                        }
                    }).setCancelable(false).create().show();
        } else {
            checkPermissionSuccess();
        }
    }

    private void checkPermissionSuccess() {
        Intent intent = new Intent(PermissionsActivity.this, MainActivity.class);
        startActivity(intent);
    }

    private void checkPermission() {
        if (!checkPermissions(NEEDED_PERMISSIONS)) {
            ActivityCompat.requestPermissions(this, NEEDED_PERMISSIONS, ACTION_REQUEST_PERMISSIONS);
        } else {
            checkPermissionSuccess();
        }
    }
}