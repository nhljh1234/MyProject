using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TJ;
using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.ComponentModel;

namespace HotUpdate
{
    public class DownloadUnit
    {
        public string srcUrl;
        public string storagePath;
        public string customId;
        public long size;
    };

    public class ManifestAsset
    {
        [DefaultValue("")]
        public string md5 { get; set; }
        public bool compressed { get; set; }
        public long size { get; set; }
        public Manifest.DownloadState downloadState { get; set; }
        [JsonIgnore]
        public string path { get; set; }

        public ManifestAsset Clone()
        {
            return (ManifestAsset)MemberwiseClone();
        }
    }


    public class ManifestData
    {
        public Dictionary<string, ManifestAsset> assets { get; set; }
        [DefaultValue("")]
        public string packageUrl { get; set; }
        [DefaultValue("")]
        public string remoteManifestUrl { get; set; }
        [DefaultValue("")]
        public string remoteVersionUrl { get; set; }
        [DefaultValue("")]
        public string svnVersion { get; set; }
        [DefaultValue("")]
        public string version { get; set; }
        public bool updating { get; set; }
    }

    public class Manifest
    {
        public enum DiffType
        {
            ADDED,
            DELETED,
            MODIFIED
        };

        public enum DownloadState
        {
            UNMARKED,
            UNSTARTED,
            DOWNLOADING,
            SUCCESSED
        };

        public class AssetDiff
        {
            public ManifestAsset asset;
            public DiffType type;
        };



        ManifestData _data;

        string _manifestRoot = "";


        T loadJson<T>(string url)
        {
            clear();

            //TODO: 这里得分内外
            if (ResourceUtils.FileExists(url))
            {
                string content = System.Text.Encoding.UTF8.GetString(ResourceUtils.LoadBytes(url));
                if (content.Length == 0)
                    Debug.LogFormat("Fail to retrieve local file content: {0}\n", url);
                else
                    return loadJsonFromString<T>(content);
            }
            return default(T);
        }

        T loadJsonFromString<T>(string content)
        {
            T t = default(T);
            if (content.Length == 0)
            {
                Debug.Log("Fail to parse empty json content.");
            }
            else
            {
                try
                {
                    t = JsonConvert.DeserializeObject<T>(content, new JsonSerializerSettings { DefaultValueHandling = DefaultValueHandling.Populate });
                }
                catch (Exception e)
                {
                    Debug.LogWarningFormat("File parse error!   {0}", e.ToString());
                }
            }
            return t;
        }

        public void parseVersion(string versionUrl)
        {
            _data = loadJson<ManifestData>(versionUrl);
            if (_data == null)
                return;

            if (_data.assets != null)
            {
                foreach (var it in _data.assets)
                {
                    var asset = it.Value;
                    asset.path = it.Key;

                    asset.md5 = asset.md5.ToUpper();
                }
            }

            if (_data.packageUrl.Length > 0 && _data.packageUrl[_data.packageUrl.Length - 1] != '/')
                _data.packageUrl += "/";
        }

        public void parseFile(string manifestUrl)
        {
            parseVersion(manifestUrl);

            if (_data != null)
            {
                _manifestRoot = Path.GetDirectoryName(manifestUrl);
            }
        }

        public bool isVersionLoaded()
        {
            return _data != null;
        }

        public bool isLoaded()
        {
            return _data != null;
        }

        public void setUpdating(bool updating)
        {
            if (_data != null)
            {
                _data.updating = updating;
            }
        }

        public bool versionEquals(Manifest b)
        {
            return _data.version == b._data.version;
        }

        public bool versionGreater(Manifest b, Func<string, string, int> handle = null)
        {
            string localVersion = getVersion();
            string bVersion = b.getVersion();
            bool greater;
            if (handle != null)
            {
                greater = handle(localVersion, bVersion) >= 0;
            }
            else
            {
                greater = cmpVersion(localVersion, bVersion) >= 0;
            }
            return greater;
        }

        public Dictionary<string, AssetDiff> genDiff(Manifest b)
        {
            Dictionary<string, AssetDiff> diff_map = new Dictionary<string, AssetDiff>();
            Dictionary<string, ManifestAsset> bAssets = b.getAssets();

            string key;
            ManifestAsset valueA;
            ManifestAsset valueB;

            foreach (KeyValuePair<string, ManifestAsset> it in _data.assets)
            {
                key = it.Key;
                valueA = it.Value;

                // Deleted
                if (!bAssets.TryGetValue(key, out valueB))
                {
                    AssetDiff diff = new AssetDiff
                    {
                        asset = valueA.Clone(),
                        type = DiffType.DELETED,
                    };
                    diff_map[key] = diff;
                    continue;
                }

                // Modified
                if (valueA.md5 != valueB.md5)
                {
                    AssetDiff diff = new AssetDiff
                    {
                        asset = valueB.Clone(),
                        type = DiffType.MODIFIED,
                    };
                    diff_map[key] = diff;
                }
            }

            foreach (KeyValuePair<string, ManifestAsset> it in bAssets)
            {
                key = it.Key;
                valueB = it.Value;

                // Added
                if (!_data.assets.ContainsKey(key))
                {
                    AssetDiff diff = new AssetDiff
                    {
                        asset = valueB.Clone(),
                        type = DiffType.ADDED,
                    };
                    diff_map[key] = diff;
                }
            }

            return diff_map;
        }

        static string CalcFileMd5Sum(string file_name)
        {
            if (!ResourceUtils.FileExists(file_name))
                return "";

            var content = ResourceUtils.LoadBytes(file_name);
            return EncryptBytes(content);
        }

        public void genResumeAssetsList(Dictionary<string, DownloadUnit> units, List<string> v_units, Dictionary<string, ManifestAsset>  downloaded_assets)
        {
            v_units.Clear();

            foreach (var it in _data.assets)
            {
                ManifestAsset asset = it.Value;

                if (asset.downloadState != DownloadState.SUCCESSED)
                {
                    ManifestAsset dasset;
                    if (downloaded_assets.TryGetValue(asset.path, out dasset))
                    {
                        if (dasset.md5 == asset.md5)
                            continue;
                    }

                    DownloadUnit unit = new DownloadUnit
                    {
                        customId = it.Key,
                        srcUrl = _data.packageUrl + asset.path,
                        storagePath = _manifestRoot + asset.path,
                        size = asset.size,
                    };

                    //TODO:这里非常的乱, 我觉得需要去除compressed的情况
                    if (asset.compressed == false)
                    {
                        var content_md5 = CalcFileMd5Sum(unit.storagePath);
                        if (content_md5 != "" && content_md5 == asset.md5)
                            continue;
                    }

                    v_units.Add(unit.customId);
                    units[unit.customId] = unit;
                }
            }
        }


        public string getPackageUrl()
        {
            return _data.packageUrl;
        }

        public string getManifestFileUrl()
        {
            return _data.remoteManifestUrl;
        }

        public string getVersionFileUrl()
        {
            return _data.remoteVersionUrl;
        }

        public string getVersion()
        {
            return _data.version;
        }

        public Dictionary<string, ManifestAsset> getAssets()
        {
            return _data.assets;
        }

        void setAssetDownloadState(string key, DownloadState state)
        {
            ManifestAsset asset;
            if (_data.assets.TryGetValue(key, out asset))
            {
                asset.downloadState = state;
            }
        }

        void clear()
        {
            _data = null;

            _manifestRoot = "";
        }

        public void saveToFile(string filepath)
        {
            var jsonstr = JsonConvert.SerializeObject(_data, Formatting.Indented);
            File.WriteAllText(filepath, jsonstr, new System.Text.UTF8Encoding(false)); //无BOM头
        }


        public static int cmpVersion(string versionA, string versionB)
        {
            string[] vA = versionA.Split('.');
            string[] vB = versionB.Split('.');

            var len = Math.Max(vA.Length, vB.Length);
            for (int i = 0; i < len; i++)
            {
                int a = i < vA.Length ? Int32.Parse(vA[i]) : 0;
                int b = i < vB.Length ? Int32.Parse(vB[i]) : 0;
                if (a == b)
                    continue;

                return a - b;
            }

            return 0;
        }

        public static string EncryptBytes(byte[] buff)
        {
            MD5 md5 = MD5.Create();
            // 将字符串转换成字节数组
            //byte[] byteOld = Encoding.UTF8.GetBytes(str);
            byte[] byteOld = buff;
            // 调用加密方法
            byte[] byteNew = md5.ComputeHash(byteOld);
            // 将加密结果转换为字符串
            StringBuilder sb = new StringBuilder();
            foreach (byte b in byteNew)
            {
                // 将字节转换成16进制表示的字符串，
                sb.Append(b.ToString("X2"));
            }
            // 返回加密的字符串
            return sb.ToString();
        }
    }







//    public class ManifestXX
//    {
//        static string Text = @"
//{
//    'assets': {
//        'sapatch_100032_100830.zip': {
//            'compressed': true,
//            'md5': 'BDF0F9CD597CD337EE76493CC8CD633F',
//            'size': 15430879
//        },
//        'sapatch_100831_101045.zip': {
//            'compressed': true,
//            'md5': '5A58B3F9369B7B5ECE8850FC5FA8A5FB',
//            'size': 3582416
//        }
//    },
//    'engineVersion': '3.16',
//    'packageUrl': 'http://cdndl.taojingame.com/stararc/alpha2/patch/',
//    'remoteManifestUrl': 'http://stararcpatch.taojingame.com/stararc/alpha2/info/project.manifest',
//    'remoteVersionUrl': 'http://stararcpatch.taojingame.com/stararc/alpha2/info/version.manifest',
//    'searchPaths': [
//        'update0000g/'
//    ],
//    'svnVersion': '103268',
//    'version': '1.0.19'
//}
//";


//        [UnityEditor.MenuItem("TJ/Test")]
//        static void Test()
//        {
//            var m = new ManifestData
//            {
//                version = "2.0",
//                assets = new Dictionary<string, ManifestAsset> {
//                    { "xxxx.zip", new ManifestAsset {
//                            md5 = "111",
//                            compressed = true,
//                            size = 3332,
//                        }
//                    },
//                },
//            };

//            string json = JsonConvert.SerializeObject(m, Formatting.Indented);
//            //Debug.Log(json);

//            var m1 = JsonConvert.DeserializeObject<ManifestData>(Text, new JsonSerializerSettings { DefaultValueHandling = DefaultValueHandling.Populate });
//            Debug.Log(m1);
//            Debug.Log(m1.version);
//            //Debug.Log(m1.temp);
//            Debug.Log(JsonConvert.SerializeObject(m1, Formatting.Indented));

//            //Debug.Log(Path.GetDirectoryName("http://stararcpatch.taojingame.com/stararc/alpha2/info/project.manifest"));
//            //Debug.Log(Manifest.cmpVersion("3.4.3", "3.4"));

//            //var ma = new ManifestAsset
//            //{
//            //    md5 = "sss",
//            //};

//            //var mb = ma.Clone();

//            Debug.Log(Path.IsPathRooted("cusr"));
//            Debug.Log(Path.Combine("c:\\sss", "D:\\aaa"));
//        }

//    }

}
