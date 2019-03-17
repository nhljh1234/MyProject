using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Back_Project.code.Data
{
    class GloablNode
    {
        private List<FileNode> _fileNodes = new List<FileNode>();

        public void addFileNode(FileNode fileNode)
        {
            _fileNodes.Add(fileNode);
        }

        public List<FileNode> getFileNodes()
        {
            return _fileNodes;
        }
    }
}
