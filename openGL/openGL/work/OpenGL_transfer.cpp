#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <fstream>
#include <string>

#include <my/BuildWindow.h>
#include <my/MyShader.h>

#include <img/stb_image.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>


int main()
{
	GLFWwindow* window = createOpenGLWindow();
	//定义纹理类型
	unsigned int texture_1, texture_2;

	std::string imgPath;
	unsigned char *data;
	int width, height, colorChannelNum;

	//申请纹理
	glGenTextures(1, &texture_1);
	glBindTexture(GL_TEXTURE_2D, texture_1);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	imgPath = "./img/container.jpg";
	data = stbi_load(imgPath.data(), &width, &height, &colorChannelNum, 0);
	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
	}
	//生成以后记得释放
	stbi_image_free(data);

	glGenTextures(1, &texture_2);
	glBindTexture(GL_TEXTURE_2D, texture_2);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	imgPath = "./img/awesomeface.png";
	data = stbi_load(imgPath.data(), &width, &height, &colorChannelNum, 0);
	if (data)
	{
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
	}
	//生成以后记得释放
	stbi_image_free(data);


	float vertices_1[] = {
		//     ---- 位置 ----       ---- 颜色 ----     - 纹理坐标 -
		0.2f, 0.2f, 0.0f,   1.0f, 0.0f, 0.0f,   0.0f, 0.0f,   
		0.7f, 0.2f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,   
		0.7f, 0.7f, 0.0f,   0.0f, 0.0f, 1.0f,   1.0f, 1.0f,   
		0.2f, 0.7f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f,   
	};
	unsigned int VAO, VBO;
	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);
	glGenBuffers(1, &VBO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_1), vertices_1, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(6 * sizeof(float)));
	glEnableVertexAttribArray(2);

	float vertices_2[] = {
		-0.2f, -0.2f, 0.0f,   1.0f, 0.0f, 0.0f,   0.0f, 0.0f,
		-0.7f, -0.2f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,
		-0.7f, -0.7f, 0.0f,   0.0f, 0.0f, 1.0f,   1.0f, 1.0f,
		-0.2f,  0.7f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f,
	};

	unsigned int VAO_2, VBO_2;
	glGenVertexArrays(1, &VAO_2);
	glBindVertexArray(VAO_2);
	glGenBuffers(1, &VBO_2);
	glBindBuffer(GL_ARRAY_BUFFER, VBO_2);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_2), vertices_2, GL_STATIC_DRAW);
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
	std::string vsPath = "./work/ShaderFile/Transfer/1/vertex.vs";
	std::string fsPath = "./work/ShaderFile/Transfer/1/fragment.fs";
	MyShader transfereShader(vsPath.data(), fsPath.data());
	transfereShader.use();
	glUniform1i(glGetUniformLocation(transfereShader.ID, "ourTexture1"), 0);
	glUniform1i(glGetUniformLocation(transfereShader.ID, "ourTexture2"), 1);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, texture_1);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, texture_2);

	//变化矩阵
	glm::mat4 trans(1.0f);
	//trans = glm::rotate(trans, glm::radians(90.0f), glm::vec3(0.0f, 0.0f, 1.0f));
	trans = glm::scale(trans, glm::vec3(0.5f, 0.5f, 1.0f));
	trans = glm::translate(trans, glm::vec3(0.5f, 0.0f, 0.0f));
	//第二个参数：传入几个矩阵
	//第三个参数：是否进行矩阵置换，glm生成的矩阵不需要置换
	glUniformMatrix4fv(glGetUniformLocation(transfereShader.ID, "transform"), 1, GL_FALSE, glm::value_ptr(trans));

	//循环函数
	//检查GLFW是否被要求退出
	while (!glfwWindowShouldClose(window))
	{
		//设置清空屏幕颜色
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		//清除缓冲，这边的缓冲还有GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT
		glClear(GL_COLOR_BUFFER_BIT);

		glBindVertexArray(VAO);
		glm::mat4 trans_1(1.0f);
		trans_1 = glm::scale(trans_1, glm::vec3(0.5f, 0.5f, 1.0f));
		trans_1 = glm::translate(trans_1, glm::vec3(0.5f, 0.5f, 0.0f));
		trans_1 = glm::rotate(trans_1, (float)glfwGetTime(), glm::vec3(0.0f, 0.0f, 1.0f));
		glUniformMatrix4fv(glGetUniformLocation(transfereShader.ID, "transform"), 1, GL_FALSE, glm::value_ptr(trans_1));
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		//glDrawArrays(GL_TRIANGLES, 1, 3);

		//glBindVertexArray(VAO_2);
		//glm::mat4 trans_2(1.0f);
		//float sinNum = abs(sin((float)glfwGetTime()));
		//trans_2 = glm::scale(trans_2, glm::vec3(sinNum, sinNum, 1.0f));
		//glUniformMatrix4fv(glGetUniformLocation(transfereShader.ID, "transform"), 1, GL_FALSE, glm::value_ptr(trans_2));
		//glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

		//交换颜色缓冲
		glfwSwapBuffers(window);
		//检测有没有触发事件（键盘输入、鼠标移动）
		glfwPollEvents();
	}

	closeWindow();
	return 0;
}
