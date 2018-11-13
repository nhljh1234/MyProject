using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class RoundedCube : MonoBehaviour {

    public int xSize = 4;
    public int ySize = 3;
    public int zSize = 5;
    public int roundness = 0;

    private Vector3[] normals;
    private Vector3[] vertices;
    private Vector2[] uv;
    private Color32[] cubeUV;
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
        for (int i = 0; i < vertices.Length; i++)
        {
            Gizmos.color = Color.black;
            Gizmos.DrawSphere(vertices[i], 0.1f);
            //Gizmos.color = Color.yellow;
            //Gizmos.DrawRay(vertices[i], normals[i]);
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
            totalNum = totalNum + 2 * xSize + 2 * (ySize - 2);
        }
        vertices = new Vector3[totalNum];
        normals = new Vector3[totalNum];
        uv = new Vector2[totalNum];
        cubeUV = new Color32[totalNum];
        int count = 0;
        //最前面
        for (x = 0; x < xSize; x++)
        {
            for (y = 0; y < ySize; y++)
            {
                SetVertex(count, x, y, 0);
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
                    SetVertex(count, x, y, z);
                    count++;
                }
            }
        }
        //最后面
        for (x = 0; x < xSize; x++)
        {
            for (y = 0; y < ySize; y++)
            {
                SetVertex(count, x, y, zSize - 1);
                count++;
            }
        }
        mesh.vertices = vertices;
        mesh.normals = normals;
        mesh.colors32 = cubeUV;
    }

    private void SetVertex(int i, int x, int y, int z)
    {
        Vector3 inner = vertices[i] = new Vector3(x, y, z);

        if (x < roundness)
        {
            inner.x = roundness;
        }
        else if (x > xSize - roundness)
        {
            inner.x = xSize - roundness;
        }
        if (y < roundness)
        {
            inner.y = roundness;
        }
        else if (y > ySize - roundness)
        {
            inner.y = ySize - roundness;
        }
        if (z < roundness)
        {
            inner.z = roundness;
        }
        else if (z > zSize - roundness)
        {
            inner.z = zSize - roundness;
        }

        normals[i] = (vertices[i] - inner).normalized;
        vertices[i] = inner + normals[i] * roundness;
        cubeUV[i] = new Color32((byte)x, (byte)y, (byte)z, 0);
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

    //这边要注意三角形的顺序，一般来说三个点顺时针方式是对前面可见的
    private void buildTriangles()
    {
        //int quads = ((xSize - 1) * (ySize - 1) + (ySize - 1) * (zSize - 1) + (xSize - 1) * (zSize - 1)) * 2;
        //int[] triangles = new int[quads * 6];
        int[] trianglesZ = new int[((xSize - 1) * (ySize - 1)) * 12];
        int[] trianglesX = new int[((ySize - 1) * (zSize - 1)) * 12];
        int[] trianglesY = new int[((xSize - 1) * (zSize - 1)) * 12];
        //最前面
        int x, y, z, trianglesCountX = 0, trianglesCountY = 0, trianglesCountZ = 0;
        for (x = 0; x < xSize - 1; x++)
        {
            for (y = 0; y < ySize - 1; y++)
            {
                trianglesZ[trianglesCountZ] = getIndex(x, y, 0);
                trianglesZ[trianglesCountZ + 1] = trianglesZ[trianglesCountZ + 4] = getIndex(x, y + 1, 0);
                trianglesZ[trianglesCountZ + 2] = trianglesZ[trianglesCountZ + 3] = getIndex(x + 1, y, 0);
                trianglesZ[trianglesCountZ + 5] = getIndex(x + 1, y + 1, 0);
                trianglesCountZ = trianglesCountZ + 6;
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
                    if (x == 0)
                    {
                        if (y < ySize - 1)
                        {
                            trianglesX[trianglesCountX] = getIndex(x, y, z);
                            trianglesX[trianglesCountX + 1] = trianglesX[trianglesCountX + 4] = getIndex(x, y + 1, z);
                            trianglesX[trianglesCountX + 2] = trianglesX[trianglesCountX + 3] = getIndex(x, y, z - 1);
                            trianglesX[trianglesCountX + 5] = getIndex(x, y + 1, z - 1);
                            trianglesCountX = trianglesCountX + 6;
                        }
                    } 
                    else if (x == xSize - 1)
                    {
                        if (y < ySize - 1)
                        {
                            trianglesX[trianglesCountX] = getIndex(x, y, z);
                            trianglesX[trianglesCountX + 1] = trianglesX[trianglesCountX + 4] = getIndex(x, y, z - 1);
                            trianglesX[trianglesCountX + 2] = trianglesX[trianglesCountX + 3] = getIndex(x, y + 1, z);
                            trianglesX[trianglesCountX + 5] = getIndex(x, y + 1, z - 1);
                            trianglesCountX = trianglesCountX + 6;
                        }
                    }
                    if (x > 0 && x <= xSize - 1)
                    {
                        if (y > 0 && y < ySize - 1)
                        {
                            continue;
                        }
                        if (y == ySize -1)
                        {
                            trianglesY[trianglesCountY] = getIndex(x, y, z);
                            trianglesY[trianglesCountY + 1] = trianglesY[trianglesCountY + 4] = getIndex(x, y, z - 1);
                            trianglesY[trianglesCountY + 2] = trianglesY[trianglesCountY + 3] = getIndex(x - 1, y, z);
                            trianglesY[trianglesCountY + 5] = getIndex(x - 1, y, z - 1);
                            trianglesCountY = trianglesCountY + 6;
                        }
                        else
                        {
                            trianglesY[trianglesCountY] = getIndex(x, y, z);
                            trianglesY[trianglesCountY + 1] = trianglesY[trianglesCountY + 4] = getIndex(x - 1, y, z);
                            trianglesY[trianglesCountY + 2] = trianglesY[trianglesCountY + 3] = getIndex(x, y, z - 1);
                            trianglesY[trianglesCountY + 5] = getIndex(x - 1, y, z - 1);
                            trianglesCountY = trianglesCountY + 6;
                        }
                    }
                }
            }
        }
        //最后面
        for (x = 0; x < xSize - 1; x++)
        {
            for (y = 0; y < ySize - 1; y++)
            {
                trianglesZ[trianglesCountZ] = getIndex(x, y, zSize - 1);
                trianglesZ[trianglesCountZ + 1] = trianglesZ[trianglesCountZ + 4] = getIndex(x + 1, y, zSize - 1);
                trianglesZ[trianglesCountZ + 2] = trianglesZ[trianglesCountZ + 3] = getIndex(x, y + 1, zSize - 1);
                trianglesZ[trianglesCountZ + 5] = getIndex(x + 1, y + 1, zSize - 1);
                trianglesCountZ = trianglesCountZ + 6;
            }
        }
        //mesh.triangles = triangles;
        mesh.subMeshCount = 3;
        mesh.SetTriangles(trianglesZ, 0);
        mesh.SetTriangles(trianglesX, 1);
        mesh.SetTriangles(trianglesY, 2);
    }
}
