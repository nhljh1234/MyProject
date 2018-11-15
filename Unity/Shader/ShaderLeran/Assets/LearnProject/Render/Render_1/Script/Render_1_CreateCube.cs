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
        Matrix4x4 changeMatrix = new Matrix4x4();
        Matrix4x4 transformation = new Matrix4x4();
        for (int i = 0; i < cloneTransform.Length; i++)
        {
            //位移
            changeMatrix.SetRow(0, new Vector4(1f, 0f, 0f, changePos.x));
            changeMatrix.SetRow(1, new Vector4(0f, 1f, 0f, changePos.y));
            changeMatrix.SetRow(2, new Vector4(0f, 0f, 1f, changePos.z));
            changeMatrix.SetRow(3, new Vector4(0f, 0f, 0f, 1f));
            newPos = localPosArr[i];
            newPos = changeMatrix * new Vector4(newPos.x, newPos.y, newPos.z, 1f);
            //缩放
            changeMatrix.SetRow(0, new Vector4(changeScale.x, 0f, 0f, 0f));
            changeMatrix.SetRow(1, new Vector4(0f, changeScale.y, 0f, 0f));
            changeMatrix.SetRow(2, new Vector4(0f, 0f, changeScale.z, 0f));
            changeMatrix.SetRow(3, new Vector4(0f, 0f, 0f, 0f));
            newPos = changeMatrix * new Vector4(newPos.x, newPos.y, newPos.z, 1f);
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
            changeMatrix.SetColumn(0, new Vector4(cosY * cosZ, cosX * sinZ + sinX * sinY * cosZ, sinX * sinZ - cosX * sinY * cosZ, 0f));
            changeMatrix.SetColumn(1, new Vector4(-cosY * sinZ, cosX * cosZ - sinX * sinY * sinZ, sinX * cosZ + cosX * sinY * sinZ, 0f));
            changeMatrix.SetColumn(2, new Vector4(sinY, -sinX * cosY, cosX * cosY, 0f));
            changeMatrix.SetColumn(3, new Vector4(0f, 0f, 0f, 0f));
            newPos = changeMatrix * new Vector4(newPos.x, newPos.y, newPos.z, 1f);

            //矩阵变化
            transformation.SetRow(0, new Vector4(1f, 0f, 0f, 0f));
            transformation.SetRow(1, new Vector4(0f, 1f, 0f, 0f));
            transformation.SetRow(2, new Vector4(0f, 0f, 0f, 0f));
            transformation.SetRow(3, new Vector4(0f, 0f, 0f, 1f));

            newPos = transformation * newPos;

            cloneTransform[i].localPosition = newPos;
        }
	}
}
