using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Fractal : MonoBehaviour {

    public Material material;
    public Mesh mesh;

    private int MAX_DEPTH = 4;
    private int nowDepth = 1;
    private Vector3 direction;

    public float childScale = 0.5f;

    // Use this for initialization
    void Start ()
    {
        gameObject.AddComponent<MeshFilter>().mesh = mesh;
        gameObject.AddComponent<MeshRenderer>().material = material;
        if (nowDepth >= MAX_DEPTH)
        {
            return;
        }
        if (direction != Vector3.up)
        {
            new GameObject("Fractal Child").AddComponent<Fractal>().Initialize(this, Vector3.down);
        }
        if (direction != Vector3.right)
        {
            new GameObject("Fractal Child").AddComponent<Fractal>().Initialize(this, Vector3.left);
        }
        if (direction != Vector3.down)
        {
            new GameObject("Fractal Child").AddComponent<Fractal>().Initialize(this, Vector3.up);
        }
        if (direction != Vector3.left)
        {
            new GameObject("Fractal Child").AddComponent<Fractal>().Initialize(this, Vector3.right);
        }
    }
	
	// Update is called once per frame
	void Update ()
    {
		
	}

    private void Initialize(Fractal parent, Vector3 directionIn)
    {
        nowDepth = parent.nowDepth + 1;
        material = parent.material;
        mesh = parent.mesh;
        transform.parent = parent.transform;
        //子节点缩放
        childScale = parent.childScale;
        transform.localScale = new Vector3(childScale, childScale, childScale);
        transform.localPosition = directionIn * (0.5f + childScale / 2.0f);
        direction = directionIn;
    }
}
