package Tool;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Environment;
import android.util.DisplayMetrics;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

public class Tool {
    //判断是否有SD卡
    public static boolean checkSDCardExist() {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            return true;
        } else {
            // 没有SDCard
            return false;
        }
    }

    public static int getDPI(Activity activity) {
        DisplayMetrics dm = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(dm);
        return (int) (dm.density * 160);
    }

    public static int getDPIRatioNum(Activity activity, int value) {
        int DPI = getDPI(activity);
        return (int)Math.floor(value * 420 / DPI + 0.5);
    }

    public static String getLocalIPAddress() {
        return "192.168.0.1";
//        try {
//            for(Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();){
//                NetworkInterface intF = en.nextElement();
//                for(Enumeration<InetAddress> enumIpAddress = intF.getInetAddresses(); enumIpAddress.hasMoreElements();){
//                    InetAddress inetAddress = enumIpAddress.nextElement();
//                    if(!inetAddress.isLoopbackAddress() && (inetAddress instanceof Inet4Address)){
//                        return inetAddress.getHostAddress().toString();
//                    }
//                }
//            }
//        } catch (SocketException e) {
//
//        }
//        return null;
    }
}
