using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScrollView : MonoBehaviour
{

    public GameObject button;
    public GameObject content;

    // Use this for initialization
    void Start()
    {
        int buttonSize = 1000;
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
    }

    // Update is called once per frame
    void Update()
    {

    }
}
