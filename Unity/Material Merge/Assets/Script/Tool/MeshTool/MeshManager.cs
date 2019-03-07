using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MeshTool
{
    public class MeshManager
    {
        private static MeshManager _instance = null;

        public struct MeshData
        {
            public Mesh mesh;
            public Material material;
        }

        public MeshManager()
        {

        }

        public static MeshManager GetInstance()
        {
            if (_instance == null)
            {
                _instance = new MeshManager();
            }

            return _instance;
        }

        public void CombineNormalMesh(GameObject[] gameObjects, GameObject gameObject, string meshName = "buildMesh")
        {
            List<MeshFilter> meshFilters = new List<MeshFilter>();
            List<MeshRenderer> meshRenderers = new List<MeshRenderer>();
            for (int i = 0; i < gameObjects.Length; i++)
            {
                meshFilters.Add(gameObjects[i].GetComponent<MeshFilter>());
                meshRenderers.Add(gameObjects[i].GetComponent<MeshRenderer>());
            }
            MeshData meshData = CombineNormalMesh(meshFilters.ToArray(), meshRenderers.ToArray(), meshName);
            if (meshData.mesh != null)
            {
                MeshFilter meshFilter = gameObject.GetComponent<MeshFilter>();
                if (meshFilter == null)
                {
                    meshFilter = gameObject.AddComponent<MeshFilter>();
                }
                meshFilter.sharedMesh = meshData.mesh;
            }
            if (meshData.material != null)
            {
                MeshRenderer meshRenderer = gameObject.GetComponent<MeshRenderer>();
                if (meshRenderer == null)
                {
                    meshRenderer = gameObject.AddComponent<MeshRenderer>();
                }
                meshRenderer.sharedMaterial = meshData.material;
                meshRenderer.sharedMaterials = new Material[1] { meshData.material };
            }
            //gameObject.transform.localRotation = new Quaternion();
        }

        //合并网格
        //非SkinnedMeshRenderer
        public MeshData CombineNormalMesh(MeshFilter[] meshFilters, MeshRenderer[] meshRenderers, string meshName = "buildMesh")
        {
            MeshData meshData = new MeshData();
            if (meshFilters.Length != meshRenderers.Length)
            {
                return meshData;
            }
            CombineInstance[] combine = new CombineInstance[meshFilters.Length];
            Mesh newMesh = new Mesh();
            //先合并图片
            Material newMaterial = MaterialManager.GetInstance().combinelMaterial(meshRenderers);
            if (newMaterial == null)
            {
                return meshData;
            }
            TextureManager.TextureData textureData = TextureManager.GetInstance().CombineTexture2D(meshRenderers);
            if (textureData.rects == null)
            {
                return meshData;
            }
            newMaterial.SetTexture("_MainTex", textureData.texture);
            //合并网格
            List<Vector2> uvs = new List<Vector2>();
            for (int i = 0; i < meshFilters.Length; i++)
            {
                Rect rect = textureData.rects[textureData.indexs[i]];
                Mesh meshCombine = meshFilters[i].sharedMesh;
                //Vector2[] uvs = new Vector2[meshCombine.uv.Length];
                //把网格的uv根据贴图的rect刷一遍
                for (int j = 0; j < meshCombine.uv.Length; j++)
                {
                    uvs.Add(new Vector2(Mathf.Lerp(rect.xMin, rect.xMax, meshCombine.uv[j].x),
                        Mathf.Lerp(rect.yMin, rect.yMax, meshCombine.uv[j].y)));
                }
                //meshCombine.uv = uvs;
                combine[i].mesh = meshCombine;
                combine[i].transform = meshFilters[i].transform.localToWorldMatrix;
                //meshFilters[i].gameObject.SetActive(false);
            }
            newMesh.CombineMeshes(combine, true, true);
            newMesh.uv = uvs.ToArray();
            newMesh.name = meshName;
            meshData.mesh = newMesh;
            meshData.material = newMaterial;
            return meshData;
        }
    }
}