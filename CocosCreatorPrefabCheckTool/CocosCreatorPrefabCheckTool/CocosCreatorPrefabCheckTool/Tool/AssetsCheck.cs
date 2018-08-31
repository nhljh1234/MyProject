using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CocosCreatorPrefabCheckTool.Tool
{
    class AssetsCheck
    {
        private String _assetsPath;
        private String[] _checkComponentNameArr;

        //生成一个<idStr, NodeClass>
        private Dictionary<String, DataClass.NodeClass> BuildNodeDic(String prefabPath)
        {
            String fileStr = getFileContent(prefabPath);
            if (fileStr == null)
            {
                //读取失败
                Console.WriteLine("文件读取失败，路径为: " + prefabPath);
                return null;
            }
            Dictionary<String, DataClass.NodeClass> dic = new Dictionary<String, DataClass.NodeClass>();
            //Json读取
            JArray jArray = (JArray)JsonConvert.DeserializeObject(fileStr);
            //开始读取
            //第一步生成节点字典
            for (int i = 0; i < jArray.Count; i++)
            {
                if (jArray[i]["__type__"].ToString() == "cc.Node")
                {
                    //新建一个节点
                    //判断有没有父节点
                    String parentStr = jArray[i]["_parent"].ToString();
                    //这边的ID是按列表顺序来的
                    String nodeIdStr = "" + i;
                    String nodeName = jArray[i]["_name"].ToString();
                    if (parentStr == "null" || parentStr == "")
                    {
                        //没有父节点
                        DataClass.NodeClass nodeClass = new DataClass.NodeClass(nodeIdStr, null, nodeName);
                        dic.Add(nodeIdStr, nodeClass);
                    }
                    else
                    {
                        JObject jsonObj = (JObject)JsonConvert.DeserializeObject(parentStr);
                        if (jsonObj == null)
                        {
                            DataClass.NodeClass nodeClass = new DataClass.NodeClass(nodeIdStr, null, nodeName);
                            dic.Add(nodeIdStr, nodeClass);
                        }
                        else
                        {
                            string parentNodeIdStr = jsonObj["__id__"].ToString();
                            DataClass.NodeClass parendNode = null;
                            if (dic.TryGetValue(parentNodeIdStr, out parendNode))
                            {
                                DataClass.NodeClass nodeClass = new DataClass.NodeClass(nodeIdStr, parendNode, nodeName);
                                dic.Add(nodeIdStr, nodeClass);
                            }
                            else
                            {
                                DataClass.NodeClass nodeClass = new DataClass.NodeClass(nodeIdStr, null, nodeName);
                                dic.Add(nodeIdStr, nodeClass);
                            }
                        }
                    }
                }
            }
            //第二步 判断组件
            for (int i = 0; i < jArray.Count; i++)
            {
                if (jArray[i]["node"] != null)
                {
                    //判断有没有node这个属性
                    //获取nodeId
                    JObject jsonObj = (JObject)JsonConvert.DeserializeObject(jArray[i]["node"].ToString());
                    string nodeIdStr = jsonObj["__id__"].ToString();
                    DataClass.NodeClass node = dic[nodeIdStr];
                    if (node != null)
                    {
                        node.addComponentName(jArray[i]["__type__"].ToString());
                    }
                }
            }
            return dic;
        }

        public String getFileContent(String filePath)
        {
            String fileStr = null;
            try
            {
                if (File.Exists(filePath))
                {
                    byte[] mybyte = Encoding.UTF8.GetBytes(File.ReadAllText(filePath));
                    fileStr = Encoding.UTF8.GetString(mybyte);
                }
            }
            catch
            {

            }
            return fileStr;
        }

        public void visitCheck(String dirPath)
        {
            DirectoryInfo dirInfo = new DirectoryInfo(dirPath);
            //遍历文件
            foreach (FileInfo fileInfo in dirInfo.GetFiles())
            {
                if (fileInfo.Extension == ".prefab" || fileInfo.Extension == ".fire")
                {
                    //检查prefab文件
                    Dictionary<String, DataClass.NodeClass> nodeDic = BuildNodeDic(fileInfo.FullName);
                    foreach (KeyValuePair<String, DataClass.NodeClass> keyValue in nodeDic)
                    {
                        DataClass.NodeClass node = keyValue.Value;
                        String logStr = fileInfo.FullName + ": " + node.nodePath + " have: ";
                        Boolean checkFlag = true;
                        for (int i = 0; i < _checkComponentNameArr.Length; i++)
                        {
                            String checkComponentName = _checkComponentNameArr[i];
                            logStr = logStr + checkComponentName + " ";
                            if (!node.judgeHaveComponent(checkComponentName))
                            {
                                checkFlag = false;
                                break;
                            }
                        }
                        if (checkFlag)
                        {
                            //打印
                            Console.WriteLine(logStr);
                        }
                    }
                }
            }
            //遍历文件夹
            foreach (DirectoryInfo childDirInfo in dirInfo.GetDirectories())
            {
                visitCheck(childDirInfo.FullName);
            }
        }

        public void startCheck(String[] checkComponentNameArr)
        {
            this._checkComponentNameArr = checkComponentNameArr;
            visitCheck(this._assetsPath);
        }

        //构造函数
        public AssetsCheck(String assetsPath)
        {
            this._assetsPath = assetsPath;
        }
    }
}
