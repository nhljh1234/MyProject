#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

#include <my/MyShader.h>
#include <my/MyCamera.h>
#include <my/MyModel.h>
#include <my/BuildWindow.h>

#include <iostream>

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void mouse_callback(GLFWwindow* window, double xpos, double ypos);
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset);
void processInput(GLFWwindow *window);

// settings
const unsigned int SCR_WIDTH = 800;
const unsigned int SCR_HEIGHT = 600;

// camera
Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));
float lastX = SCR_WIDTH / 2.0f;
float lastY = SCR_HEIGHT / 2.0f;
bool firstMouse = true;

// timing
float deltaTime = 0.0f;
float lastFrame = 0.0f;

int main()
{
	//创建窗口
	GLFWwindow* window = createOpenGLWindow();
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
	glfwSetCursorPosCallback(window, mouse_callback);
	glfwSetScrollCallback(window, scroll_callback);
	glEnable(GL_DEPTH_TEST);

	//启动光标
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	std::string vsPath = "./work/ShaderFile/AssimpLight/model/vertex.vs";
	std::string fsPath = "./work/ShaderFile/AssimpLight/model/fragment.fs";
	MyShader objShader(vsPath.data(), fsPath.data());

	MyModel ourModel("./resources/nanosuit/nanosuit.obj");

	float vertices[] = {
		// positions          // normals           // texture coords
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,
		0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  0.0f,
		0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,
		0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  0.0f,
		0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,
		0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  1.0f,
		0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f,
		0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  1.0f,
		0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f
	};

	glm::vec3 pointLightPositions[] = {
		glm::vec3(0.7f,  0.2f,  2.0f),
		glm::vec3(2.3f, -3.3f, -4.0f),
		glm::vec3(0.0f,  0.0f, -3.0f)
	};

	//绑定灯的数据
	unsigned int VAO, VBO;
	glGenVertexArrays(1, &VAO);
	glGenBuffers(1, &VBO);

	glBindVertexArray(VAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);

	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(2);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(6 * sizeof(float)));

	//灯的着色器
	vsPath = "./work/ShaderFile/AssimpLight/lamp/vertex.vs";
	fsPath = "./work/ShaderFile/AssimpLight/lamp/fragment.fs";
	MyShader lampShader(vsPath.data(), fsPath.data());

	while (!glfwWindowShouldClose(window))
	{
		float currentFrame = glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		processInput(window);

		glClearColor(0.05f, 0.05f, 0.05f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		objShader.use();

		glUniform3f(glGetUniformLocation(objShader.ID, "lightColor"), 1.0f, 1.0f, 1.0f);
		//反射光相关
		glUniform3f(glGetUniformLocation(objShader.ID, "viewPos"), camera.Position.x, camera.Position.y, camera.Position.z);
		//glUniform3f(glGetUniformLocation(toyShader.ID, "material.specular"), 0.5f, 0.5f, 0.5f);
		glUniform1f(glGetUniformLocation(objShader.ID, "material.shininess"), 32.0f);

		//平行光源
		glUniform3f(glGetUniformLocation(objShader.ID, "dirLight.ambient"), 0.05f, 0.05f, 0.05f);
		glUniform3f(glGetUniformLocation(objShader.ID, "dirLight.diffuse"), 0.4f, 0.4f, 0.4f);
		glUniform3f(glGetUniformLocation(objShader.ID, "dirLight.specular"), 0.5f, 0.5f, 0.5f);
		glUniform3f(glGetUniformLocation(objShader.ID, "dirLight.direction"), -0.2f, -1.0f, -0.3f);

		//点光源衰减系数
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[0].position"), pointLightPositions[0].x, pointLightPositions[0].y, pointLightPositions[0].z);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[0].ambient"), 0.05f, 0.05f, 0.05f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[0].diffuse"), 0.2f, 0.8f, 0.8f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[0].specular"), 1.0f, 1.0f, 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[0].constant"), 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[0].linear"), 0.09);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[0].quadratic"), 0.032);
		// Point light 2
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[1].position"), pointLightPositions[1].x, pointLightPositions[1].y, pointLightPositions[1].z);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[1].ambient"), 0.05f, 0.05f, 0.05f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[1].diffuse"), 0.2f, 0.8f, 0.2f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[1].specular"), 0.0f, 1.0f, 0.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[1].constant"), 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[1].linear"), 0.09);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[1].quadratic"), 0.032);
		// Point light 3
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[2].position"), pointLightPositions[2].x, pointLightPositions[2].y, pointLightPositions[2].z);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[2].ambient"), 0.05f, 0.05f, 0.05f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[2].diffuse"), 0.8f, 0.2f, 0.8f);
		glUniform3f(glGetUniformLocation(objShader.ID, "pointLights[2].specular"), 0.0f, 0.0f, 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[2].constant"), 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[2].linear"), 0.09);
		glUniform1f(glGetUniformLocation(objShader.ID, "pointLights[2].quadratic"), 0.032);

		//聚光光源
		glUniform3f(glGetUniformLocation(objShader.ID, "spotLight.position"), camera.Position.x, camera.Position.y, camera.Position.z);
		glUniform3f(glGetUniformLocation(objShader.ID, "spotLight.direction"), camera.Front.x, camera.Front.y, camera.Front.z);
		glUniform3f(glGetUniformLocation(objShader.ID, "spotLight.ambient"), 0.0f, 0.0f, 0.0f);
		glUniform3f(glGetUniformLocation(objShader.ID, "spotLight.diffuse"), 1.0f, 1.0f, 1.0f);
		glUniform3f(glGetUniformLocation(objShader.ID, "spotLight.specular"), 1.0f, 1.0f, 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "spotLight.constant"), 1.0f);
		glUniform1f(glGetUniformLocation(objShader.ID, "spotLight.linear"), 0.09);
		glUniform1f(glGetUniformLocation(objShader.ID, "spotLight.quadratic"), 0.032);
		glUniform1f(glGetUniformLocation(objShader.ID, "spotLight.cutOff"), glm::cos(glm::radians(12.5f)));
		glUniform1f(glGetUniformLocation(objShader.ID, "spotLight.outerCutOff"), glm::cos(glm::radians(15.0f)));

		// 摄像机视图
		glm::mat4 projection = glm::perspective(glm::radians(camera.Zoom), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
		glm::mat4 view = camera.GetViewMatrix();
		glUniformMatrix4fv(glGetUniformLocation(objShader.ID, "projection"), 1, GL_FALSE, glm::value_ptr(projection));
		glUniformMatrix4fv(glGetUniformLocation(objShader.ID, "view"), 1, GL_FALSE, glm::value_ptr(view));
		//模型视图
		glm::mat4 model;
		model = glm::translate(model, glm::vec3(0.0f, -1.75f, 0.0f));
		model = glm::scale(model, glm::vec3(0.1f, 0.1f, 0.1f));
		glUniformMatrix4fv(glGetUniformLocation(objShader.ID, "model"), 1, GL_FALSE, glm::value_ptr(model));
		ourModel.Draw(objShader);

		glBindVertexArray(VAO);
		lampShader.use();
		//灯的颜色
		glUniform3f(glGetUniformLocation(lampShader.ID, "lightColor"), 1.0f, 1.0f, 1.0f);
		glUniformMatrix4fv(glGetUniformLocation(lampShader.ID, "view"), 1, GL_FALSE, glm::value_ptr(camera.GetViewMatrix()));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.ID, "projection"), 1, GL_FALSE, glm::value_ptr(projection));
		for (unsigned int lampCount = 0; lampCount < 3; lampCount++)
		{
			model = glm::mat4(1.0f);
			model = glm::translate(model, pointLightPositions[lampCount]);
			model = glm::scale(model, glm::vec3(0.2f));
			glUniformMatrix4fv(glGetUniformLocation(lampShader.ID, "model"), 1, GL_FALSE, glm::value_ptr(model));
			glDrawArrays(GL_TRIANGLES, 0, 36);
		}

		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	glDeleteVertexArrays(1, &VAO);
	glDeleteBuffers(1, &VBO);

	// glfw: terminate, clearing all previously allocated GLFW resources.
	// ------------------------------------------------------------------
	glfwTerminate();
	return 0;
}

// process all input: query GLFW whether relevant keys are pressed/released this frame and react accordingly
// ---------------------------------------------------------------------------------------------------------
void processInput(GLFWwindow *window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);

	if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
		camera.ProcessKeyboard(FORWARD, deltaTime / 5);
	if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
		camera.ProcessKeyboard(BACKWARD, deltaTime / 5);
	if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
		camera.ProcessKeyboard(LEFT, deltaTime / 5);
	if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
		camera.ProcessKeyboard(RIGHT, deltaTime / 5);
}

// glfw: whenever the window size changed (by OS or user resize) this callback function executes
// ---------------------------------------------------------------------------------------------
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	// make sure the viewport matches the new window dimensions; note that width and 
	// height will be significantly larger than specified on retina displays.
	glViewport(0, 0, width, height);
}

// glfw: whenever the mouse moves, this callback is called
// -------------------------------------------------------
void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
	if (firstMouse)
	{
		lastX = xpos;
		lastY = ypos;
		firstMouse = false;
	}

	float xoffset = xpos - lastX;
	float yoffset = lastY - ypos; // reversed since y-coordinates go from bottom to top

	lastX = xpos;
	lastY = ypos;

	camera.ProcessMouseMovement(xoffset, yoffset);
}

// glfw: whenever the mouse scroll wheel scrolls, this callback is called
// ----------------------------------------------------------------------
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
	camera.ProcessMouseScroll(yoffset);
}