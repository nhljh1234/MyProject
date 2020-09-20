package com.example.liaojh.accessibilityservice;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.util.ArrayList;
import java.util.Random;

enum SCROLL_TYPE {
    PATH,
    ACTION
}

class App {
    private Thread thread = null;
    private boolean canScroll = true;

    private String packetName = "";
    private String[] targetUINames = new String[]{};
    private int[] actions = new int[]{};
    private SCROLL_TYPE scrollType;

    public App(String packetName, String[] targetUINames, int[] actions, SCROLL_TYPE scrollType) {
        this.packetName = packetName;
        this.targetUINames = targetUINames;
        this.actions = actions;
        this.scrollType = scrollType;
    }

    public String getPacketName() {
        return packetName;
    }

    public boolean equalApp(CharSequence name) {
        return name.equals(packetName);
    }

    public boolean equalTargetUI(CharSequence name) {
        for (int i = 0; i < targetUINames.length; i++) {
            if (name.equals(targetUINames[i])) {
                return true;
            }
        }
        return false;
    }

    public int getDelay() {
        Random random = new Random();
        return (random.nextInt(5) + 3) * 1000;
    }

    public void onAccessibilityEvent(AccessibilityService service, AccessibilityNodeInfo nodeInfoIn) {
        if (scrollType == SCROLL_TYPE.ACTION) {
            createNewThread(nodeInfoIn);
        } else if (scrollType == SCROLL_TYPE.PATH) {
            pathScroll(service);
        }
    }

    private void pathScroll(AccessibilityService service) {
        if (canScroll == false) {
            return;
        }
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
        canScroll = false;
    }

    private void createNewThread(AccessibilityNodeInfo nodeInfoIn) {
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
        //抖音
        App dou_yin = new App("com.ss.android.ugc.aweme.lite",
                new String[]{"android.support.v4.view.ViewPager"},
                new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD},
                SCROLL_TYPE.ACTION
        );
        apps.add(dou_yin);

        //快手
        App kuai_shou = new App("com.kuaishou.nebula",
                new String[]{"androidx.viewpager.widget.ViewPager"},
                new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD},
                SCROLL_TYPE.ACTION
        );
        apps.add(kuai_shou);

        //抖音火山版
        App dou_yin_huo_shan = new App("com.ss.android.ugc.live",
                new String[]{"android.support.v4.view.ViewPager"},
                new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD},
                SCROLL_TYPE.ACTION
        );
        apps.add(dou_yin_huo_shan);

        //刷宝
        App shua_bao = new App("com.jm.video",
                new String[]{"android.support.v7.widget.RecyclerView"},
                new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD},
                SCROLL_TYPE.ACTION
        );
        apps.add(shua_bao);

        //微视
        App wei_shi = new App("com.tencent.weishi",
                new String[]{"android.support.v7.widget.RecyclerView"},
                new int[]{AccessibilityNodeInfo.ACTION_SCROLL_FORWARD},
                SCROLL_TYPE.PATH
        );
        apps.add(wei_shi);
    }

    public void onServiceConnected() {
        super.onServiceConnected();

        init();

        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPES_ALL_MASK;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.notificationTimeout = 100;
        info.flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS;
        info.packageNames = getPacketNames();

        setServiceInfo(info);
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
                if (nodeInfo != null && app.equalTargetUI(nodeInfo.getClassName())) {
                    app.onAccessibilityEvent(this, nodeInfo);
                }
            }
        }
    }

    public void onInterrupt() {

    }

    private String[] getPacketNames() {
        String[] packetNames = new String[apps.size()];
        for (int i = 0; i < apps.size(); i++) {
            packetNames[i] = apps.get(i).getPacketName();
        }
        return packetNames;
    }
}
