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
        private string _assetBundlePathTo = null;
        private string _assetBundlePathFrom = null;

        public WorkData(string windowDirPath, string outputPath, string assetBundlePathTo, string assetBundlePathFrom)
        {
            _windowDirPath = windowDirPath;
            _outputPath = outputPath;
            _assetBundlePathTo = assetBundlePathTo;
            _assetBundlePathFrom = assetBundlePathFrom;
        }

        public string getWindowDirPath()
        {
            return _windowDirPath;
        }

        public string getOutputPath()
        {
            return _outputPath;
        }

        public string getAssetBundlePathTo()
        {
            return _assetBundlePathTo;
        }

        public string getAssetBundlePathFrom()
        {
            return _assetBundlePathFrom;
        }
    }
}
