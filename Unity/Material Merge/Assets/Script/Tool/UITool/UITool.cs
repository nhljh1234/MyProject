using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL {
    public class UITool {
        //获取左下角点的本地坐标
        public static Vector3 getlocalLeftBottomPos(RectTransform rectTransform) {
            Vector3[] corners = new Vector3[4];
            rectTransform.GetLocalCorners(corners);
            return corners[0];
        }

        //获取左下角点的世界坐标
        public static Vector3 getWorldLeftBottomPos(RectTransform rectTransform) {
            Vector3[] corners = new Vector3[4];
            rectTransform.GetWorldCorners(corners);
            return corners[0];
        }

        //获取一个节点的本地坐标
        public static Vector3 getLocalPosition(RectTransform rectTransform) {
            Vector3 vector = new Vector3();
            if (!rectTransform) {
                return vector;
            }
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getlocalLeftBottomPos(rectTransform);
            vector.x = leftBottomPos.x + 0.5f * size.x;
            vector.y = leftBottomPos.y + 0.5f * size.y;
            vector.z = leftBottomPos.z;
            return vector;
        }

        //获取一个节点的世界坐标
        public static Vector3 getWorldPosition(RectTransform rectTransform) {
            Vector3 worldPosition = new Vector3();
            if (!rectTransform) {
                return worldPosition;
            }
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getWorldLeftBottomPos(rectTransform);
            worldPosition.x = leftBottomPos.x + 0.5f * size.x;
            worldPosition.y = leftBottomPos.y + 0.5f * size.y;
            worldPosition.z = leftBottomPos.z;
            return worldPosition;
        }

        //获取一个节点锚点的本地坐标
        public static Vector3 getLocalPivotPosition(RectTransform rectTransform) {
            Vector3 vector = new Vector3();
            if (!rectTransform) {
                return vector;
            }
            Vector3[] corners = new Vector3[4];
            //获取本地坐标
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getlocalLeftBottomPos(rectTransform);
            vector.x = leftBottomPos.x + rectTransform.pivot.x * size.x;
            vector.y = leftBottomPos.y + rectTransform.pivot.y * size.y;
            vector.z = leftBottomPos.z;
            return vector;
        }

        //获取一个节点的世界坐标
        public static Vector3 getWorldPivotPosition(RectTransform rectTransform) {
            Vector3 worldPosition = new Vector3();
            if (!rectTransform) {
                return worldPosition;
            }
            Vector3[] corners = new Vector3[4];
            //获取本地坐标
            Vector2 size = getSize(rectTransform);
            Vector3 leftBottomPos = getWorldLeftBottomPos(rectTransform);
            worldPosition.x = leftBottomPos.x + rectTransform.pivot.x * size.x;
            worldPosition.y = leftBottomPos.y + rectTransform.pivot.y * size.y;
            worldPosition.z = leftBottomPos.z;
            return worldPosition;
        }

        //获取一个节点的尺寸
        public static Vector2 getSize(RectTransform rectTransform) {
            Vector2 vector = new Vector2();
            if (!rectTransform) {
                return vector;
            }
            vector.x = rectTransform.rect.width;
            vector.y = rectTransform.rect.height;
            return vector;
        }

        //设置UI的宽度
        public static void setWidth(RectTransform rectTransform, float width) {
            rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, width);
        }
        //设置UI的高度
        public static void setHeight(RectTransform rectTransform, float height) {
            rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, height);
        }
        //设置一个节点的尺寸
        public static void setSize(RectTransform rectTransform, Vector2 size) {
            setWidth(rectTransform, size.x);
            setHeight(rectTransform, size.y);
        }
        //设置一个节点的尺寸
        public static void setSize(RectTransform rectTransform, float width, float height) {
            setWidth(rectTransform, width);
            setHeight(rectTransform, height);
        }

        //设置本地坐标
        public static void setLocalPositionX(RectTransform rectTransform, float x, bool usePivot = false) {
            Vector2 size = getSize(rectTransform);
            float posX = x - size.x * (usePivot ? rectTransform.pivot.x : 0.5f);
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, posX, size.x);
        }
        //设置本地坐标
        public static void setLocalPositionY(RectTransform rectTransform, float y, bool usePivot = false) {
            Vector2 size = getSize(rectTransform);
            float posY = y - size.y * (usePivot ? rectTransform.pivot.y : 0.5f);
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Bottom, posY, size.y);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, Vector2 pos, bool usePivot = false) {
            setLocalPositionX(rectTransform, pos.x, usePivot);
            setLocalPositionY(rectTransform, pos.y, usePivot);
        }
        //设置本地坐标
        public static void setLocalPosition(RectTransform rectTransform, float x, float y, bool usePivot = false) {
            setLocalPositionX(rectTransform, x, usePivot);
            setLocalPositionY(rectTransform, y, usePivot);
        }

        //设置全局坐标
        public static void setWorldPositionX(RectTransform rectTransform, float x, bool usePivot = false) {
            RectTransform parentRectTransform = rectTransform.parent.GetComponent<RectTransform>();
            Vector3 parentLeftBottom = getWorldLeftBottomPos(parentRectTransform);
            Vector2 size = getSize(rectTransform);
            float posX = x - size.x * (usePivot ? rectTransform.pivot.x : 0.5f) - parentLeftBottom.x;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, posX, size.x);
        }
        //设置全局坐标
        public static void setWorldPositionY(RectTransform rectTransform, float y, bool usePivot = false) {
            RectTransform parentRectTransform = rectTransform.parent.GetComponent<RectTransform>();
            Vector3 parentLeftBottom = getWorldLeftBottomPos(parentRectTransform);
            Vector2 size = getSize(rectTransform);
            float posY = y - size.y * (usePivot ? rectTransform.pivot.y : 0.5f) - parentLeftBottom.y;
            rectTransform.SetInsetAndSizeFromParentEdge(RectTransform.Edge.Bottom, posY, size.y);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, Vector2 pos, bool usePivot = false) {
            setWorldPositionX(rectTransform, pos.x, usePivot);
            setWorldPositionY(rectTransform, pos.y, usePivot);
        }
        //设置全局坐标
        public static void setWorldPosition(RectTransform rectTransform, float x, float y, bool usePivot = false) {
            setWorldPositionX(rectTransform, x, usePivot);
            setWorldPositionY(rectTransform, y, usePivot);
        }
    }
}