using System;
using System.Collections.Generic;
using UnityEngine;

namespace TJ_UNITY_TOOL
{
    public class TextureManager
    {
        private static int sizeMax = 12;
        private static int sizeMin = 5;
        private static TextureManager _instance = null;

        private static int[] sizes = null;

        public struct TextureData
        {
            public Texture2D texture;
            public Rect[] rects;
            //处理相同图集的情况
            public int[] indexs;
        }

        private struct TextureListData
        {
            public Texture2D[] textures;
            public int[] indexs;
        }

        private TextureManager()
        {

        }

        public static TextureManager GetInstance()
        {
            if (_instance == null)
            {
                _instance = new TextureManager();
                List<int> sizeList = new List<int>();
                for (int i = sizeMin; i <= sizeMax; i++)
                {
                    sizeList.Add((int)Math.Pow(2, i));
                }
                sizes = sizeList.ToArray();
            }

            return _instance;
        }

        //合并图集
        public TextureData CombineTexture2D(MeshRenderer[] meshRenderers)
        {
            List<Material> materials = new List<Material>();
            for (int i = 0; i < meshRenderers.Length; i++)
            {
                for (int j = 0; j < meshRenderers[i].sharedMaterials.Length; j++)
                {
                    materials.Add(meshRenderers[i].sharedMaterials[j]);
                }
            }
            return CombineTexture2D(materials.ToArray());
        }

        public TextureData CombineTexture2D(Material[] materials)
        {
            List<Texture2D> textures = new List<Texture2D>();
            for (int i = 0; i < materials.Length; i++)
            {
                Texture2D tx = materials[i].GetTexture("_MainTex") as Texture2D;
                textures.Add(tx);
            }
            return CombineTexture2D(textures.ToArray());
        }

        public TextureData CombineTexture2D(Texture2D[] textures)
        {
            //清理数据
            TextureData data = new TextureData();
            TextureListData textureListData = clearTextures(textures);
            textures = textureListData.textures;
            Texture2D[] newTextures = new Texture2D[textureListData.textures.Length];
            for (int i = 0; i < newTextures.Length; i++)
            {
                Texture2D tx2D = new Texture2D(textures[i].width, textures[i].height, TextureFormat.ARGB32, false);
                tx2D.SetPixels(textures[i].GetPixels(0, 0, textures[i].width, textures[i].height));
                tx2D.Apply();
                newTextures[i] = tx2D;
            }
            int acreage = 0;
            int size = 1024;
            bool doubleFlag = false;
            for (int i = 0; i < newTextures.Length; i++)
            {
                acreage = acreage + newTextures[i].width * newTextures[i].height;
            }
            for (int i = 0; i < sizes.Length; i++)
            {
                if (acreage < sizes[i] * sizes[i])
                {
                    size = sizes[i];
                    break;
                }
            }
            if (acreage < (size * size / 2))
            {
                doubleFlag = true;
            }
            Texture2D texture = new Texture2D(size, doubleFlag ? (size / 2) : size);
            Rect[] rects = texture.PackTextures(newTextures, 0);
            data.texture = texture;
            data.rects = rects;
            data.indexs = textureListData.indexs;
            return data;
        }

        //清理相同的图集，保证不会打进同一张图
        private TextureListData clearTextures(Texture2D[] textures)
        {
            TextureListData textureListData = new TextureListData();
            List<Texture2D> newTextures = new List<Texture2D>();
            int[] indexs = new int[textures.Length];
            for (int i = 0; i < textures.Length; i++)
            {
                int index = getTextureIndex(newTextures, textures[i]);
                if (index == -1)
                {
                    newTextures.Add(textures[i]);
                    indexs[i] = newTextures.Count - 1;
                }
                else
                {
                    indexs[i] = index;
                }
            }
            textureListData.textures = newTextures.ToArray();
            textureListData.indexs = indexs;
            return textureListData;
        }

        //获取index
        private int getTextureIndex(List<Texture2D> textures, Texture2D texture)
        {
            for (int i = 0; i < textures.Count; i++)
            {
                if (System.Object.Equals(textures[i], texture))
                {
                    return i;
                }
            }
            return -1;
        }
    }
}