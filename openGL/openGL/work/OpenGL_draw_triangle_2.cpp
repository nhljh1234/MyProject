#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <fstream>
#include <string>

#include <my/BuildWindow.h>
#include <my/MyShader.h>

int _draw_triangle_2_main()
{
	GLFWwindow* window = createOpenGLWindow();

	float vertices_1[] = {
		0.1f, 0.0f, 0.0f,
		0.5f, 0.5f, 0.0f,
		0.5f, -0.5f, 0.0f
	};

	float vertices_2[] = {
		-0.1f, 0.0f, 0.0f,
		-0.5f, 0.5f, 0.0f,
		-0.5f, -0.5f, 0.0f
	};

	float vertices_3[] = {
		0.0f, 0.1f, 0.0f,
		-0.4f, 0.4f, 0.0f,
		0.4f, 0.4f, 0.0f
	};

	unsigned int VAO_1, VAO_2, VAO_3;
	unsigned int VBO_1, VBO_2, VBO_3;

	//绑定生成VAO
	glGenVertexArrays(1, &VAO_1);
	glBindVertexArray(VAO_1);
	//绑定生成VBO
	glGenBuffers(1, &VBO_1);
	glBindBuffer(GL_ARRAY_BUFFER, VBO_1);
	//写入数据
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_1), vertices_1, GL_STATIC_DRAW);
	//写入VAO
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	//启用顶点数据
	glEnableVertexAttribArray(0);

	glGenVertexArrays(1, &VAO_2);
	glBindVertexArray(VAO_2);
	glGenBuffers(1, &VBO_2);
	glBindBuffer(GL_ARRAY_BUFFER, VBO_2);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_2), vertices_2, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	
	glGenVertexArrays(1, &VAO_3);
	glBindVertexArray(VAO_3);
	glGenBuffers(1, &VBO_3);
	glBindBuffer(GL_ARRAY_BUFFER,VBO_3);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_3), vertices_3, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);

	//着色器
	std::string vsPath = "./work/ShaderFile/DrawTriangle/orange/vertex.vs";
	std::string fsPath = "./work/ShaderFile/DrawTriangle/orange/fragment.fs";
	MyShader orangeShader(vsPath.data(), fsPath.data());

	vsPath = "./work/ShaderFile/DrawTriangle/black/vertex.vs";
	fsPath = "./work/ShaderFile/DrawTriangle/black/fragment.fs";
	MyShader blackShader(vsPath.data(), fsPath.data());

	//循环函数
	//检查GLFW是否被要求退出
	while (!glfwWindowShouldClose(window))
	{
		//设置清空屏幕颜色
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		//清除缓冲，这边的缓冲还有GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT
		glClear(GL_COLOR_BUFFER_BIT);

		orangeShader.use();
		glBindVertexArray(VAO_1);
		glDrawArrays(GL_TRIANGLES, 0, 3);
		blackShader.use();
		glBindVertexArray(VAO_2);
		glDrawArrays(GL_TRIANGLES, 0, 3);
		glBindVertexArray(VAO_3);
		glDrawArrays(GL_TRIANGLES, 0, 3);
		

		//交换颜色缓冲
		glfwSwapBuffers(window);
		//检测有没有触发事件（键盘输入、鼠标移动）
		glfwPollEvents();
	}

	closeWindow();
	return 0;
}
