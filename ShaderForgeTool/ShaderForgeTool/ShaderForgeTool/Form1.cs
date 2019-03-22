using ShaderForgeTool.Data;
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

namespace ShaderForgeTool
{
    public partial class Form1 : Form
    {

        private string filePathSave;

        public Form1()
        {
            InitializeComponent();

            checkBoxShadow.Checked = false;
            checkBoxShadow.Enabled = false;

            checkBoxFog.Checked = false;
            checkBoxFog.Enabled = false;

            checkBoxQueue.Checked = false;
            checkBoxQueue.Enabled = false;
        }

        private PassClass passClass = null;

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
                filePathSave = dialog.FileName;
                //其他代码
                passClass = new PassClass(filePathSave);
                checkBoxShadow.Enabled = true;
                checkBoxFog.Enabled = true;
                checkBoxQueue.Enabled = true;
                textBox.Text = passClass.getResultCodeStr();
                checkBoxShadow.Checked = passClass.judgeHaveShadowCaster();
                checkBoxFog.Checked = passClass.judgeHaveFogEffect();
                checkBoxQueue.Checked = passClass.judgeTransparentQueue();
            }
        }

        private void checkBoxShadow_CheckedChanged(object sender, EventArgs e)
        {
            bool showShadowFlag = checkBoxShadow.Checked;
            if (passClass != null)
            {
                passClass.checkShadowChange(showShadowFlag);
            }
            textBox.Text = passClass.getResultCodeStr();
        }

        private void checkBoxFog_CheckedChanged(object sender, EventArgs e)
        {
            bool showFogFlag = checkBoxFog.Checked;
            if (passClass != null)
            {
                passClass.checkFogEffectChange(showFogFlag);
            }
            textBox.Text = passClass.getResultCodeStr();
        }

        private void checkBoxQueue_CheckedChanged(object sender, EventArgs e)
        {
            bool spineQueueFlag = checkBoxQueue.Checked;
            if (passClass != null)
            {
                passClass.checkSpineQueueChange(spineQueueFlag);
            }
            textBox.Text = passClass.getResultCodeStr();
        }

        private void buttonOutput_Click(object sender, EventArgs e)
        {
            if (passClass == null)
            {
                return;
            }
            FileInfo file = new FileInfo(filePathSave);
            if (file != null)
            {
                DirectoryInfo dir = file.Directory;
                int i = 1;
                string newFileName = dir.FullName + @"\" + file.Name.Replace(file.Extension, "");
                while (true)
                {
                    if (!File.Exists(newFileName + "_" + i + file.Extension))
                    {
                        newFileName = newFileName + "_" + i + file.Extension;
                        break;
                    }
                    i++;
                }
                passClass.replaceFileName(file.Name.Replace(file.Extension, ""), 
                    file.Name.Replace(file.Extension, "") + "_" + i);
                File.WriteAllText(newFileName, passClass.getResultCodeStr());
                MessageBox.Show("生成新的shader文件成功，路径为" + newFileName);
            }
        }
    }
}
