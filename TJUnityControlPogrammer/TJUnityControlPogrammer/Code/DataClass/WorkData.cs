using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TJUnityControlPogrammer.Code.DataClass
{
    class WorkData
    {
        private string _windowDirPath = null;
        private string _outputPath = null;
        private string _assetBundlePath = null;

        public WorkData(string windowDirPath, string outputPath, string assetBundlePath)
        {
            _windowDirPath = windowDirPath;
            _outputPath = outputPath;
            _assetBundlePath = assetBundlePath;
        }

        public string getWindowDirPath()
        {
            return _windowDirPath;
        }

        public string getOutputPath()
        {
            return _outputPath;
        }

        public string getAssetBundlePath()
        {
            return _assetBundlePath;
        }
    }
}
