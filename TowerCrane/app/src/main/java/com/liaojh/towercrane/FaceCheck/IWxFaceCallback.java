package com.liaojh.towercrane.FaceCheck;

public interface IWxFaceCallback{
    //一些状态通知
    //handle	//wxface_init返回值
    //state		//状态(state_前缀)
    //unused	//保留参数
    int wxstatus_call(
            long handle,
            int state,
            int unused
    );


    //人脸检测结果回调
    //handle	wxface_init返回值
    //facestate	状态(facestate_前缀)，等于facestate_hit时，后续参数才有意义
    //score		相似度
    //faceid	人脸id
    //name		人脸名字
    //extdata	人脸扩展信息
    int wxface_return(
            long handle,
            int facestate,
            float score,
            String faceid,
            String name,
            byte[] extdata
    );

    //返回检测到的人脸坐标
    //handlle wxface_init返回值
    //faces   人脸数
    //[]xys	  人脸框的坐标，x1 = xys[0], y1= xys[1], x2 = xys[2], y2=xys[3]，一个人脸占用数组四个位置
    int wxface_boxs(
            long handle,
            int faces,
            int[] xys
    );
}
