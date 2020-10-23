package com.liaojh.towercrane.FaceCheck;

public class wxfacejni {

    //wxstatus_call state
    public static final int state_connect_ok  = 0;      //连接人脸服务器成功
    public static final int state_connect_err = 1;      //连接人脸服务器失败
    public static final int state_connect_retry = 2;    //重新连接人脸服务器
    public static final int state_save_err	= 3;	    //本地保存数据失败，临时存储等
    public static final int state_out_of_memory  = 4;	//内存不足
    public static final int state_init_time  = 5;       //初化化的错误

    //回调状态(wxface_return)
    public static final int facestate_hit  = 0;		//人脸命中，找到人脸
    public static final int facestate_nofound = 1;	//陌生人
    public static final int facestate_noface = 2;	//没有发现人脸
    public static final int facestate_fakeface = 3;	//伪造的人脸，如图片，手机视频等
    public static final int facestate_nocenter = 4;	//不是正脸，比如人脸向左转，向右转等，主要是我们注册的都是正脸照片
    public static final int facestate_getfailed = 5; //获取特征失败
    public static final int facestate_nofacedb = 6;  //没有人脸库，即没有可以比对的对象

    //wxface_detect flags
    public static final int setface_flags_none = 0;
    public static final int setface_flags_maxonly = 1; //只处理最大的人脸
    public static final int setface_flags_bgr   = 2;   //图像数据是bgr格式
    public static final int setface_flags_flip  = 4;   //图像是翻转的
    public static final int setface_flags_capture = 8; //抓拍图片

    //以下函数的通用返回值
    public static final int wxret_ok  = 0;			    //成功
    public static final int wxret_invalidparam = -1;    //无效参数
    public static final int wxret_nostart =	-2;	        //没有调用wxface_start
    public static final int wxret_noface =	-3;	        //没有任何人脸注册
    public static final int wxret_losefile =  -4;	    //丢失文件
    public static final int wxret_nomem	 =	-5;	        //内存不足
    public static final int wxret_nopath =	-6;	        //目录不存在
    public static final int wxret_loadfail =	-7;	    //加载模型失败
    public static final int wxret_formaterr = -8;	    //格式不对
    public static final int wxret_busy	=	-9;	        //正在忙
    public static final int wxret_failed =	-10;	    //failed

    //人脸SDK初始化
    //deviceid	设备号
    //appName	应用名
    //eventcall  事件通知
    //返回：非0成功并保存该值，等于0初始化失败
    public native long wxface_init(
            String deviceid,
            String appName,
            String modelpath,
            IWxFaceCallback eventcall
    );

    //人脸SDK释放
    //handle wxface_init返回值
    //返回：返回0 成功， 小于0，错误值
    public native int wxface_free(long handle);

    //设置服务器参数
    //handle	wxface_init返回值
    //faceserver wxface_server服务端监听的地址
    //faceport	wxface_server服务端监听的端口
    //facekey	与wxface_server通讯的钥匙
    //upserver	上传抓拍人脸图片的服务器监听的地址
    //upport	上传抓拍人脸图片的服务器监听的端口
    //upkey	上传抓拍人脸图片的服务器通讯的钥匙
    //返回：返回0 成功， 小于0，错误值
    public native int wxface_setparam(
            long handle,
            String faceserver,
            int faceport,
            String facekey,
            String upserver,
            int upport,
            String upkey
    );

    //设置人脸检测的参数
    //handle	wxface_init返回值
    //minsize	最小可检测人脸像素，如60
    //threshold1	是否人脸阀值，如0.80
    //hit_threshold	相似度阀值，如0.85
    //unused	保留参数
    //返回：返回0 成功， 小于0，错误值
    public native int wxface_setface(
            long handle,
            int minsize,
            float threshold1,
            float hit_threshold,
            int unused
    );

    //开始工作
    //handle wxface_init返回值
    //返回：返回0 成功， 小于0，错误值
    public native int wxface_start(long handle);

    //停止工作
    //handle wxface_init返回值
    //返回：返回0 成功， 小于0，错误值
    public native int wxface_stop(long handle);

    //人脸检测
    //handle  wxface_init返回值
    //rgbdata 人脸图像的rgb数据
    //width   图像的宽度
    //height  图像的高度
    //flags   参数
    //返回：返回0 提交成功， 小于0，错误值
    public native int wxface_detect(
            long handle,
            byte []rgbdata,
            int width,
            int height,
            int flags
    );

    //获取本地的注册的人脸数
    //handle wxface_init返回值
    //返回：大于等于0 = 人脸数， 小于0，错误值
    public native int wxface_getfaces(long handle);

}
