#version 330 core
out vec4 FragColor;

in vec3 normal;
in vec3 fragPos;

uniform vec3 toyColor;
uniform vec3 lightColor;
uniform float ambientStrength;
uniform vec3 lightPos;
//摄像机位置，就是观察者的位置
uniform vec3 viewPos;
//镜面反射的强度
uniform float specularStrength;
//反光度
uniform int shininessNum;

void main()
{
    //环境光
    vec3 ambientLight = ambientStrength * lightColor;

    //漫反射
    vec3 lightDir = normalize(lightPos - fragPos);
    vec3 norm = normalize(normal);
    //dot 向量x，y之间的点积
    float diff = max(dot(norm, lightDir), 0.0f);
    vec3 diffuseLight = diff * lightColor;

    //镜面反射
    vec3 viewDir = normalize(viewPos - fragPos);
    //reflect (genType I, genType N) 返回反射向量
    //反射向量上的亮度应该是最高的
    vec3 reflectDir = reflect(-lightDir, norm);
    //获取点积值
    //反射度越大，散射越少
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininessNum);
    vec3 specularLight = specularStrength * spec * lightColor;

    vec3 result = (ambientLight + diffuseLight + specularLight) * toyColor;
    FragColor = vec4(result, 1.0f);
} 