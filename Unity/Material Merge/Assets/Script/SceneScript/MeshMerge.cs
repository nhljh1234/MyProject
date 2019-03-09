using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshMerge : MonoBehaviour {

    // Use this for initialization
    void Start () {
        List<GameObject> gameObjects = new List<GameObject> ();
        for (int i = 1; i <= 15; i++) {
            gameObjects.Add (GameObject.Find ("Cube_" + i));
            gameObjects[i - 1].SetActive (false);
        }
        MeshTool.MeshManager.GetInstance ().CombineNormalMesh (gameObjects.ToArray (), GameObject.Find ("GameObject"));
    }

    // Update is called once per frame
    void Update () {

    }
}