package com.example.unityandroidlibrary;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.security.PublicKey;
import java.util.Dictionary;
import java.util.Iterator;
import java.util.List;

public class JsonTool {
    //列表
    private final static int LIST = 1;
    //字典
    private final static int DICTIONARY = 2;

    private static int getType(JSONObject obj) {
        if (obj.has("target")) {
            return LIST;
        }
        if (obj.has("keys") && obj.has("values")) {
            return DICTIONARY;
        }
        return -1;
    }

    private static JSONObject getList(JSONObject obj) {
        JSONObject ret = new JSONObject();
        try {
            JSONArray arr = obj.getJSONArray("target");
            for (int i = 0; i < arr.length(); i++) {
                ret.put("" + i, arr.get(i));
            }
            return ret;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static JSONObject getDictionary(JSONObject obj) {
        JSONObject ret = new JSONObject();
        try {
            JSONArray keys = obj.getJSONArray("keys");
            JSONArray values = obj.getJSONArray("values");
            for (int i = 0; i < keys.length(); i++) {
                ret.put(keys.get(i).toString(), values.get(i));
            }
            return ret;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getDictionaryJsonStr(JSONObject obj) {
        try {
            JSONObject ret = new JSONObject();
            JSONArray keys = new JSONArray();
            JSONArray values = new JSONArray();
            Iterator<String> iterator = obj.keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                Log.v("test_3", key);
                keys.put(key);
                Log.v("test_4", "" + obj.get(key));
                values.put(obj.get(key));
            }
            ret.put("keys", keys);
            ret.put("values", values);
            return ret.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static JSONObject getJsonObject(String str) {
        JSONObject ret = null;
        try {
            final JSONObject obj = new JSONObject(str);
            ret = new JSONObject();
            //判断是List还是dic
            int type = getType(obj);
            switch (type) {
                case LIST:
                    return getList(obj);
                case DICTIONARY:
                    return getDictionary(obj);
                default:
                    return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }
}
