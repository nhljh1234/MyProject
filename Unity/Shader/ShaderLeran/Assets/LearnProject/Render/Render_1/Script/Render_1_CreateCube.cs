using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Render_1_CreateCube : MonoBehaviour {

    public Transform transformClone;
    public int size = 10;

    private Vector3[] localPosArr;
    private Transform[] cloneTransform;

    public Vector3 changePos = new Vector3(1, 1, 1);
    public Vector3 changeScale = new Vector3(1, 1, 1);
    public Vector3 changeRotation = new Vector3(0, 0, 0);

    // Use this for initialization
    void Start ()
    {
        int x, y, z, count = 0;
        localPosArr = new Vector3[size * size * size];
        cloneTransform = new Transform[size * size * size];
        for (x = 0; x < size; x++)
        {
            for (y = 0; y < size; y++)
            {
                for (z = 0; z < size; z++)
                {
                    Transform newTransform = Instantiate(transformClone);
                    newTransform.parent = transform;
                    newTransform.localPosition = new Vector3(x - size / 2, y - size / 2, z - size / 2);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_Size", (float)size);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_x", (float)x);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_y", (float)y);
                    newTransform.GetComponent<MeshRenderer>().material.SetFloat("_z", (float)z);
                    localPosArr[count] = new Vector3(x - size / 2, y - size / 2, z - size / 2);
                    cloneTransform[count] = newTransform;
                    count++;
                }
            }
        }
	}
	
	// Update is called once per frame
	void Update ()
    {
        Vector3 newPos;
		for (int i = 0; i < cloneTransform.Length; i++)
        {
            //位移
            newPos = localPosArr[i] + changePos;
            //缩放
            newPos.x = newPos.x * changeScale.x;
            newPos.y = newPos.y * changeScale.y;
            newPos.z = newPos.z * changeScale.z;
            //旋转
            float radX = changeRotation.x * Mathf.Deg2Rad;
            float radY = changeRotation.y * Mathf.Deg2Rad;
            float radZ = changeRotation.z * Mathf.Deg2Rad;
            float sinX = Mathf.Sin(radX);
            float cosX = Mathf.Cos(radX);
            float sinY = Mathf.Sin(radY);
            float cosY = Mathf.Cos(radY);
            float sinZ = Mathf.Sin(radZ);
            float cosZ = Mathf.Cos(radZ);
            Vector3 xAxis = new Vector3(
                cosY * cosZ,
                cosX * sinZ + sinX * sinY * cosZ,
                sinX * sinZ - cosX * sinY * cosZ
            );
            Vector3 yAxis = new Vector3(
                -cosY * sinZ,
                cosX * cosZ - sinX * sinY * sinZ,
                sinX * cosZ + cosX * sinY * sinZ
            );
            Vector3 zAxis = new Vector3(
                sinY,
                -sinX * cosY,
                cosX * cosY
            );
            newPos = xAxis* newPos.x + yAxis * newPos.y + zAxis * newPos.z;
            cloneTransform[i].localPosition = newPos;
        }
	}
}
