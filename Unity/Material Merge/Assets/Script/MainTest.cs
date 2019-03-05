using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainTest : MonoBehaviour {

	// Use this for initialization
	void Start () {
        return;
		List<GameObject> gameObjects = new List<GameObject> ();
		for (int i = 1; i <= 15; i++) {
			gameObjects.Add(GameObject.Find("Cube_" + i));
			gameObjects[i - 1].SetActive(false);
		}
		GameObject gameObjectTotal = GameObject.Find("GameObject");
		gameObjectTotal.SetActive(true);
		MeshTool.MeshManager.GetInstance().CombineNormalMesh("1234", gameObjects.ToArray(), gameObjectTotal);
	}

	// Update is called once per frame
	void Update () {

	}
}