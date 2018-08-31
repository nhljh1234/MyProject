using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CocosCreatorPrefabCheckTool.DataClass
{
    class NodeClass
    {
        public String nodeId;
        public NodeClass parentNode;
        public String nodePath;
        public String nodeName;

        private List<String> componentList = new List<string>();

        public NodeClass(String nodeId, NodeClass parentNode, String nodeName)
        {
            this.nodeId = nodeId;
            this.parentNode = parentNode;
            this.nodeName = nodeName;
            if (parentNode == null)
            {
                this.nodePath = nodeName;
            }
            else
            {
                this.nodePath = parentNode.nodePath + "/" + nodeName;
            }
        }

        public void addComponentName(String componentName)
        {
            componentList.Add(componentName);
        }

        public Boolean judgeHaveComponent(String componentName)
        {
            foreach (String childComponentName in componentList)
            {
                if (childComponentName == componentName)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
