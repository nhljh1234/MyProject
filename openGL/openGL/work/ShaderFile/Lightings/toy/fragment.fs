#version 330 core
out vec4 FragColor;

in vec3 normal;
in vec3 fragPos;
in vec2 texCoords;

uniform vec3 lightColor;
//摄像机位置，就是观察者的位置
uniform vec3 viewPos;

/**
    ambient材质向量定义了在环境光照下这个物体反射得是什么颜色，通常这是和物体颜色相同的颜色。
    diffuse材质向量定义了在漫反射光照下物体的颜色。（和环境光照一样）漫反射颜色也要设置为我们需要的物体颜色。
    specular材质向量设置的是镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）。
    shininess影响镜面高光的散射/半径。
    我们也移除了环境光材质颜色向量，因为环境光颜色在几乎所有情况下都等于漫反射颜色，所以我们不需要将它们分开储存：
**/
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
};
uniform Material material;

//定向光
struct DirLight {
    vec3 direction;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform DirLight dirLight;

struct PointLight {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};
uniform PointLight pointLight;

struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};
uniform SpotLight spotLight;

/**
    衰减系数F：F = 1.0 / (constant + linear * dis + quadratic * dis * dis)
    1.常数项通常保持为1.0，它的主要作用是保证分母永远不会比1小，否则的话在某些距离上它反而会增加强度，这肯定不是我们想要的效果。
    2.一次项会与距离值相乘，以线性的方式减少强度。
    3.二次项会与距离的平方相乘，让光源以二次递减的方式减少强度。二次项在距离比较小的时候影响会比一次项小很多，但当距离值比较大的时候它就会比一次项更大了。
**/

vec3 getDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    
    //漫反射
    float diff = max(dot(normal, lightDir), 0.0f);
    //镜面放射
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
    // 合并结果
    vec3 ambient  = light.ambient * vec3(texture(material.diffuse, TexCoords));
    vec3 diffuse  = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
    return (ambient + diffuse + specular);
}

vec3 getPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    //光照方向
    vec3 lightDir = vec3(light.position - fragPos);
    //衰减系数
    vec3 dis = length(light.position - fragPos);
    dis = abs(dis);
    float attenuation = 1.0 / (light.constant + dis * light.linear + dis * dis * light.quadratic);
    //漫反射
    float diff = max(dot(normal, lightDir), 0.0f);
    //镜面放射
    float reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
    //合并结果
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords)) * attenuation;
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords)) * attenuation;
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords)) * attenuation;
    return (ambient + diffuse + specular);
}

vec3 getSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    //判定内圈和外圈
    //光照方向
    vec3 lightDir = vec3(light.position - fragPos);
    float theta = dot(lightDir, normalize(-light.direction));
    if (theta < light.outerCutOff)
    {
        FragColor = vec4(ambientLight * attenuation, 1.0f);
        return;
    }
    float ratio = 1.0f;
    if (theta < light.cutOff) {
        ratio = (theta - light.outerCutOff) / (light.cutOff - light.outerCutOff);
    }
    //衰减系数
    vec3 dis = length(light.position - fragPos);
    dis = abs(dis);
    float attenuation = 1.0 / (light.constant + dis * light.linear + dis * dis * light.quadratic);
    //漫反射
    float diff = max(dot(normal, lightDir), 0.0f);
    //镜面放射
    float reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
    //合并结果
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords)) * attenuation;
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords)) * attenuation * ratio;
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords)) * attenuation * ratio;
    return (ambient + diffuse + specular);
}

void main()
{
    //环境光
    vec3 ambientLight = lightColor * light.ambient * vec3(texture(material.diffuse, texCoords));

    //点光源衰减系数
    float dis = length(light.position - fragPos);
    dis = abs(dis);
    float attenuation = 1.0 / (light.constant + light.linear * dis + light.quadratic * dis * dis);

    //漫反射
    vec3 lightDir = normalize(light.position - fragPos);

    float theta = dot(lightDir, normalize(-light.direction));
    if (theta < light.outerCutOff)
    {
        FragColor = vec4(ambientLight * attenuation, 1.0f);
        return;
    }
    float ratio = 1.0f;
    if (theta < light.cutOff) {
        ratio = (theta - light.outerCutOff) / (light.cutOff - light.outerCutOff);
    }

    //vec3 lightDir = normalize(-light.direction);
    vec3 norm = normalize(normal);
    //dot 向量x，y之间的点积
    float diff = max(dot(norm, lightDir), 0.0f);
    vec3 diffuseLight = lightColor * light.diffuse * (diff * vec3(texture(material.diffuse, texCoords)));

    //镜面反射
    vec3 viewDir = normalize(viewPos - fragPos);
    //reflect (genType I, genType N) 返回反射向量
    //反射向量上的亮度应该是最高的
    vec3 reflectDir = reflect(-lightDir, norm);
    //获取点积值
    //反射度越大，散射越少
    //dot 获取两个向量的点积
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specularLight = lightColor * light.specular * (spec * vec3(texture(material.specular, texCoords)));

    vec3 result = (ambientLight * attenuation + diffuseLight * attenuation * ratio + specularLight * attenuation * ratio);

    FragColor = vec4(result, 1.0f);
} 