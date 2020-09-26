package UI;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.arcsoft.arcfacedemo.faceserver.FaceServer;
import com.liaojh.towercrane.CheckActivity;
import com.liaojh.towercrane.MainActivity;
import com.liaojh.towercrane.R;
import com.liaojh.towercrane.RegisterActivity;

import java.util.Timer;
import java.util.TimerTask;

import Data.AppGlobalData;
import Data.TowerCraneRunData;
import Tool.TimeTool;
import androidx.appcompat.app.AlertDialog;

public class UITopBar implements InterfaceUI {
    private Activity activity;

    TextView textTimeInfo, textSignalStatus;
    LinearLayout layoutSetting, layoutOutputControl, layoutNotice;
    ImageView imageSignal;

    @SuppressLint("HandlerLeak")
    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            if (msg.obj == AppGlobalData.Handler_Type.UpdateTimeInfo) {
                //获取时间
                String timeString = String.format("%s %s", TimeTool.getTimeString(), TimeTool.getDayString());
                textTimeInfo.setText(timeString);

                //更新网络
                Boolean haveSignal = judgeHaveSignal();
                if (haveSignal) {
                    imageSignal.setImageDrawable(activity.getDrawable(R.drawable.network));
                    textSignalStatus.setText(activity.getString(R.string.text_signal_normal));
                } else {
                    imageSignal.setImageDrawable(activity.getDrawable(R.drawable.network_unavailable));
                    textSignalStatus.setText(activity.getString(R.string.text_signal_error));
                }
            }
            super.handleMessage(msg);
        }
    };

    //更新主界面时间
    private Timer timerUpdateTimeAndSignal = new Timer();
    private TimerTask timerTaskUpdateTimeAndSignal = new TimerTask() {
        @Override
        public void run() {
            Message message = new Message();
            message.obj = AppGlobalData.Handler_Type.UpdateTimeInfo;
            handler.sendMessage(message);
        }
    };

    private Boolean judgeHaveSignal() {
        ConnectivityManager connectivityManager = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isAvailable()) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {

    }

    @Override
    public void onUICreate(Activity activityIn) {
        activity = activityIn;

        textTimeInfo = (TextView) activity.findViewById(R.id.text_time);
        textSignalStatus = (TextView) activity.findViewById(R.id.text_signal_status);

        layoutSetting = (LinearLayout) activity.findViewById(R.id.layout_setting);
        layoutOutputControl = (LinearLayout) activity.findViewById(R.id.layout_output_control);
        layoutNotice = (LinearLayout) activity.findViewById(R.id.layout_notice);

        imageSignal = (ImageView) activity.findViewById(R.id.img_signal);

        layoutSetting.setOnClickListener(this);
        layoutOutputControl.setOnClickListener(this);
        layoutNotice.setOnClickListener(this);
    }

    @Override
    public void onUIStart() {
        //开启时间信息更新定时器
        timerUpdateTimeAndSignal.schedule(timerTaskUpdateTimeAndSignal, 0, AppGlobalData.SIGNAL_DATA_UPDATE_INTERVAL);
    }

    @Override
    public void onUIDestroy() {
        if (timerUpdateTimeAndSignal != null) {// 停止timer
            timerUpdateTimeAndSignal.cancel();
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.layout_setting:
                int faceNum = FaceServer.getInstance().getFaceNumber(activity);
                AlertDialog dialog = new AlertDialog.Builder(activity)
                        .setTitle(R.string.batch_process_notification)
                        .setMessage(activity.getString(R.string.batch_process_confirm_delete, faceNum))
                        .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                FaceServer.getInstance().clearAllFaces(activity);
                                Toast.makeText(activity, "清除完毕", Toast.LENGTH_SHORT).show();
                            }
                        })
                        .setNegativeButton(R.string.cancel, null)
                        .create();
                dialog.show();
                //activity.startActivity(new Intent(activity, RegisterActivity.class));
                break;
            case R.id.layout_output_control:
                activity.startActivity(new Intent(activity, CheckActivity.class));
                break;
            case R.id.layout_notice:
                activity.startActivity(new Intent(activity, RegisterActivity.class));
                break;
        }
    }
}
