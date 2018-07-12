#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <fstream>
#include <string>

#include <my/BuildWindow.h>
#include <my/MyShader.h>

int main()
{
	GLFWwindow* window = createOpenGLWindow();

	float vertices[] = {
		0.0f, 0.5f, 0.0f,
		-0.5f, -0.5f, 0.0f,
		0.5f, -0.5f, 0.0f
	};

	unsigned int VAO, VBO;
	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);
	glGenBuffers(1, &VBO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);

	//着色器
	std::string vsPath = "./work/ShaderFile/ShaderLearn/changeColor/vertex.vs";
	std::string fsPath = "./work/ShaderFile/ShaderLearn/changeColor/fragment.fs";
	MyShader changeColorShader(vsPath.data(), fsPath.data());

	//使用着色器
	changeColorShader.use();

	float time, greenValue;
	std::string ourColor = "ourColor";
	int location = glGetUniformLocation(changeColorShader.ID, ourColor.c_str());

	//循环函数
	//检查GLFW是否被要求退出
	while (!glfwWindowShouldClose(window))
	{
		//设置清空屏幕颜色
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		//清除缓冲，这边的缓冲还有GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT
		glClear(GL_COLOR_BUFFER_BIT);

		time = float(glfwGetTime());
		greenValue = sin(time) / 2.0f + 0.5f;
		glUniform3f(location, 0.0f, greenValue, 0.0f);

		glDrawArrays(GL_TRIANGLES, 0, 3);

		//交换颜色缓冲
		glfwSwapBuffers(window);
		//检测有没有触发事件（键盘输入、鼠标移动）
		glfwPollEvents();
	}

	closeWindow();
	return 0;
}
