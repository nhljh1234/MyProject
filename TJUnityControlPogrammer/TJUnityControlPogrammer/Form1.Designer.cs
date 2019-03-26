namespace TJUnityControlPogrammer
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
            this.copy_AssetBundle = new System.Windows.Forms.Button();
            this.copy_all = new System.Windows.Forms.Button();
            this.text_box = new System.Windows.Forms.TextBox();
            this.quick_check_box = new System.Windows.Forms.CheckBox();
            this.unlock = new System.Windows.Forms.Button();
            this.clear_log = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // copy_AssetBundle
            // 
            this.copy_AssetBundle.Font = new System.Drawing.Font("Consolas", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.copy_AssetBundle.Location = new System.Drawing.Point(12, 615);
            this.copy_AssetBundle.Name = "copy_AssetBundle";
            this.copy_AssetBundle.Size = new System.Drawing.Size(163, 40);
            this.copy_AssetBundle.TabIndex = 0;
            this.copy_AssetBundle.Text = "拷贝AssetsBundle";
            this.copy_AssetBundle.UseVisualStyleBackColor = true;
            this.copy_AssetBundle.Click += new System.EventHandler(this.copy_AssetBundle_Click);
            // 
            // copy_all
            // 
            this.copy_all.Font = new System.Drawing.Font("Consolas", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.copy_all.Location = new System.Drawing.Point(181, 615);
            this.copy_all.Name = "copy_all";
            this.copy_all.Size = new System.Drawing.Size(163, 40);
            this.copy_all.TabIndex = 1;
            this.copy_all.Text = "拷贝全部资源";
            this.copy_all.UseVisualStyleBackColor = true;
            this.copy_all.Click += new System.EventHandler(this.copy_all_Click);
            // 
            // text_box
            // 
            this.text_box.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.text_box.Location = new System.Drawing.Point(13, 13);
            this.text_box.Multiline = true;
            this.text_box.Name = "text_box";
            this.text_box.ReadOnly = true;
            this.text_box.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.text_box.Size = new System.Drawing.Size(666, 567);
            this.text_box.TabIndex = 2;
            // 
            // quick_check_box
            // 
            this.quick_check_box.AutoSize = true;
            this.quick_check_box.Font = new System.Drawing.Font("Consolas", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.quick_check_box.Location = new System.Drawing.Point(12, 586);
            this.quick_check_box.Name = "quick_check_box";
            this.quick_check_box.Size = new System.Drawing.Size(100, 23);
            this.quick_check_box.TabIndex = 3;
            this.quick_check_box.Text = "快速拷贝";
            this.quick_check_box.UseVisualStyleBackColor = true;
            // 
            // unlock
            // 
            this.unlock.Font = new System.Drawing.Font("Consolas", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.unlock.Location = new System.Drawing.Point(350, 615);
            this.unlock.Name = "unlock";
            this.unlock.Size = new System.Drawing.Size(163, 40);
            this.unlock.TabIndex = 4;
            this.unlock.Text = "强制解锁";
            this.unlock.UseVisualStyleBackColor = true;
            this.unlock.Click += new System.EventHandler(this.unlock_Click);
            // 
            // clear_log
            // 
            this.clear_log.Font = new System.Drawing.Font("Consolas", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.clear_log.Location = new System.Drawing.Point(519, 615);
            this.clear_log.Name = "clear_log";
            this.clear_log.Size = new System.Drawing.Size(163, 40);
            this.clear_log.TabIndex = 5;
            this.clear_log.Text = "清除日志";
            this.clear_log.UseVisualStyleBackColor = true;
            this.clear_log.Click += new System.EventHandler(this.clear_log_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(691, 667);
            this.Controls.Add(this.clear_log);
            this.Controls.Add(this.unlock);
            this.Controls.Add(this.quick_check_box);
            this.Controls.Add(this.text_box);
            this.Controls.Add(this.copy_all);
            this.Controls.Add(this.copy_AssetBundle);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Name = "Form1";
            this.Text = "Unity代码控制";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button copy_AssetBundle;
        private System.Windows.Forms.Button copy_all;
        private System.Windows.Forms.TextBox text_box;
        private System.Windows.Forms.CheckBox quick_check_box;
        private System.Windows.Forms.Button unlock;
        private System.Windows.Forms.Button clear_log;
    }
}

