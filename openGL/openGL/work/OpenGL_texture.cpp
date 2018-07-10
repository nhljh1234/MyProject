#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <fstream>
#include <string>

#include <my/BuildWindow.h>
#include <my/MyShader.h>

#define STB_IMAGE_IMPLEMENTATION
#include <img/stb_image.h>

void processInputTexture(GLFWwindow* window, float* mixNum)
{
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
		*mixNum = *mixNum + 0.01f;
	else if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS)
		*mixNum = *mixNum - 0.01f;
	if (*mixNum > 1.0f)
		*mixNum = 1.0f;
	else if (*mixNum < 0.0f)
		*mixNum = 0.0f;
}

int main()
{
	GLFWwindow* window = createOpenGLWindow();
	//定义纹理类型
	unsigned int texture_1, texture_2;
	glGenTextures(1, &texture_1);

	//写入数据
	glBindTexture(GL_TEXTURE_2D, texture_1);
	//设置纹理环绕方式
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//设置纹理过滤方式
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	int width, height, colorChannelNum;
	std::string imgPath;
	imgPath = "./img/container.jpg";
	unsigned char *data;
	data = stbi_load(imgPath.data(), &width, &height, &colorChannelNum, 0);
	if (data)
	{
		//写入纹理数据
		//第一个参数：指向纹理目标，设置为GL_TEXTURE_2D意味着会生成与当前绑定的纹理对象在同一个目标上的纹理
		//第二个参数：指定多级渐远纹理（MipMap）的级别
		//第三个参数：纹理的存储格式
		//第四、五个参数：纹理的长和宽
		//第六个参数：总是被设置为0，历史遗留问题
		//第七、八个参数：源图的格式和数据类型
		//第九个参数：真正的图像数据
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
	}
	//生成以后记得释放
	stbi_image_free(data);


	glGenTextures(1, &texture_2);
	//写入数据
	glBindTexture(GL_TEXTURE_2D, texture_2);
	//设置纹理环绕方式
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	//设置纹理过滤方式
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	imgPath = "./img/awesomeface.png";
	data = stbi_load(imgPath.data(), &width, &height, &colorChannelNum, 0);
	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
	}
	//生成以后记得释放
	stbi_image_free(data);

	float vertices[] = {
		//     ---- 位置 ----       ---- 颜色 ----     - 纹理坐标 -
		0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f,   // 右上
		0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,   // 右下
		-0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f,   // 左下
		-0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f    // 左上
	};

	//写入数据
	unsigned int VAO, VBO;
	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);
	glGenBuffers(1, &VBO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	//写入数据
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(6 * sizeof(float)));
	glEnableVertexAttribArray(2);

	unsigned int elements[] = {
		0, 1, 2,
		0, 2, 3
	};
	unsigned int EBO;
	glGenBuffers(1, &EBO);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(elements), elements, GL_STATIC_DRAW);

	//着色器
	std::string vsPath = "./work/ShaderFile/Texture/1/vertex.vs";
	std::string fsPath = "./work/ShaderFile/Texture/1/fragment.fs";
	MyShader textureShader(vsPath.data(), fsPath.data());
	textureShader.use();
	glUniform1f(glGetUniformLocation(textureShader.ID, "mixNum"), 0.0f);
	glUniform1i(glGetUniformLocation(textureShader.ID, "ourTexture1"), 0);
	glUniform1i(glGetUniformLocation(textureShader.ID, "ourTexture2"), 1);

	float mix = 0.0f;
	float* mixNum = &mix;

	//循环函数
	//检查GLFW是否被要求退出
	while (!glfwWindowShouldClose(window))
	{
		processInputTexture(window, mixNum);

		//设置清空屏幕颜色
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		//清除缓冲，这边的缓冲还有GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT
		glClear(GL_COLOR_BUFFER_BIT);
		
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, texture_1);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, texture_2);

		textureShader.use();
		glUniform1f(glGetUniformLocation(textureShader.ID, "mixNum"), *mixNum);
		glBindVertexArray(VAO);
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

		//交换颜色缓冲
		glfwSwapBuffers(window);
		//检测有没有触发事件（键盘输入、鼠标移动）
		glfwPollEvents();
	}

	closeWindow();
	return 0;
}
