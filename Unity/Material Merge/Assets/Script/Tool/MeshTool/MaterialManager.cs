using System.Collections.Generic;
using UnityEngine;

namespace TJ_UNITY_TOOL
{
    public class MaterialManager
    {

        private static MaterialManager _instance = null;

        private MaterialManager()
        {

        }

        public static MaterialManager GetInstance()
        {
            if (_instance == null)
            {
                _instance = new MaterialManager();
            }
            return _instance;
        }

        public Material combinelMaterial(MeshRenderer[] meshRenderers)
        {
            List<Material> materials = new List<Material>();
            for (int i = 0; i < meshRenderers.Length; i++)
            {
                for (int j = 0; j < meshRenderers[i].sharedMaterials.Length; j++)
                {
                    materials.Add(meshRenderers[i].sharedMaterials[j]);
                }
            }
            return combinelMaterial(materials.ToArray());
        }

        //合并一个materials数组
        public Material combinelMaterial(Material[] materials)
        {
            if (materials.Length == 0)
            {
                return null;
            }
            if (materials.Length == 1)
            {
                return materials[0];
            }
            return buildTotalMaterial(materials);
        }

        private Material buildTotalMaterial(Material[] materials)
        {
            //return new Material();
            //先判断每个Material是否用了一个Shader，用了同样的shader才能合并
            Shader shader = materials[0].shader;
            for (int i = 1; i < materials.Length; i++)
            {
                if (!System.Object.Equals(shader, materials[i].shader))
                {
                    return null;
                }
            }
            Material material = new Material(shader);
            material.CopyPropertiesFromMaterial(materials[0]);
            return material;
        }
    }
}