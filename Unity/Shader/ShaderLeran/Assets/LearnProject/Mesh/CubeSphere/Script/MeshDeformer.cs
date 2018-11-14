using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(MeshFilter))]
public class MeshDeformer : MonoBehaviour {

    private Mesh deformingMesh;
    private Vector3[] originalVertices, displacedVertices;
    private Vector3[] vertexVelocities;

    public float springForce = 20f;
    public float damping = 5f;
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
		for (int i = 0; i < originalVertices.Length; i++)
        {
            updateVertex(i);
        }
        deformingMesh.vertices = displacedVertices;
        deformingMesh.RecalculateNormals();
    }

    void updateVertex(int i)
    {
        Vector3 velocity = vertexVelocities[i];
        Vector3 displacement = displacedVertices[i] - originalVertices[i];
        velocity = velocity - displacement * springForce * Time.deltaTime;
        velocity = velocity * (1f - damping * Time.deltaTime);
        vertexVelocities[i] = velocity;
        displacedVertices[i] = displacedVertices[i] + velocity * Time.deltaTime;
    }

    public void addDeformingForce (Vector3 hitPoint, float force)
    {
        for (int i = 0; i < displacedVertices.Length; i++)
        {
            addForceToVertex(i, hitPoint, force);
        }
    }

    void addForceToVertex(int i, Vector3 hitPoint, float force)
    {
        Vector3 pointToVertex = displacedVertices[i] - hitPoint;
        float attenuatedForce = force / (1.0f + pointToVertex.sqrMagnitude);
        float velocity = attenuatedForce * Time.deltaTime;
        vertexVelocities[i] = vertexVelocities[i] + pointToVertex.normalized * velocity;
    }
}
