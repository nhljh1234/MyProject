using System.Collections.Generic;
using UnityEngine;

namespace MeshTool {
    public class TextureManager {
        private static TextureManager _instance = null;

        private Dictionary<string, TextureData> textureDir = new Dictionary<string, TextureData> ();

        public struct TextureData {
            public Texture2D texture;
            public Rect[] rects;
            //处理相同图集的情况
            public int[] indexs;
        }

        private struct TextureListData {
            public Texture2D[] textures;
            public int[] indexs;
        }

        public TextureManager () {

        }

        public static TextureManager GetInstance () {
            if (_instance == null) {
                _instance = new TextureManager ();
            }

            return _instance;
        }

        public void removeTexture (string key) {
            textureDir.Remove (key);
        }

        //合并图集
        public TextureData CombineTexture2D (string key, MeshRenderer[] meshRenderers) {
            if (textureDir.ContainsKey (key)) {
                return textureDir[key];
            }
            List<Material> materials = new List<Material> ();
            for (int i = 0; i < meshRenderers.Length; i++) {
                for (int j = 0; j < meshRenderers[i].sharedMaterials.Length; j++) {
                    materials.Add (meshRenderers[i].sharedMaterials[j]);
                }
            }
            return CombineTexture2D (key, materials.ToArray ());
        }

        public TextureData CombineTexture2D (string key, Material[] materials) {
            if (textureDir.ContainsKey (key)) {
                return textureDir[key];
            }
            List<Texture2D> textures = new List<Texture2D> ();
            for (int i = 0; i < materials.Length; i++) {
                textures.Add (materials[i].GetTexture ("_MainTex") as Texture2D);
            }
            return CombineTexture2D (key, textures.ToArray ());
        }

        public TextureData CombineTexture2D (string key, Texture2D[] textures) {
            //清理数据
            TextureListData textureListData = clearTextures (textures);
            textures = textureListData.textures;
            if (textureDir.ContainsKey (key)) {
                return textureDir[key];
            }
            int maxWidth = 0;
            for (int i = 0; i < textures.Length; i++)
            {
                maxWidth = maxWidth + Mathf.Min(textures[i].width, textures[i].height) + 10;
            }
            maxWidth = maxWidth / 2;
            Texture2D texture = new Texture2D(maxWidth, maxWidth);
            Rect[] rects = texture.PackTextures(textures, 10, maxWidth);
            TextureData data = new TextureData ();
            data.texture = texture;
            data.rects = rects;
            data.indexs = textureListData.indexs;
            textureDir.Add (key, data);
            return data;
        }

        //清理相同的图集，保证不会打进同一张图
        private TextureListData clearTextures (Texture2D[] textures) {
            TextureListData textureListData = new TextureListData ();
            List<Texture2D> newTextures = new List<Texture2D> ();
            int[] indexs = new int[textures.Length];
            for (int i = 0; i < textures.Length; i++) {
                int index = getTextureIndex (newTextures, textures[i]);
                if (index == -1) {
                    newTextures.Add (textures[i]);
                    indexs[i] = newTextures.Count - 1;
                } else {
                    indexs[i] = index;
                }
            }
            textureListData.textures = newTextures.ToArray ();
            textureListData.indexs = indexs;
            return textureListData;
        }

        //获取index
        private int getTextureIndex (List<Texture2D> textures, Texture2D texture) {
            for (int i = 0; i < textures.Count; i++) {
                if (System.Object.Equals (textures[i], texture)) {
                    return i;
                }
            }
            return -1;
        }
    }
}