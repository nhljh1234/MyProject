#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <fstream>
#include <string>

#include <my/BuildWindow.h>
#include <my/MyShader.h>

int _draw_triangle_1_main()
{
	GLFWwindow* window = createOpenGLWindow();

	float vertices[] = {
		0.0, 0.0, 0.0,
		0.5, -0.5, 0.0,
		0.5, 0.5, 0.0,
		-0.5, 0.5, 0.0,
		-0.5, -0.5, 0.0
	};

	//创建一个VAO数据
	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	//绑定VAO数据
	glBindVertexArray(VAO);

	unsigned int VBO;
	//通过一个缓冲ID生成一个VBO对象
	glGenBuffers(1, &VBO);
	//绑定VBO至指定缓存
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	//写入数据
	//GL_STATIC_DRAW：数据不会或几乎不会改变。
	//GL_DYNAMIC_DRAW：数据会被改变很多。
	//GL_STREAM_DRAW：数据每次绘制时都会改变。
	//会经常改变的数据将会放在高速写入的内存部分
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	unsigned int elements[] = {
		0, 1, 2,
		0, 3, 4
	};

	//申请EBO
	unsigned int EBO;
	glGenBuffers(1, &EBO);
	//绑定EBO
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(elements), elements, GL_STATIC_DRAW);

	//链接顶点数据
	//第一个参数：对应顶点着色器中的(location = 0)
	//第二个参数：指定数据的大小，因为顶点用的是vec3，所以这边用3
	//第三个参数：指定数据类型，这边用的是float
	//第四个参数：表示数据是否被标准化，如果设置了GL_TRUE，那么数据会被映射到0-1之间
	//第五个参数：步长，获取的数据的长度
	//第六个参数：数据起始位置的偏移量
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	//启动顶点属性
	glEnableVertexAttribArray(0);

	//着色器
	std::string vsPath = "E:/MyCode/openGL/openGL/work/ShaderFile/DrawTriangle/vertex.vs";
	std::string fsPath = "E:/MyCode/openGL/openGL/work/ShaderFile/DrawTriangle/fragment.fs";
	MyShader orangeShader(vsPath.data(), fsPath.data());

	//循环函数
	//检查GLFW是否被要求退出
	while (!glfwWindowShouldClose(window))
	{
		//设置清空屏幕颜色
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		//清除缓冲，这边的缓冲还有GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT
		glClear(GL_COLOR_BUFFER_BIT);

		//绘制
		orangeShader.use();
		glBindVertexArray(VAO);
		//第二个参数：从第几个节点开始绘制
		//第三个参数：绘制几个节点
		//glDrawArrays(GL_TRIANGLES, 0, 3);
		//第二个参数：需要画几个点
		//第三个参数：索引类型，这边用int
		//第四个参数：索引的偏移量
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		glBindVertexArray(0);

		//交换颜色缓冲
		glfwSwapBuffers(window);
		//检测有没有触发事件（键盘输入、鼠标移动）
		glfwPollEvents();
	}

	closeWindow();
	return 0;
}
