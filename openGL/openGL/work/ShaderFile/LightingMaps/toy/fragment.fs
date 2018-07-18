#version 330 core
out vec4 FragColor;

in vec3 normal;
in vec3 fragPos;

uniform vec3 toyColor;
uniform vec3 lightColor;
//摄像机位置，就是观察者的位置
uniform vec3 viewPos;

/**
    ambient材质向量定义了在环境光照下这个物体反射得是什么颜色，通常这是和物体颜色相同的颜色。
    diffuse材质向量定义了在漫反射光照下物体的颜色。（和环境光照一样）漫反射颜色也要设置为我们需要的物体颜色。
    specular材质向量设置的是镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）。
    shininess影响镜面高光的散射/半径。
**/
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float ambientStrength;
    float diffuseStrength;
    float specularStrength;
    float shininess;
};
uniform Material material;

struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform Light light;

void main()
{
    //环境光
    vec3 ambientLight = lightColor * light.ambient * material.ambient * material.ambientStrength;

    //漫反射
    vec3 lightDir = normalize(light.position - fragPos);
    vec3 norm = normalize(normal);
    //dot 向量x，y之间的点积
    float diff = max(dot(norm, lightDir), 0.0f);
    vec3 diffuseLight = lightColor * light.diffuse * (diff * material.diffuse) * material.diffuseStrength;

    //镜面反射
    vec3 viewDir = normalize(viewPos - fragPos);
    //reflect (genType I, genType N) 返回反射向量
    //反射向量上的亮度应该是最高的
    vec3 reflectDir = reflect(-lightDir, norm);
    //获取点积值
    //反射度越大，散射越少
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specularLight = lightColor * light.specular * (spec * material.specular) * material.specularStrength;

    vec3 result = (ambientLight + diffuseLight + specularLight) * toyColor;
    FragColor = vec4(result, 1.0f);
} 