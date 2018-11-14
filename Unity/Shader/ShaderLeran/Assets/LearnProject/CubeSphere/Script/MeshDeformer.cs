using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(MeshFilter))]
public class MeshDeformer : MonoBehaviour {

    private Mesh deformingMesh;
    private Vector3[] originalVertices, displacedVertices;
    private Vector3[] vertexVelocities;
    // Use this for initialization
    void Start ()
    {
        deformingMesh = GetComponent<MeshFilter>().mesh;
        originalVertices = deformingMesh.vertices;
        displacedVertices = new Vector3[originalVertices.Length];
        for (int i = 0; i < originalVertices.Length; i++)
        {
            displacedVertices[i] = originalVertices[i];
        }

        vertexVelocities = new Vector3[originalVertices.Length];
    }
	
	// Update is called once per frame
	void Update ()
    {
		
	}

    public void addDeformingForce (Vector3 hitPoint, float force)
    {
        for (int i = 0; i < displacedVertices.Length; i++)
        {

        }
    }

    void AddForceToVertex(int i, Vector3 point, float force)
    {

    }
}
