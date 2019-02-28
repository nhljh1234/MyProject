namespace ShaderForgeTool
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.buttonFile = new System.Windows.Forms.Button();
            this.buttonOutput = new System.Windows.Forms.Button();
            this.textBox = new System.Windows.Forms.TextBox();
            this.checkBoxShadow = new System.Windows.Forms.CheckBox();
            this.checkBoxFog = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // buttonFile
            // 
            this.buttonFile.Font = new System.Drawing.Font("Consolas", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonFile.Location = new System.Drawing.Point(12, 601);
            this.buttonFile.Name = "buttonFile";
            this.buttonFile.Size = new System.Drawing.Size(332, 50);
            this.buttonFile.TabIndex = 0;
            this.buttonFile.Text = "打开shader文件";
            this.buttonFile.UseCompatibleTextRendering = true;
            this.buttonFile.UseVisualStyleBackColor = true;
            this.buttonFile.Click += new System.EventHandler(this.buttonFile_Click);
            // 
            // buttonOutput
            // 
            this.buttonOutput.Font = new System.Drawing.Font("Consolas", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonOutput.Location = new System.Drawing.Point(12, 545);
            this.buttonOutput.Name = "buttonOutput";
            this.buttonOutput.Size = new System.Drawing.Size(332, 50);
            this.buttonOutput.TabIndex = 1;
            this.buttonOutput.Text = "输出shader文件";
            this.buttonOutput.UseVisualStyleBackColor = true;
            this.buttonOutput.Click += new System.EventHandler(this.buttonOutput_Click);
            // 
            // textBox
            // 
            this.textBox.Font = new System.Drawing.Font("Consolas", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textBox.Location = new System.Drawing.Point(350, 12);
            this.textBox.Multiline = true;
            this.textBox.Name = "textBox";
            this.textBox.ReadOnly = true;
            this.textBox.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.textBox.Size = new System.Drawing.Size(826, 639);
            this.textBox.TabIndex = 2;
            this.textBox.WordWrap = false;
            // 
            // checkBoxShadow
            // 
            this.checkBoxShadow.AutoSize = true;
            this.checkBoxShadow.Font = new System.Drawing.Font("Consolas", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.checkBoxShadow.Location = new System.Drawing.Point(12, 12);
            this.checkBoxShadow.Name = "checkBoxShadow";
            this.checkBoxShadow.Size = new System.Drawing.Size(69, 26);
            this.checkBoxShadow.TabIndex = 3;
            this.checkBoxShadow.Text = "阴影";
            this.checkBoxShadow.UseVisualStyleBackColor = true;
            this.checkBoxShadow.CheckedChanged += new System.EventHandler(this.checkBoxShadow_CheckedChanged);
            // 
            // checkBoxFog
            // 
            this.checkBoxFog.AutoSize = true;
            this.checkBoxFog.Font = new System.Drawing.Font("Consolas", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.checkBoxFog.Location = new System.Drawing.Point(12, 44);
            this.checkBoxFog.Name = "checkBoxFog";
            this.checkBoxFog.Size = new System.Drawing.Size(69, 26);
            this.checkBoxFog.TabIndex = 4;
            this.checkBoxFog.Text = "雾效";
            this.checkBoxFog.UseVisualStyleBackColor = true;
            this.checkBoxFog.CheckedChanged += new System.EventHandler(this.checkBoxFog_CheckedChanged);
            // 
            // Form1
            // 
            this.ClientSize = new System.Drawing.Size(1188, 663);
            this.Controls.Add(this.checkBoxFog);
            this.Controls.Add(this.checkBoxShadow);
            this.Controls.Add(this.textBox);
            this.Controls.Add(this.buttonOutput);
            this.Controls.Add(this.buttonFile);
            this.Name = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonFile;
        private System.Windows.Forms.Button buttonOutput;
        private System.Windows.Forms.TextBox textBox;
        private System.Windows.Forms.CheckBox checkBoxShadow;
        private System.Windows.Forms.CheckBox checkBoxFog;
    }
}

