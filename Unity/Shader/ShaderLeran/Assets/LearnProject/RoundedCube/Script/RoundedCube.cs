using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class RoundedCube : MonoBehaviour {

    public int xSize = 4;
    public int ySize = 3;
    public int zSize = 5;

    private Vector3[] vertices;
    private Mesh mesh;

	// Use this for initialization
	void Start ()
    {
		
	}
	
	// Update is called once per frame
	void Update ()
    {
		
	}

    private void Awake ()
    {
        Generate();
    }

    private void OnDrawGizmos ()
    {
        if (vertices == null)
        {
            return;
        }
        Gizmos.color = Color.black;
        for (int i = 0; i < vertices.Length; i++)
        {
            Gizmos.DrawSphere(vertices[i], 0.1f);
        }
    }

    private void Generate()
    {
        GetComponent<MeshFilter>().mesh = mesh = new Mesh();
        mesh.name = "Procedural Cube";
        buildVertices();
        buildTriangles();
    }

    private void buildVertices()
    {
        int totalNum = 0, x, y, z;
        totalNum = totalNum + xSize * ySize * 2;
        for (z = 0; z < zSize - 2; z++)
        {
            totalNum = totalNum + 2 * xSize + 2 * (ySize - 1);
        }
        vertices = new Vector3[totalNum];
        int count = 0;
        //最前面
        for (x = 0; x < xSize; x++)
        {
            for (y = 0; y < ySize; y++)
            {
                vertices[count] = new Vector3(x, y, 0);
                count++;
            }
        }
        //中间
        for (z = 1; z < zSize - 1; z++)
        {
            for (x = 0; x < xSize; x++)
            {
                for (y = 0; y < ySize; y++)
                {
                    if (x > 0 && x < xSize - 1)
                    {
                        if (y > 0 && y < ySize - 1)
                        {
                            continue;
                        }
                    }
                    vertices[count] = new Vector3(x, y, z);
                    count++;
                }
            }
        }
        //最后面
        for (x = 0; x < xSize; x++)
        {
            for (y = 0; y < ySize; y++)
            {
                vertices[count] = new Vector3(x, y, zSize - 1);
                count++;
            }
        }
        mesh.vertices = vertices;
    }

    private int getIndex (int x, int y, int z)
    {
        int i, index = 0;
        for (i = 0; i < z; i++)
        {
            if (i == 0)
            {
                index = index + xSize * ySize;
            }
            else
            {
                index = index + 2 * ySize + 2 * (xSize - 2);
            }
        }
        if (z == 0 || z == zSize - 1)
        {
            index = index + x * ySize + y;
        }
        else
        {
            for (i = 0; i < x; i++)
            {
                if (i == 0)
                {
                    index = index + ySize;
                }
                else
                {
                    index = index + 2;
                }
            }
            if (x == 0 || x == xSize - 1)
            {
                index = index + y;
            }
            else
            {
                index = index + (y == 0 ? 0 : 1);
            }
        }
        return index;
    }

    private void buildTriangles()
    {
        int quads = ((xSize - 1) * (ySize - 1) + (ySize - 1) * (zSize - 1) + (xSize - 1) * (zSize - 1)) * 2;
        int[] triangles = new int[quads * 6];
        //最前面
        int x, y, z, trianglesCount = 0;
        for (x = 0; x < xSize - 1; x++)
        {
            for (y = 0; y < ySize - 1; y++)
            {
                triangles[trianglesCount] = getIndex(x, y, 0);
                triangles[trianglesCount + 1] = triangles[trianglesCount + 4] = getIndex(x + 1, y, 0);
                triangles[trianglesCount + 2] = triangles[trianglesCount + 3] = getIndex(x, y + 1, 0);
                triangles[trianglesCount + 5] = getIndex(x + 1, y + 1, 0);
                trianglesCount = trianglesCount + 6;
            }
        }
        //中间
        for (z = 1; z < zSize; z++)
        {
            for (x = 0; x < xSize; x++)
            {
                for (y = 0; y < ySize; y++)
                {
                    if (x > 0 && x < xSize - 1)
                    {
                        if (y > 0 && y < ySize - 1)
                        {
                            continue;
                        }
                    }
                    if (x == 0 || x == xSize - 1)
                    {
                        if (y < ySize - 1)
                        {
                            triangles[trianglesCount] = getIndex(x, y, z);
                            triangles[trianglesCount + 1] = triangles[trianglesCount + 4] = getIndex(x, y + 1, z);
                            triangles[trianglesCount + 2] = triangles[trianglesCount + 3] = getIndex(x, y, z - 1);
                            triangles[trianglesCount + 5] = getIndex(x, y + 1, z - 1);
                            trianglesCount = trianglesCount + 6;
                        }
                    }
                    if (x > 0 && x <= xSize - 1)
                    {
                        if (y > 0 && y < ySize - 1)
                        {
                            continue;
                        }
                        triangles[trianglesCount] = getIndex(x, y, z);
                        triangles[trianglesCount + 1] = triangles[trianglesCount + 4] = getIndex(x, y, z - 1);
                        triangles[trianglesCount + 2] = triangles[trianglesCount + 3] = getIndex(x - 1, y, z);
                        triangles[trianglesCount + 5] = getIndex(x - 1, y, z - 1);
                        print(triangles[trianglesCount]);
                        print(triangles[trianglesCount + 1]);
                        print(triangles[trianglesCount + 2]);
                        print(triangles[trianglesCount + 3]);
                        print(triangles[trianglesCount + 4]);
                        print(triangles[trianglesCount + 5]);
                        trianglesCount = trianglesCount + 6;
                    }
                }
            }
        }
        //最后面
        for (x = 0; x < xSize - 1; x++)
        {
            for (y = 0; y < ySize - 1; y++)
            {
                triangles[trianglesCount] = getIndex(x, y, zSize - 1);
                triangles[trianglesCount + 1] = triangles[trianglesCount + 4] = getIndex(x + 1, y, zSize - 1);
                triangles[trianglesCount + 2] = triangles[trianglesCount + 3] = getIndex(x, y + 1, zSize - 1);
                triangles[trianglesCount + 5] = getIndex(x + 1, y + 1, zSize - 1);
                trianglesCount = trianglesCount + 6;
            }
        }
        mesh.triangles = triangles;
    }
}
