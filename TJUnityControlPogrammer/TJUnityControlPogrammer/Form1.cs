using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TJUnityControlPogrammer
{
    public partial class Form1 : Form
    {

        private Code.DataClass.WorkData _workDate = null;
        private string _outputMsg = "";
        private static string LOCK_FILE_NAME = "_lock.lock";
        //超过这个时间认为拷贝完成
        //容错处理
        private static int TIME_DIS_SECOND = 5 * 60;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string workDir = Environment.CurrentDirectory;
            DirectoryInfo workDirInfo = new DirectoryInfo(workDir);
            string xmlFilePath = workDirInfo.FullName + @"\_output.xml";
            Code.XmlReader xmlReader = new Code.XmlReader(xmlFilePath);
            _workDate = xmlReader.getWorkData();
        }

        private void copy_AssetBundle_Click(object sender, EventArgs e)
        {
            if (_workDate == null)
            {
                showLog("配置初始化失败");
                return;
            }
            string copyFromPath, copyToPath;
            copyFromPath = _workDate.getWindowDirPath() + "\\" + _workDate.getAssetBundlePath();
            copyToPath = _workDate.getOutputPath() + "\\" + _workDate.getAssetBundlePath();
            //判断文件夹是否存在
            if (!Directory.Exists(copyFromPath))
            {
                showLog("源AssetBundle文件夹不存在");
                return;
            }
            //判断文件夹是否被占用
            if (judgeDirInWork())
            {
                //被占用了
                showLog("目标文件夹被占用，请稍后");
                return;
            }
            showLog("开始拷贝");
            lockDir();
            //拷贝文件
            List<string> copyFilePathList = copyDir(copyFromPath, copyToPath);
            for (int i = 0; i < copyFilePathList.Count; i++)
            {
                showLog(copyFilePathList[i]);
            }
            unlockDir();
            showLog("结束拷贝");
        }

        private void copy_all_Click(object sender, EventArgs e)
        {
            if (_workDate == null)
            {
                showLog("配置初始化失败");
                return;
            }
            string copyFromPath, copyToPath;
            copyFromPath = _workDate.getWindowDirPath();
            copyToPath = _workDate.getOutputPath();
            //判断文件夹是否存在
            if (!Directory.Exists(copyFromPath))
            {
                showLog("源AssetBundle文件夹不存在");
                return;
            }
            //判断文件夹是否被占用
            if (judgeDirInWork())
            {
                //被占用了
                showLog("目标文件夹被占用，请稍后");
                return;
            }
            showLog("开始拷贝");
            lockDir();
            //拷贝文件
            List<string> copyFilePathList = copyDir(copyFromPath, copyToPath);
            for (int i = 0; i < copyFilePathList.Count; i++)
            {
                showLog(copyFilePathList[i]);
            }
            unlockDir();
            showLog("结束拷贝");
        }

        private void lockDir()
        {
            unlockDir();
            File.Create(_workDate.getOutputPath() + "\\" + LOCK_FILE_NAME).Dispose();
        }

        private void unlockDir()
        {
            string filePath = _workDate.getOutputPath() + "\\" + LOCK_FILE_NAME;
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        //判断文件夹是否被占用
        private bool judgeDirInWork()
        {
            string filePath = _workDate.getOutputPath() + "\\" + LOCK_FILE_NAME;
            if (File.Exists(filePath))
            {
                //被占用了
                //判断时间戳，大于五分钟则取消
                FileInfo file = new FileInfo(filePath);
                TimeSpan ts = DateTime.Now.Subtract(file.CreationTime);
                int sec = (int)ts.TotalSeconds;
                if (sec > TIME_DIS_SECOND)
                {
                    return false;
                }
                return true;
            }
            return false;
        }

        private void showLog(string msg)
        {
            _outputMsg = _outputMsg + msg + "\r\n\r\n";
            text_box.Text = _outputMsg;
            text_box.Select(text_box.Text.Length, 0);
            text_box.ScrollToCaret();
        }

        private List<string> copyDir(string dirFromPath, string dirToPath)
        {
            bool quickCopy = quick_check_box.Checked;
            List<string> copyFilePathList = new List<string>();
            //先判断文件夹
            if (!Directory.Exists(dirFromPath))
            {
                return copyFilePathList;
            }
            if (!Directory.Exists(dirToPath))
            {
                Directory.CreateDirectory(dirToPath);
            }
            DirectoryInfo dirFrom = new DirectoryInfo(dirFromPath);
            //先拷贝文件
            foreach (FileInfo file in dirFrom.GetFiles())
            {
                //判断是不是快速拷贝
                //快速拷贝看时间戳
                string copyToFilePath = dirToPath + "\\" + file.Name;
                if (quickCopy && File.Exists(copyToFilePath))
                {
                    FileInfo fileTo = new FileInfo(copyToFilePath);
                    if(fileTo.CreationTime == file.CreationTime)
                    {
                        continue;
                    }
                }
                File.Copy(file.FullName, dirToPath + "\\" + file.Name, true);
                copyFilePathList.Add(file.FullName);
            }
            foreach (DirectoryInfo dir in dirFrom.GetDirectories())
            {
                List<string> copyFilePathListChild = new List<string>();
                copyFilePathListChild = copyDir(dir.FullName, dirToPath + "\\" + dir.Name);
                copyFilePathList.AddRange(copyFilePathListChild);
            }
            return copyFilePathList;
        }

        private void unlock_Click(object sender, EventArgs e)
        {
            unlockDir();
        }
    }
}
