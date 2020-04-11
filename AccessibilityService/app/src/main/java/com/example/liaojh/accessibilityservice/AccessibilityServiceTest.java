package com.example.liaojh.accessibilityservice;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

class App {
    public boolean useScroll = false;
    public boolean canScroll = true;
    public String packetName = "";
    public String[] targetUINames = new String[]{};
    public int[] actions = new int[]{};

    private Thread thread = null;

    public boolean equalApp(CharSequence name) {
        return name.equals(packetName);
    }

    public boolean equalNowUI(CharSequence name) {
        for (int i = 0; i < targetUINames.length; i++) {
            if (name.equals(targetUINames[i])) {
                return true;
            }
        }
        return false;
    }

    public int getDelay() {
        Random random = new Random();
        return (random.nextInt(5) + 5) * 1000;
    }

    public void scroll(AccessibilityService serviceIn) {
        if (canScroll == false) {
            return;
        }
        final AccessibilityService service = serviceIn;
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Path path2 = new Path();
                path2.moveTo(100, 1500);
                path2.lineTo(100, 200);
                final GestureDescription.StrokeDescription sd2 = new GestureDescription.StrokeDescription(path2, getDelay(), 1000);
                service.dispatchGesture(new GestureDescription.Builder().addStroke(sd2).build(), new AccessibilityService.GestureResultCallback() {
                    @Override
                    public void onCompleted(GestureDescription gestureDescription) {
                        super.onCompleted(gestureDescription);
                        canScroll = true;
                    }

                    @Override
                    public void onCancelled(GestureDescription gestureDescription) {
                        super.onCancelled(gestureDescription);
                        canScroll = true;
                    }
                }, null);
            }
        });
        thread.start();
        canScroll = false;
    }

    public void createNewThread(AccessibilityNodeInfo nodeInfoIn) {
        if (thread != null) {
            return;
        }
        final AccessibilityNodeInfo nodeInfo = nodeInfoIn;
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    while (true) {
                        Thread.sleep(getDelay());
                        for (int i = 0; i < actions.length; i++) {
                            //nodeInfo.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD);
                            nodeInfo.performAction(actions[i]);
                        }
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        thread.start();
    }
}

public class AccessibilityServiceTest extends AccessibilityService {
    private ArrayList<App> apps = new ArrayList<>();

    private void init() {
        if (apps.size() > 0) {
            return;
        }

        //抖音
        App dou_yin = new App();
        dou_yin.packetName = "com.ss.android.ugc.aweme.lite";
        dou_yin.targetUINames = new String[]{"android.support.v4.view.ViewPager"};
        dou_yin.actions = new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD};
        apps.add(dou_yin);

        //快手
        App kuai_shou = new App();
        kuai_shou.packetName = "com.kuaishou.nebula";
        kuai_shou.targetUINames = new String[]{"android.support.v4.view.ViewPager"};
        kuai_shou.actions = new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD};
        apps.add(kuai_shou);

        //火山
        App huo_shan = new App();
        huo_shan.packetName = "com.ss.android.ugc.livelite";
        huo_shan.targetUINames = new String[]{"android.support.v4.view.ViewPager"};
        huo_shan.actions = new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD};
        apps.add(huo_shan);

        //刷宝
        App shua_bao = new App();
        shua_bao.packetName = "com.jm.video";
        shua_bao.targetUINames = new String[]{"android.support.v7.widget.RecyclerView"};
        shua_bao.actions = new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD};
        apps.add(shua_bao);

        //微视
        App wei_shi = new App();
        wei_shi.packetName = "com.tencent.weishi";
        wei_shi.targetUINames = new String[]{"android.support.v7.widget.RecyclerView"};
        wei_shi.actions = new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD};
        wei_shi.useScroll = true;
        apps.add(wei_shi);
    }

    public void onServiceConnected() {
        super.onServiceConnected();
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPES_ALL_MASK;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.notificationTimeout = 100;
        info.flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS;
        setServiceInfo(info);

        init();
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getPackageName() == null) {
            return;
        }

        for (int i = 0; i < apps.size(); i++) {
            App app = apps.get(i);
            if (app.equalApp(event.getPackageName())) {
                AccessibilityNodeInfo nodeInfo = event.getSource();
                if (nodeInfo != null && app.equalNowUI(nodeInfo.getClassName())) {
                    if (app.useScroll) {
                        app.scroll(this);
                    } else {
                        app.createNewThread(nodeInfo);
                    }
                }
            }
        }
    }

    public void onInterrupt() {

    }
}
