using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    public class RectTransformTool
    {
        //获取所在的panel，就是UIManager里面那几个根节点，一定会带有SceneRatioComponent
        public static RectTransform getPanel(RectTransform rectTransform = null)
        {
            if (rectTransform == null)
            {
                return TJ_UNITY_TOOL.UIManagerTool.GetInstance().getPanelByType(TJ_UNITY_TOOL.UIManagerTool.UI_PANEL_TYPE.UI);
            }
            Transform parentRectTransform = rectTransform;
            while (true)
            {
                if (parentRectTransform == null)
                {
                    return null;
                }
                if (parentRectTransform.GetComponent<TJ_UNITY_TOOL.SceneRatioComponent>() != null)
                {
                    return parentRectTransform.GetComponent<RectTransform>();
                }
                parentRectTransform = parentRectTransform.parent;
            }
        }
        /**
         * ************************************适配相关************************************
         */


        /**
         * ************************************获取控件数据************************************
         */
        //获取一个节点的尺寸
        public static Vector2 getSize(RectTransform rectTransform)
        {
            Vector2 vector = new Vector2();
            vector.x = rectTransform.rect.width;
            vector.y = rectTransform.rect.height;
            return vector;
        }
        //获取一个点的本地坐标
        public static Vector2 getLocalPosition(RectTransform rectTransform)
        {
            RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
            Vector2 parentSize = getSize(parent);
            Vector2 anchroPos = new Vector2(rectTransform.anchorMin.x * parentSize.x, rectTransform.anchorMin.y * parentSize.y);
            Vector2 anchroLeftBottomPos = anchroPos + rectTransform.offsetMin;
            return anchroLeftBottomPos + 0.5f * getSize(rectTransform);
        }
        public static Vector2 getWorldPosition(RectTransform rectTransform)
        {
            Vector2 pos = getLocalPosition(rectTransform);
            RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
            while (true)
            {
                if (parent == null || parent.GetComponent<TJ_UNITY_TOOL.SceneRatioComponent>() != null)
                {
                    return pos;
                }
                pos = pos + getWorldLeftBottomPos(parent);
                parent = parent.parent.GetComponent<RectTransform>();
            }
        }
        //更具设计坐标返回实际坐标
        public static Vector2 getWorldPositionByDesign(float x, float y)
        {
            RectTransform panel = getPanel();
            if (panel == null)
            {
                return new Vector2();
            }
            Vector2 size = getSize(panel);
            return new Vector2(x / TJ_UNITY_TOOL.SceneRatioTool.SCENE_DESIGN_WIDTH * size.x,
                y / TJ_UNITY_TOOL.SceneRatioTool.SCENE_DESIGN_HEIGHT * size.y);
        }
        public static Vector2 getWorldPositionByDesign(Vector2 pos)
        {
            return getWorldPositionByDesign(pos.x, pos.y);
        }
        //获取相对于一个控件的位置
        public static Vector2 getPositionByTarget(RectTransform rectTransform, RectTransform target)
        {
            return getWorldPosition(rectTransform) - getWorldPosition(target);
        }
        //获取一个点左下角的世界坐标
        public static Vector2 getWorldLeftBottomPos(RectTransform rectTransform)
        {
            Vector2 worldPos = getWorldPosition(rectTransform);
            Vector2 size = getSize(rectTransform);
            return new Vector2(worldPos.x - 0.5f * size.x, worldPos.y - 0.5f * size.y);
        }
        /**
         * ************************************设置控件尺寸************************************
         */
        //设置UI的宽度
        public static void setWidth(RectTransform rectTransform, float width)
        {
            rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, width);
        }
        //设置UI的高度
        public static void setHeight(RectTransform rectTransform, float height)
        {
            rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, height);
        }
        //设置一个节点的尺寸
        public static void setSize(RectTransform rectTransform, Vector2 size)
        {
            setWidth(rectTransform, size.x);
            setHeight(rectTransform, size.y);
        }
        //设置一个节点的尺寸
        public static void setSize(RectTransform rectTransform, float width, float height)
        {
            setWidth(rectTransform, width);
            setHeight(rectTransform, height);
        }
        /**
         * ************************************设置本地坐标************************************
         */
        //设置本地坐标
        public static void setLocalPositionX(RectTransform rectTransform, float x)
        {
            Vector2 size = getSize(rectTransform);
            float posX = x - size.x * 0.5f;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, posX, size.x);
        }
        //设置本地坐标
        public static void setLocalPositionY(RectTransform rectTransform, float y)
        {
            Vector2 size = getSize(rectTransform);
            float posY = y - size.y * 0.5f;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Bottom, posY, size.y);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, float x, float y)
        {
            setLocalPositionX(rectTransform, x);
            setLocalPositionY(rectTransform, y);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, Vector2 pos)
        {
            setLocalPosition(rectTransform, pos.x, pos.y);
        }
        //根据比例设置本地位置
        public static void setLocalPositionByRatio(RectTransform rectTransform, float x, float y)
        {
            Vector2 size = getSize(rectTransform.parent.GetComponent<RectTransform>());
            setLocalPosition(rectTransform, size.x * x, size.y * y);
        }
        //根据比例设置本地位置
        public static void setLocalPositionByRatio(RectTransform rectTransform, Vector2 posRatio)
        {
            setLocalPositionByRatio(rectTransform, posRatio.x, posRatio.y);
        }
        /**
         * ************************************设置全局坐标************************************
         */
        //设置全局坐标
        public static void setWorldPositionX(RectTransform rectTransform, float x)
        {
            RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
            Vector2 parentWorldLeftBottomPos = getWorldLeftBottomPos(parent);
            setLocalPositionX(rectTransform, x - parentWorldLeftBottomPos.x);
        }
        //设置全局坐标
        public static void setWorldPositionY(RectTransform rectTransform, float y)
        {
            RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
            Vector2 parentWorldLeftBottomPos = getWorldLeftBottomPos(parent);
            setLocalPositionY(rectTransform, y - parentWorldLeftBottomPos.y);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, float x, float y)
        {
            setWorldPositionX(rectTransform, x);
            setWorldPositionY(rectTransform, y);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, Vector2 pos)
        {
            setWorldPosition(rectTransform, pos.x, pos.y);
        }
        //根据比例设置全局坐标
        public static void setWorldPositionByRatio(RectTransform rectTransform, float x, float y)
        {
            Vector2 size = getSize(getPanel(rectTransform));
            setWorldPosition(rectTransform, size.x * x, size.y * y);
        }
        public static void setWorldPositionByRatio(RectTransform rectTransform, Vector2 posRatio)
        {
            setWorldPositionByRatio(rectTransform, posRatio.x, posRatio.y);
        }
        //根据设计分辨率来设置坐标
        public static void setWorldPositionByDesign(RectTransform rectTransform, float x, float y)
        {
            setWorldPositionByRatio(rectTransform, x / TJ_UNITY_TOOL.SceneRatioTool.SCENE_DESIGN_WIDTH,
                y / TJ_UNITY_TOOL.SceneRatioTool.SCENE_DESIGN_HEIGHT);
        }
        public static void setWorldPositionByDesign(RectTransform rectTransform, Vector2 pos)
        {
            setWorldPositionByDesign(rectTransform, pos.x, pos.y);
        }
    }
}