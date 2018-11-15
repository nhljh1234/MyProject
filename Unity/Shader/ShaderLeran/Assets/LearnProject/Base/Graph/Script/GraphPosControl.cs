using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GraphPosControl : MonoBehaviour {

    public Transform prefab;
    private const int WIDTH_COUNT = 2;
    private const int MAX_NUM = WIDTH_COUNT * 40;
    private Transform[] gameObjectArr = new Transform[MAX_NUM];

	// Use this for initialization
	void Start ()
    {
        int i = 0;
        for (i = 0; i < MAX_NUM; i++)
        {
            gameObjectArr[i] = Instantiate(prefab);
            float scale = (2 * WIDTH_COUNT) / (float)MAX_NUM;
            gameObjectArr[i].localScale = new Vector3(scale, scale, scale);
            gameObjectArr[i].SetParent(transform);
        }
	}
	
	// Update is called once per frame
	void Update ()
    {
        int i = 0;
        for (i = 0; i < MAX_NUM; i++)
        {
            //设置位置
            Vector3 vec3 = new Vector3();
            vec3.x = (float)(i - MAX_NUM / (2 * WIDTH_COUNT)) * ((2 * WIDTH_COUNT) / (float)MAX_NUM);
            vec3.y = Mathf.Sin(Mathf.PI * (vec3.x + Time.time / 5));
            gameObjectArr[i].localPosition = vec3;
        }
    }
}
