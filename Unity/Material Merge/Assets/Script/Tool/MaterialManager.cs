using System.Collections.Generic;
using Spine;
using UnityEngine;

namespace MeshTool {
    public class MaterialManager {

        private static MaterialManager _instance = null;

        //缓存生成的material
        private Dictionary<string, Material> materialDir = new Dictionary<string, Material> ();

        public MaterialManager () {

        }

        public static MaterialManager GetInstance () {
            if (_instance == null) {
                _instance = new MaterialManager ();
            }
            return _instance;
        }

        //根据key移除缓存的material
        public void removeMaterialByKey (string key) {
            if (materialDir.ContainsKey (key)) {
                materialDir.Remove (key);
            }
        }

        public Material combinelMaterial (string key, MeshRenderer[] meshRenderers) {
            if (materialDir.ContainsKey (key)) {
                return materialDir[key];
            }
            List<Material> materials = new List<Material> ();
            for (int i = 0; i < meshRenderers.Length; i++) {
                for (int j = 0; j < meshRenderers[i].sharedMaterials.Length; j++) {
                    materials.Add (meshRenderers[i].sharedMaterials[j]);
                }
            }
            return combinelMaterial (key, materials.ToArray ());
        }

        //合并一个materials数组
        public Material combinelMaterial (string key, Material[] materials) {
            if (materialDir.ContainsKey (key)) {
                return materialDir[key];
            }
            if (materials.Length == 0) {
                return null;
            }
            if (materials.Length == 1) {
                if (materialDir.ContainsKey (key)) {
                    materialDir[key] = materials[0];
                    return materialDir[key];
                }
                materialDir.Add (key, materials[0]);
                return materialDir[key];
            }
            Material newMaterial = buildTotalMaterial (materials);
            if (materialDir.ContainsKey (key)) {
                materialDir[key] = newMaterial;
            } else {
                materialDir.Add (key, newMaterial);
            }
            return newMaterial;
        }

        private Material buildTotalMaterial (Material[] materials) {
            //return new Material();
            //先判断每个Material是否用了一个Shader，用了同样的shader才能合并
            Shader shader = materials[0].shader;
            for (int i = 1; i < materials.Length; i++) {
                if (!System.Object.Equals (shader, materials[i].shader)) {
                    return null;
                }
            }
            Material material = new Material (shader);
            material.CopyPropertiesFromMaterial (materials[0]);
            return material;
        }
    }
}