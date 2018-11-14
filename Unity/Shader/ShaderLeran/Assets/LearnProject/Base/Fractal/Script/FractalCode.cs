using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FractalCode : MonoBehaviour {

    public Material material;
    public Mesh mesh;

    private int MAX_DEPTH = 7;
    private int nowDepth = 1;
    private Vector3 direction;

    public float childScale = 0.5f;

    private Material[] materialArr = null;

    private void InitializeMaterials () {
        materialArr = new Material[MAX_DEPTH + 1];
		for (int i = 0; i <= MAX_DEPTH; i++) {
            materialArr[i] = new Material(material);
            materialArr[i].color =
				Color.Lerp(Color.white, Color.yellow, (float)i / MAX_DEPTH);
		}
	}

    // Use this for initialization
    void Start ()
    {
        if (materialArr == null)
        {
            InitializeMaterials();
        }
        gameObject.AddComponent<MeshFilter>().mesh = mesh;
        gameObject.AddComponent<MeshRenderer>().material = materialArr[nowDepth];
        if (nowDepth >= MAX_DEPTH)
        {
            return;
        }
        StartCoroutine(CreateChildren());
    }
	
	// Update is called once per frame
	void Update ()
    {
		
	}

    private void Initialize(FractalCode parent, Vector3 directionIn)
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
        materialArr = parent.materialArr;
    }

    private IEnumerator CreateChildren ()
    {
        if (direction != Vector3.up)
        {
            yield return new WaitForSeconds(0.5f);
            new GameObject("Fractal Child").AddComponent<FractalCode>().Initialize(this, Vector3.down);
        }
        if (direction != Vector3.right)
        {
            yield return new WaitForSeconds(0.5f);
            new GameObject("Fractal Child").AddComponent<FractalCode>().Initialize(this, Vector3.left);
        }
        if (direction != Vector3.down)
        {
            yield return new WaitForSeconds(0.5f);
            new GameObject("Fractal Child").AddComponent<FractalCode>().Initialize(this, Vector3.up);
        }
        if (direction != Vector3.left)
        {
            yield return new WaitForSeconds(0.5f);
            new GameObject("Fractal Child").AddComponent<FractalCode>().Initialize(this, Vector3.right);
        }
    }
}
