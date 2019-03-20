using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using DG.Tweening;

//截屏工具
namespace TJ_UNITY_TOOL
{
    public class ScreenCut
    {

        private static Camera[] sortCamera(Camera[] cameras)
        {
            //根据depth排序
            for (int i = 0; i < cameras.Length; i++)
            {
                for (int j = i; j < cameras.Length; j++)
                {
                    if (cameras[j].depth < cameras[i].depth)
                    {
                        Camera camera = cameras[j];
                        cameras[j] = cameras[i];
                        cameras[i] = camera;
                    }
                }
            }
            return cameras;
        }

        //截图函数
        //cameras 参与截图的摄像机，
        //path 文件存储的路径
        //rect 截屏的大小
        public static Texture2D screenCut(Camera[] cameras, string path, Rect rect)
        {
            if (cameras.Length == 0)
            {
                return null;
            }
            if (cameras.Length > 1)
            {
                //根据depth排序
                cameras = sortCamera(cameras);
            }
            // 创建一个RenderTexture对象  
            RenderTexture rt = new RenderTexture((int)rect.width, (int)rect.height, 0);
            for (int i = 0; i < cameras.Length; i++)
            {
                cameras[i].targetTexture = rt;
                cameras[i].Render();
            }
            //激活RenderTexture对象 
            RenderTexture.active = rt;
            Texture2D screenShot = new Texture2D((int)rect.width, (int)rect.height, TextureFormat.RGB24, false);
            //读取像素
            screenShot.ReadPixels(rect, 0, 0);
            screenShot.Apply();

            //清除数据
            for (int i = 0; i < cameras.Length; i++)
            {
                cameras[i].targetTexture = null;
            }
            RenderTexture.active = null;
            GameObject.Destroy(rt);

            //存成图片
            byte[] bytes = screenShot.EncodeToPNG();
            System.IO.File.WriteAllBytes(path, bytes);
            return screenShot;
        }
    }
}