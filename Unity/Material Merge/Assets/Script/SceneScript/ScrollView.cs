using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScrollView : MonoBehaviour
{

    public GameObject scrollview;

    // Use this for initialization
    void Start()
    {
        int buttonSize = 1000;
        /**
        //修改第一个
        TJ_UNITY_TOOL.GameObjectTool.findChild(button.transform, "Text").GetComponent<Text>().text = "0";
        for (int i = 0; i < buttonSize - 1; i++)
        {
			GameObject newButton = Instantiate(button);
            newButton.name = "Button";
			newButton.transform.SetParent(content.transform);
            //修改字符串
            TJ_UNITY_TOOL.GameObjectTool.findChild(newButton.transform, "Text").GetComponent<Text>().text = "" + (i + 1);
        }
        //重新计算位置
        RectTransform rectTransform = content.GetComponent<RectTransform>();
        rectTransform.sizeDelta = new Vector2(rectTransform.sizeDelta.x, buttonSize * content.GetComponent<GridLayoutGroup>().cellSize.y);
        **/
        UGUI_TOOL.ScrollViewTool scrollviewTool = scrollview.GetComponent<UGUI_TOOL.ScrollViewTool>();
        scrollviewTool.initData((item, index) =>
        {
            Transform transform = TJ_UNITY_TOOL.GameObjectTool.findChild(item, "Text");
            item.name = "" + index;
            transform.GetComponent<Text>().text = "" + index;
        });
        if (scrollviewTool != null)
        {
            scrollviewTool.startShow(buttonSize);
        }
    }

    // Update is called once per frame
    void Update()
    {

    }
}
