using ShaderForgeTool.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShaderForgeTool
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private PassClass passClass;

        //打开指定文件
        private void buttonFile_Click(object sender, EventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            //指定打开.shader文件
            dialog.Filter = "Shader文件(*.shader)|*.shader";
            dialog.ValidateNames = true;
            dialog.CheckPathExists = true;
            dialog.CheckFileExists = true;
            if (dialog.ShowDialog() == DialogResult.OK)
            {
                string strFileName = dialog.FileName;
                //其他代码
                passClass = new PassClass(strFileName);
            }
            this.textBox.Text = passClass.getResultCodeStr();
        }
    }
}
