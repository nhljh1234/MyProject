using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace TJ_UNITY_TOOL {
    public class ScrollViewTool : MonoBehaviour {
        private class TransformData {
            public Transform transform;
            public int index = -1;
        }
        //滑动列表节点
        public Transform scrollview;
        //content节点
        public Transform content;
        //克隆节点
        public Transform tmp;
        //滑动方式
        public ScrollType scrollType = ScrollType.VERTICAL;
        //节点间距
        public int offset = 0;
        //节点高度/宽度
        public int itemSize = 0;
        //初始化的位置
        public Vector2 initPos;

        //存储的节点，这边就是用于显示的节点
        private TransformData[] transformDatas;

        //水平
        public static int HORIZONTAL = 1;
        //垂直
        public static int VERTICAL = 2;

        public enum ScrollType {
            //水平
            HORIZONTAL = 1,
            //竖直
            VERTICAL = 2,
        }
        public delegate void UpdateListItemEvent (Transform item, int index);
        private UpdateListItemEvent _updateItem = null;

        public void initData (UpdateListItemEvent updateItem) {
            _updateItem = updateItem;
        }

        //初始化显示
        public void startShow (int showItemNum) {
            showList (showItemNum);
            initItemPos ();
            //保证只监听一次
            scrollview.GetComponent<ScrollRect> ().onValueChanged.RemoveListener (OnValueChange);
            scrollview.GetComponent<ScrollRect> ().onValueChanged.AddListener (OnValueChange);
        }

        //刷新显示
        public void refresh (int showItemNum) {
            showList (showItemNum);
        }

        //监听值变化
        private void OnValueChange (Vector2 pos) {
            //计算需要显示的最小的index
            int minIndex = getMinIndex ();
            //获取所有超出屏幕的节点
            TransformData[] changePosTransforms = getOverViewTransformDatas (minIndex);
            if (changePosTransforms.Length == 0) {
                return;
            }
            int count = 0;
            for (int i = minIndex; i < minIndex + transformDatas.Length; i++) {
                if (!judgeHaveIndex (i)) {
                    if (count >= changePosTransforms.Length) {
                        print ("error! changePosTransforms less than need!");
                        continue;
                    }
                    updateItemData (changePosTransforms[count], i);
                    count++;
                }
            }
            //_updateItem(changePosTransform, newIndex);
        }

        private void updateItemData (TransformData transformData, int index) {
            if (scrollType == ScrollType.HORIZONTAL) {
                transformData.transform.localPosition = new Vector2 (initPos.x + (itemSize + offset) * index, initPos.y);
                transformData.index = index;
                _updateItem (transformData.transform, index);
            } else {
                transformData.transform.localPosition = new Vector2 (initPos.x, initPos.y - (itemSize + offset) * index);
                transformData.index = index;
                _updateItem (transformData.transform, index);
            }
        }

        private bool judgeHaveIndex (int index) {
            for (int i = 0; i < transformDatas.Length; i++) {
                if (transformDatas[i].index == index) {
                    return true;
                }
            }
            return false;
        }

        private int getMinIndex () {
            if (scrollType == ScrollType.HORIZONTAL) {
                return Mathf.FloorToInt (Mathf.Abs (content.localPosition.x) / (itemSize + offset));
            } else {
                return Mathf.FloorToInt (Mathf.Abs (content.localPosition.y) / (itemSize + offset));
            }
        }
        //获取所有超出屏幕的节点
        private TransformData[] getOverViewTransformDatas (int minIndex) {
            List<TransformData> changePosTransforms = new List<TransformData> ();
            for (int i = 0; i < transformDatas.Length; i++) {
                if (transformDatas[i].index < minIndex || transformDatas[i].index >= (minIndex + transformDatas.Length)) {
                    changePosTransforms.Add (transformDatas[i]);
                }
            }
            return changePosTransforms.ToArray ();
        }

        //初始化位置
        private void initItemPos () {
            for (int i = 0; i < transformDatas.Length; i++) {
                updateItemData (transformDatas[i], i);
            }
        }

        //显示列表
        private void showList (int showItemNum) {
            int showNum = (int) Mathf.Min (mathItemNum (), showItemNum);
            buildShowArray (showNum);
            updateContentSize (showItemNum);
        }

        //更新content节点的尺寸
        private void updateContentSize (int showItemNum) {
            int newSize = showItemNum * itemSize + (showItemNum - 1) * offset;
            RectTransform rectTransform = content.GetComponent<RectTransform> ();
            if (scrollType == ScrollType.HORIZONTAL) {
                rectTransform.sizeDelta = new Vector2 (newSize, rectTransform.sizeDelta.y);
            } else {
                rectTransform.sizeDelta = new Vector2 (rectTransform.sizeDelta.x, newSize);
            }
            //更改锚点属性
            rectTransform.anchorMin = new Vector2 (0, 1);
            rectTransform.anchorMax = new Vector2 (0, 1);
            rectTransform.pivot = new Vector2 (0, 1);
        }

        //初始化用于显示的节点数组
        private void buildShowArray (int showNum) {
            transformDatas = new TransformData[showNum];
            for (int i = 0; i < transformDatas.Length; i++) {
                transformDatas[i] = new TransformData ();
            }
            //隐藏不用的节点
            for (int i = showNum - 1; i < content.childCount; i++) {
                content.GetChild (i).gameObject.SetActive (false);
            }
            //看看tmp的父节点上面有没有足够的节点
            for (int i = 0; i < showNum && i < content.childCount; i++) {
                transformDatas[i].transform = content.GetChild (i);
                transformDatas[i].transform.gameObject.SetActive (true);
                transformDatas[i].transform.localPosition = initPos;
            }
            //不够的话就新建
            for (int i = content.transform.childCount; i < showNum; i++) {
                Transform newObject = Instantiate (tmp);
                //绑定节点
                newObject.SetParent (content);
                //放进显示的列表
                transformDatas[i].transform = newObject;
                transformDatas[i].transform.gameObject.SetActive (true);
                transformDatas[i].transform.localPosition = initPos;
            }
        }

        private int mathItemNum () {
            float maskHeigth = scrollview.GetComponent<RectTransform> ().sizeDelta.y;
            return ((int) Mathf.Ceil (maskHeigth / (itemSize + offset))) + 1;
        }
    }

}