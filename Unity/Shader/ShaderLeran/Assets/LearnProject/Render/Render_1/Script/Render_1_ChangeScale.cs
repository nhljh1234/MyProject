using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Render_1_ChangeScale : MonoBehaviour {

    public float x = 1f;
    public float y = 1f;
    public float z = 1f;

    // Use this for initialization
    void Start ()
    {
		
	}
	
	// Update is called once per frame
	void Update ()
    {
        transform.localScale = new Vector3(x, y, z);
	}
}
