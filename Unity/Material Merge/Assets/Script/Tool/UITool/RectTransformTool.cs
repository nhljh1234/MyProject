using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL
{
    public class RectTransformTool
    {
        //获取所在的panel，就是UIManager里面那几个根节点，一定会带有SceneRatioComponent
        public static RectTransform getPanel(RectTransform rectTransform)
        {
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
        //根据自适应修改坐标点，因为匹配高度或者宽度的时候会拉长另一个数值
        public static Vector2 getPosByAdaptation(RectTransform rectTransform, Vector2 pos)
        {
            return pos * getAdaptationRatioNum(rectTransform);
        }
        //获取适配长宽的缩放比例
        public static Vector2 getAdaptationRatioNum(RectTransform rectTransform)
        {
            RectTransform panel = getPanel(rectTransform);
            if (panel == null)
            {
                return new Vector2();
            }
            Vector2 size = getSize(panel);
            if (size.x == TJ_UNITY_TOOL.SceneRatioTool.SCEEN_DESIGN_WIDTH)
            {
                return new Vector2(1, size.y / TJ_UNITY_TOOL.SceneRatioTool.SCEEN_DESIGN_HEIGHT);
            }
            else
            {
                return new Vector2(size.x / TJ_UNITY_TOOL.SceneRatioTool.SCEEN_DESIGN_WIDTH, 1);
            }
        }
        public static Vector2 getPosByAdaptation(RectTransform rectTransform, float x, float y)
        {
            return getPosByAdaptation(rectTransform, new Vector2(x, y));
        }

        /**
         * ************************************获取控件数据************************************
         */
        //获取相对于某个控件的右下角的坐标
        public static Vector3 getLeftBottomPosByTarget(RectTransform rectTransform, RectTransform targetRectTransform)
        {
            return getWorldLeftBottomPos(rectTransform) - getWorldLeftBottomPos(targetRectTransform);
        }
        //获取左下角点的本地坐标
        //相对于父节点
        public static Vector3 getLocalLeftBottomPos(RectTransform rectTransform)
        {
            RectTransform parent = rectTransform.parent.GetComponent<RectTransform>();
            return getLeftBottomPosByTarget(rectTransform, parent);
        }
        //获取左下角点的世界坐标
        //这边要做一下特殊处理，处理成以Panel为准，这个才是我们控件依托的地方
        public static Vector3 getWorldLeftBottomPos(RectTransform rectTransform)
        {
            //自身的坐标
            Vector3[] corners = new Vector3[4];
            rectTransform.GetWorldCorners(corners);
            //panel的坐标
            Vector3[] cornerPanels = new Vector3[4];
            RectTransform panel = getPanel(rectTransform);
            panel.GetWorldCorners(cornerPanels);
            return corners[0] - cornerPanels[0];
        }
        //获取一个节点相对于其他节点的位置
        public static Vector3 getPositionByTarget(RectTransform rectTransform, RectTransform targetRectTransform)
        {
            Vector3 vector = new Vector3();
            if (!rectTransform)
            {
                return vector;
            }
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getLeftBottomPosByTarget(rectTransform, targetRectTransform);
            vector.x = leftBottomPos.x + 0.5f * size.x;
            vector.y = leftBottomPos.y + 0.5f * size.y;
            vector.z = leftBottomPos.z;
            return vector;
        }
        //获取一个节点的本地坐标
        public static Vector3 getLocalPosition(RectTransform rectTransform)
        {
            Vector3 vector = new Vector3();
            if (!rectTransform)
            {
                return vector;
            }
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getLocalLeftBottomPos(rectTransform);
            vector.x = leftBottomPos.x + 0.5f * size.x;
            vector.y = leftBottomPos.y + 0.5f * size.y;
            vector.z = leftBottomPos.z;
            return vector;
        }
        //获取一个节点的世界坐标
        public static Vector3 getWorldPosition(RectTransform rectTransform)
        {
            Vector3 worldPosition = new Vector3();
            if (!rectTransform)
            {
                return worldPosition;
            }
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getWorldLeftBottomPos(rectTransform);
            worldPosition.x = leftBottomPos.x + 0.5f * size.x;
            worldPosition.y = leftBottomPos.y + 0.5f * size.y;
            worldPosition.z = leftBottomPos.z;
            return worldPosition;
        }
        //获取一个节点的尺寸
        public static Vector2 getSize(RectTransform rectTransform)
        {
            Vector2 vector = new Vector2();
            if (!rectTransform)
            {
                return vector;
            }
            vector.x = rectTransform.rect.width;
            vector.y = rectTransform.rect.height;
            return vector;
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
        public static void setLocalPositionX(RectTransform rectTransform, float x, bool transform = false, bool usePivot = false)
        {
            Vector2 size = getSize(rectTransform);
            x = transform ? getPosByAdaptation(rectTransform, x, 0).x : x;
            float posX = x - size.x * (usePivot ? rectTransform.pivot.x : 0.5f);
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, posX, size.x);
        }
        //设置本地坐标
        public static void setLocalPositionY(RectTransform rectTransform, float y, bool transform = false, bool usePivot = false)
        {
            Vector2 size = getSize(rectTransform);
            y = transform ? getPosByAdaptation(rectTransform, 0, y).y : y;
            float posY = y - size.y * (usePivot ? rectTransform.pivot.y : 0.5f);
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Bottom, posY, size.y);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, Vector2 pos, bool transform = false, bool usePivot = false)
        {
            pos = transform ? getPosByAdaptation(rectTransform, pos) : pos;
            setLocalPositionX(rectTransform, pos.x, false, usePivot);
            setLocalPositionY(rectTransform, pos.y, false, usePivot);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, float x, float y, bool transform = false, bool usePivot = false)
        {
            Vector2 pos = transform ? getPosByAdaptation(rectTransform, x, y) : new Vector2(x, y);
            setLocalPositionX(rectTransform, pos.x, false, usePivot);
            setLocalPositionY(rectTransform, pos.y, false, usePivot);
        }

        /**
         * ************************************设置全局坐标************************************
         */
        //设置全局坐标
        public static void setWorldPositionX(RectTransform rectTransform, float x, bool transform = true, bool usePivot = false)
        {
            RectTransform parentRectTransform = rectTransform.parent.GetComponent<RectTransform>();
            Vector3 parentLeftBottom = getWorldLeftBottomPos(parentRectTransform);
            Vector2 size = getSize(rectTransform);
            x = transform ? getPosByAdaptation(rectTransform, x, 0).x : x;
            float posX = x - size.x * (usePivot ? rectTransform.pivot.x : 0.5f) - parentLeftBottom.x;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, posX, size.x);
        }
        //设置全局坐标
        public static void setWorldPositionY(RectTransform rectTransform, float y, bool transform = true, bool usePivot = false)
        {
            RectTransform parentRectTransform = rectTransform.parent.GetComponent<RectTransform>();
            Vector3 parentLeftBottom = getWorldLeftBottomPos(parentRectTransform);
            Vector2 size = getSize(rectTransform);
            y = transform ? getPosByAdaptation(rectTransform, 0, y).y : y;
            float posY = y - size.y * (usePivot ? rectTransform.pivot.y : 0.5f) - parentLeftBottom.y;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Bottom, posY, size.y);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, Vector2 pos, bool transform = true, bool usePivot = false)
        {
            pos = transform ? getPosByAdaptation(rectTransform, pos) : pos;
            setWorldPositionX(rectTransform, pos.x, false, usePivot);
            setWorldPositionY(rectTransform, pos.y, false, usePivot);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, float x, float y, bool transform = true, bool usePivot = false)
        {
            Vector2 pos = transform ? getPosByAdaptation(rectTransform, x, y) : new Vector2(x, y);
            setWorldPositionX(rectTransform, pos.x, false, usePivot);
            setWorldPositionY(rectTransform, pos.y, false, usePivot);
        }
    }
}