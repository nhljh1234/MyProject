package com.liaojh.towercrane.Manager;

import android.util.Log;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.SerialPort.SerialUtil;
import com.liaojh.towercrane.Tool.Tool;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.sql.Struct;

public class NetManager {
    private static NetManager instance;

    private static final String ADDRESS = "dsctower0.wujjc.com";
    private static final int PORT = 22006;
    private Socket mSocket;
    private int frameCountNumber = 0;

    private NetManager() {

    }

    public static NetManager getInstance() {
        if (instance == null) {
            synchronized (SerialUtil.class) {
                if (instance == null) {
                    instance = new NetManager();
                }
            }
        }
        return instance;
    }

    public void connect() {
        if (mSocket != null && !mSocket.isConnected() && !mSocket.isClosed()) {
            return;
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket = new Socket(ADDRESS, PORT);
                    if (mSocket.isConnected()) {
                        BufferedReader br = new BufferedReader(new InputStreamReader(mSocket.getInputStream()));
                        String line = "";
                        while ((line = br.readLine()) != null) {
                            Log.v(Constant.LogTag, "receive msg : " + line);
                        }
                        //断开了，重新连接
                        mSocket = null;
                        connect();
                    }
                } catch (IOException e) {
                    if (mSocket.isClosed()) {
                        //断开了，重新连接
                        mSocket = null;
                        connect();
                    }
                    Log.e(Constant.LogTag, "Socket error : " + e.getMessage());
                }
            }
        }).start();
    }

    public void clear() {
        if (mSocket != null) {
            try {
                mSocket.close();
                mSocket = null;
            } catch (IOException e) {
                Log.e(Constant.LogTag, "clear error : " + e.getMessage());
            }
        }
    }

    public void sendMsg(final byte[] msg) {
        if (mSocket != null && mSocket.isConnected()) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        OutputStream outputStream = mSocket.getOutputStream();
                        outputStream.write(msg);
                        outputStream.flush();
                        frameCountNumber++;
                    } catch (IOException e) {
                        if (mSocket.isClosed()) {
                            //断开了，重新连接
                            mSocket = null;
                            connect();
                        }
                        Log.e(Constant.LogTag, "sendMsg error : " + e.getMessage());
                    }
                }
            }).start();
        }
    }

    private String getHexString(String str, int resultLength) {
        int length = str.length();
        for (int i = length; i < resultLength; i++) {
            str = "0" + str;
        }
        return str;
    }

    public String buildFrameDataStr (String strMsgId, String strContent) {
        if(strContent == null || strContent.trim().equals("")) {
            return null;
        }
        int frameLength = (2 + 2 + 2 + 9 + 2 + (strContent.length() / 2) + 2 + 2) / 2;

        //帧头
        String head = "FAAA".toUpperCase();

        //长度
        String length = getHexString(Integer.toHexString(frameLength), 4).toUpperCase();

        //流水号
        String number = getHexString(Integer.toHexString(frameCountNumber), 4).toUpperCase();

        //设备号
        String facility = "545435303838313536".toUpperCase();

        //消息id
        String msgId = strMsgId.toUpperCase();

        //消息内容
        String content = strContent.toUpperCase();

        //效验和
        String checkSum = getHexString(Integer.toHexString((head.length() + length.length() + number.length() + facility.length() + msgId.length() + content.length()) / 2), 4).toUpperCase();

        //帧尾
        String back = "BBFB".toUpperCase();

        return head + length + number + facility + msgId + content + checkSum + back;
    }

    //登录
    public void login() {
//        String loginFrame = buildFrameDataStr("1001", "51545A3535313200000000000000000000010064022603200000000000140A1E0000000106000A0064009600C800FA012C0000000000001E020000000000000002580568025005780201064001C40708019207D0016A089801480960012C0A2801130AF000FE0BB800EC0C8000DB0D4800CD0E1000BA0ED800AF0FA000AA106800A01130009711F8008F12C00088138800811450007B15180078157C000000000000FFFF00000320000A000A025802BC00000000FFFF000002260000000001F4021200000000FFFFEAE81518EB1AEB4C14B414E600000000FFFF00000258000000000226024400000000FFFFF4480BB8F448F448019001C200000000FFFFF4480BB8F448F448019001C200000000FFFF0000012C000000000007000800000000FFFF000003E800000000032003840000FFCE00000000FFCE0032003200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018647363746F7765722E77756A6A632E636F6D3A323030360");
//        sendMsg(loginFrame.getBytes());
        sendMsg("FAAA019000145454353038383135361001000151545A3535313200000000000000000000010064022603200000000000140A1E000000000000020064009600C800FA014A0000000000000000000000000000000D17700E172510140F1211A8140FB9160E24180CD51A0BB81C0AC31E09F12009382208932408022607442806D62A06A42C06402E05EB30059B32055934050F3604CE3704B03704B00000FFFF00000320006400C8025802BC00000000FFFF000002260032006401F4021200000000FFFFEAE81518EB4CFDF8145014B400000000FFFF0000177000000000157C16A800000000FFFFF4480BB8F448F448019001C200000000FFFFF4480BB8F448F448019001C200000000FFFF0000012C000000000007000800000000FFFF000003E800000000032003840000FFFE0003FFF400050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018647363746F7765722E77756A6A632E636F6D3A323030360050A4BBFB".getBytes());
    }
}
