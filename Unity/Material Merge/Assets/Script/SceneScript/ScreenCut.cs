using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScreenCut : MonoBehaviour
{

    public Camera cameraUI;
    public Camera cameraCube;

    public Button buttonUI;
    public Button buttonCube;
    public Button buttonAll;

    // Use this for initialization
    void Start()
    {
		Rect rect = new Rect(0, 0, Screen.width, Screen.height);
        this.buttonUI.GetComponent<Button>().onClick.AddListener(() =>
        {
            TJ_UNITY_TOOL.ScreenCut.screenCut(new Camera[] { cameraUI }, Application.dataPath + "/Screenshot_ui.png", rect);
        });
        this.buttonCube.GetComponent<Button>().onClick.AddListener(() =>
        {
            TJ_UNITY_TOOL.ScreenCut.screenCut(new Camera[] { cameraCube }, Application.dataPath + "/Screenshot_cube.png", rect);
        });
        this.buttonAll.GetComponent<Button>().onClick.AddListener(() =>
        {
            TJ_UNITY_TOOL.ScreenCut.screenCut(new Camera[] { cameraUI, cameraCube }, Application.dataPath + "/Screenshot_all.png", rect);
        });
    }
}
