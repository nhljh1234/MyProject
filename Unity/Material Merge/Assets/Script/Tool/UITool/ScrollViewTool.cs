using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScrollViewTool : MonoBehaviour
{

    //滑动列表节点
    private GameObject _scrollview;
    //克隆节点
    private GameObject _tmp;
    //content节点
    private GameObject _content;
    //滑动方式
    private int _scrollMode;
    //节点间距
    private int _offset = 0;
    //节点高度/宽度
    private int _itemSize = 0;

    //存储的节点，这边就是用于显示的节点
    private GameObject[] gameObjects;

    //水平
    public static int HORIZONTAL = 1;
    //垂直
    public static int VERTICAL = 2;

    public delegate void UpdateListItemEvent(Transform item, int index);
    private UpdateListItemEvent _updateItem = null;

    public void initData(GameObject scrollview, GameObject tmp, GameObject content, int scrollMode,
        int offsetNum, int itemSize, UpdateListItemEvent updateItem)
    {
        _scrollview = scrollview;
        _tmp = tmp;
        _content = content;
        _scrollMode = scrollMode == HORIZONTAL ? HORIZONTAL : VERTICAL;
        _offset = offsetNum;
        _itemSize = itemSize;
        _updateItem = updateItem;
    }

    //初始化显示
    public void startShow(int showItemNum)
    {

    }

    //刷新显示
    public void refresh(int showItemNum)
    {

    }

    private void showList(int showItemNum)
    {
        int showNum = (int)Mathf.Min(mathItemNum(), showItemNum);
        buildShowArray(showNum);
        //
    }

    //初始化用于显示的节点数组
    private void buildShowArray(int showNum)
    {
        gameObjects = new GameObject[showNum];
        //隐藏不用的节点
        for (int i = showNum - 1; i < _content.transform.childCount; i++)
        {
            _content.transform.GetChild(i).gameObject.SetActive(false);
        }
        //看看tmp的父节点上面有没有足够的节点
        for (int i = 0; i < showNum && i < _content.transform.childCount; i++)
        {
            gameObjects[i] = _content.transform.GetChild(i).gameObject;
            gameObjects[i].SetActive(true);
        }
        //不够的话就新建
        for (int i = _content.transform.childCount; i < showNum; i++)
        {
            GameObject newObject = Instantiate(_tmp);
            //绑定节点
            newObject.transform.SetParent(_content.transform);
            //放进显示的列表
            gameObjects[i] = newObject;
            gameObjects[i].SetActive(true);
        }
    }

    private int mathItemNum()
    {
        float maskHeigth = _scrollview.GetComponent<RectTransform>().sizeDelta.y;
        return ((int)Mathf.Ceil(maskHeigth / (_itemSize + _offset))) + 1;
    }
}
