package com.liaojh.towercrane.Manager;

import android.app.Application;
import android.os.Message;
import android.util.Log;

import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.SerialPort.SerialUtil;
import com.liaojh.towercrane.Tool.Tool;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.sql.Struct;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

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

    public Boolean judgeHaveSignal() {
        if (mSocket == null || !mSocket.isConnected() || mSocket.isClosed()) {
            return false;
        }
        return true;
    }

    public void connect() {
        if (mSocket != null && !mSocket.isConnected() && mSocket.isClosed()) {
            return;
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    mSocket = new Socket(ADDRESS, PORT);
                    if (mSocket.isConnected()) {
                        InputStream is = mSocket.getInputStream();
                        byte[] bytes = new byte[1];
                        ArrayList<Byte> list = new ArrayList<>();
                        while (is.read(bytes) != -1) {
                            list.add(bytes[0]);
                            //检测帧数据
                            if (Tool.bytesToHexStr(bytes).equals("FB") && checkFrameData(list)) {
                                //帧数据效验成功，处理数据
                                //Log.e(Constant.LogTag, "receive msg : " + Tool.bytesToHexStr(Tool.byteListToArray(list)));
                                list.clear();
                            }
                        }
                        //断开了，重新连接
                        mSocket = null;
                        connect();
                    }
                } catch (IOException e) {
                    if (mSocket == null || mSocket.isClosed()) {
                        //断开了，重新连接
                        try {
                            Thread.sleep(10000);
                            mSocket = null;
                            connect();
                        } catch (InterruptedException ex) {
                            ex.printStackTrace();
                        }
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
        if (msg == null) {
            return;
        }
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
        } else {
            connect();
        }
    }

    //检测帧数据
    public Boolean checkFrameData(ArrayList<Byte> list) {
        if (list.size() < 21) {
            //最小长度21
            return false;
        }
        //检测头部帧和尾部帧
        if (!Tool.byteToHexStr(list.get(0)).equals("FA") ||
                !Tool.byteToHexStr(list.get(1)).equals("AA") ||
                !Tool.byteToHexStr(list.get(list.size() - 2)).equals("BB") ||
                !Tool.byteToHexStr(list.get(list.size() - 1)).equals("FB")) {
            return false;
        }
        //检测长度
        int length = Integer.parseInt(Tool.byteToHexStr(list.get(3)), 16) + Integer.parseInt(Tool.byteToHexStr(list.get(4)), 16);
        if (length != list.size()) {
            return false;
        }
        //帧效验和
        String frameStr = "";
        for (int i = 0; i < list.size() - 4; i++) {
            frameStr = frameStr + Tool.byteToHexStr(list.get(i));
        }
        String hexSum = Tool.getChecksum(frameStr).toUpperCase();
        String checkSum = Tool.byteToHexStr(list.get(list.size() - 4)) + Tool.byteToHexStr(list.get(list.size() - 3));
        if (!hexSum.equals(checkSum)) {
            return false;
        }
        return true;
    }

    public byte[] buildFrameData(String strMsgId, String strContent) {
        if (strMsgId == null || strMsgId.trim().equals("")) {
            return null;
        }
        int frameLength = 2 + 2 + 2 + 9 + 2 + (strContent.length() / 2) + 2 + 2;

        //帧头
        String head = "FAAA".toUpperCase();

        //长度
        String length = Tool.getHexString(Integer.toHexString(frameLength), 4).toUpperCase();

        //流水号
        String number = Tool.getHexString(Integer.toHexString(frameCountNumber), 4).toUpperCase();

        //设备号
        String facility = "545435303838313536".toUpperCase();

        //消息id
        String msgId = strMsgId.toUpperCase();

        //消息内容
        String content = strContent.toUpperCase();

        //效验和
        String checkSum = Tool.getChecksum(head + length + number + facility + msgId + content).toUpperCase();

        //帧尾
        String back = "BBFB".toUpperCase();

        return Tool.hexStrToBytes(head + length + number + facility + msgId + content + checkSum + back);
    }

    //登录
    public void login() {
//        String loginFrame = buildFrameDataStr("1001", "51545A3535313200000000000000000000010064022603200000000000140A1E0000000106000A0064009600C800FA012C0000000000001E020000000000000002580568025005780201064001C40708019207D0016A089801480960012C0A2801130AF000FE0BB800EC0C8000DB0D4800CD0E1000BA0ED800AF0FA000AA106800A01130009711F8008F12C00088138800811450007B15180078157C000000000000FFFF00000320000A000A025802BC00000000FFFF000002260000000001F4021200000000FFFFEAE81518EB1AEB4C14B414E600000000FFFF00000258000000000226024400000000FFFFF4480BB8F448F448019001C200000000FFFFF4480BB8F448F448019001C200000000FFFF0000012C000000000007000800000000FFFF000003E800000000032003840000FFCE00000000FFCE0032003200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018647363746F7765722E77756A6A632E636F6D3A323030360");
//        sendMsg(loginFrame.getBytes());
//        sendMsg("FAAA00150071545430333133393031100A044DBBFB".getBytes());
//        sendMsg(Tool.hexStrToBytes("FAAA00150071545430333133393031100A044DBBFB"));
//        Log.e(Constant.LogTag, Tool.byteToHex(Tool.hexStrToBytes("FAAA00150071545430333133393031100A044DBBFB")));
    }

    //发送心跳包
    public void sendHeart() {
        //buildFrameData("100A", "");
        sendMsg(buildFrameData("100A", ""));
    }
}
