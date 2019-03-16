package com.example.unityandroidlibrary;

import android.content.Context;
import android.util.Log;
import org.json.JSONObject;

public class BaseSDK {

    public BaseSDK() {

    }

    //一律返回一个json字符串
    public String callPlatform(int action, String data, Context context) {
        String returnStr = null;
        //返回
        JSONObject ret = new JSONObject();
        try {
            final JSONObject obj = JsonTool.getJsonObject(data);
            if (obj == null) {
                return null;
            }
            Log.v("test_1", obj.toString());
            switch (action) {
                case SDKAction.GET_NET_STATUS:
                    ret.put("status", SDKNetTool.getNetWorkStatus(context));
                    returnStr = JsonTool.getDictionaryJsonStr(ret);
                    break;
                case SDKAction.GET_NET_STATUS_TEST:
                    ret.put("status", SDKNetTool.getNetWorkStatus(context));
                    returnStr = JsonTool.getDictionaryJsonStr(ret);
                    break;
                case SDKAction.SDK_INIT:
                    break;
            }
            //判断是否调用回调
            //带有字段_cb表示会调用callUnity
            Log.v("test_2", "" + obj.has("_cb"));
            if (obj.has("_cb")) {
                Log.v("test_2", obj.getString("_cb"));
                String _cb = obj.getString("_cb");
                if (_cb != null && !_cb.isEmpty()) {
                    UnityCallback.callUnity(_cb, returnStr);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnStr;
    }
}
