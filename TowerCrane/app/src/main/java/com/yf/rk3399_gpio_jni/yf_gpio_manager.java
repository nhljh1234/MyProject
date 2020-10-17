package com.yf.rk3399_gpio_jni;

import android.util.Log;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Manager.ArcFaceManager;

import java.util.concurrent.Executors;

public class yf_gpio_manager {
    private static yf_gpio_manager instance;
    private static int fd;

    private yf_gpio_manager() {

    }

    public static yf_gpio_manager getInstance() {
        if (instance == null) {
            synchronized (yf_gpio_manager.class) {
                if (instance == null) {
                    instance = new yf_gpio_manager();
                    fd = open();
                }
            }
        }
        return instance;
    }

    public int outputLowValue() {
        int ret = set_gpio1_value(fd, 0);
        Log.e(Constant.LogTag, "outputLowValue ret is " + ret);
        return ret;
    }

    public int outputHighValue() {
        int ret = set_gpio1_value(fd, 1);
        Log.e(Constant.LogTag, "outputHighValue ret is " + ret);
        return ret;
    }

    public static native int open();

    public static native void set_humansensor_on(int fd);

    public static native void set_humansensor_off(int fd);

    public static native void set_humansensor_time(int fd, int arg);

    public static native int get_humansensor_value(int fd);

    public static native int set_gpio0_value(int fd, int value);

    public static native int get_gpio0_value(int fd);

    public static native int set_gpio1_value(int fd, int value);

    public static native int get_gpio1_value(int fd);

    public static native int set_gpio2_value(int fd, int value);

    public static native int get_gpio2_value(int fd);

    public static native int set_gpio3_value(int fd, int value);

    public static native int get_gpio3_value(int fd);

    public static native int set_gpio4_value(int fd, int value);

    public static native int get_gpio4_value(int fd);

    public static native void set_lcd_on(int fd);

    public static native void set_lcd_off(int fd);

    static {
        System.loadLibrary("yfgpio_jni");
    }
}
