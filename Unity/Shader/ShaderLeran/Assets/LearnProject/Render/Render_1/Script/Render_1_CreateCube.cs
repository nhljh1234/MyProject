using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Render_1_CreateCube : MonoBehaviour {

    public Transform transformClone;
    public int size = 10;

	// Use this for initialization
	void Start ()
    {
        int x, y, z;
        for (x = 0; x < size; x++)
        {
            for (y = 0; y < size; y++)
            {
                for (z = 0; z < size; z++)
                {
                    Transform newTransform = Instantiate(transformClone);
                    newTransform.parent = transform;
                    newTransform.localPosition = new Vector3(x, y, z);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_Size", (float)size);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_x", (float)x);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_y", (float)y);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_z", (float)z);
                }
            }
        }
	}
	
	// Update is called once per frame
	void Update ()
    {
		
	}
}
