var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;

        uniform vec3 lightPos_1;
        uniform vec3 lightColor_1;
        uniform float lightWidth_1;
        uniform float lightDiffNum_1;

        uniform vec3 lightPos_2;
        uniform vec3 lightColor_2;
        uniform float lightWidth_2;
        uniform float lightDiffNum_2;

        uniform vec3 lightPos_3;
        uniform vec3 lightColor_3;
        uniform float lightWidth_3;
        uniform float lightDiffNum_3;

        uniform int lightNum;

        uniform float minNum;

        uniform vec2 ResolutionSize;
        uniform vec2 ResolutionPos;

        uniform int useShadowJudge;

        uniform sampler2D texture;

        int judgeIsShadow(float x, float y)
        {
            if(texture2D(CC_Texture0, vec2(x, y)).a > 0.1)
            {
                return 1;
            }
            return 0;
        }

        int judgeHaveShadow(float x, float y, float lightPosX, float lightPosY)
        {
            float texCoordX, texCoordY, texCoordLightPosX, texCoordLightPosY;
            x = (v_texCoord.x - 0.5) * ResolutionSize.x;

            texCoordX = x / ResolutionSize.x + 0.5;
            texCoordY = 0.5 - y / ResolutionSize.y;
            
            texCoordLightPosX = lightPosX / ResolutionSize.x + 0.5;
            texCoordLightPosY = 0.5 - lightPosY / ResolutionSize.y;
            
            //开始for循环
            float addX, addY, xDis, yDis, addCount;

            float addNumX = 0.005;
            float addNumY = 0.005;

            xDis = abs(texCoordLightPosX - texCoordX);
            yDis = abs(texCoordLightPosY - texCoordY);

            if (xDis < yDis)
            {
                addNumX = xDis / yDis * addNumY;
            }
            else
            {
                addNumY = yDis / xDis * addNumX;
            }

            addCount = xDis / addNumX;

            if (texCoordX < texCoordLightPosX)
            {
                addX = 1.0 * addNumX;
            }
            else
            {
                addX = -1.0 * addNumX;
            }

            if (texCoordY < texCoordLightPosY)
            {
                addY = 1.0 * addNumY;
            }
            else
            {
                addY = -1.0 * addNumY;
            }

            int haveGet = 0;
            int selfIsShadow = judgeIsShadow(texCoordX, texCoordY);
            int maxShadowNum = 2;
            int meetShadowCount = 0;
            float addAmount = 0.0;

            for (int i = 0; i < 101; i++)
            {
                float newX, newY;
                int isShadow;
                addAmount = addAmount + 1.0;
                newX = addX * addAmount + texCoordX;
                newY = addY * addAmount + texCoordY;
                isShadow = judgeIsShadow(newX, newY);
                if(isShadow == 1)
                {
                    meetShadowCount = meetShadowCount + 1;
                }
                if (selfIsShadow == 1 && meetShadowCount > 2)  
                {
                    return 0;
                }
                if (selfIsShadow == 0 && isShadow == 1)
                {
                    return 0;
                }
                if (addAmount > addCount)
                {
                    return 1;
                }
            }

            return 1;
        }

        vec4 getResultColor(int count)
        {
            if (texture2D(CC_Texture0, v_texCoord).a < 0.1)
            {
                return vec4(0.0);
            }
            vec3 lightPos;
            vec3 lightColor;
            float lightWidth;
            float lightDiffNum;
            if (count == 1)
            {
                lightPos = lightPos_1;
                lightColor = lightColor_1;
                lightWidth = lightWidth_1;
                lightDiffNum = lightDiffNum_1;
            }
            else if (count == 2)
            {
                lightPos = lightPos_2;
                lightColor = lightColor_2;
                lightWidth = lightWidth_2;
                lightDiffNum = lightDiffNum_2;
            }
            else if (count == 3)
            {
                lightPos = lightPos_3;
                lightColor = lightColor_3;
                lightWidth = lightWidth_3;
                lightDiffNum = lightDiffNum_3;
            }

            float x, y;
            x = (v_texCoord.x - 0.5) * ResolutionSize.x;
            y = (0.5 - v_texCoord.y) * ResolutionSize.y;

            vec3 diffuseLight;
            float dis = length(lightPos - vec3(x, y, 0.0));
            dis = abs(dis);

            if (lightWidth < dis) 
            {
                return vec4(0.0, 0.0, 0.0, 1.0 - minNum);
            }

            if (useShadowJudge == 1)
            {
                if (judgeHaveShadow(x, y, lightPos.x, lightPos.y) == 0)
                {
                    return vec4(0.0, 0.0, 0.0, 1.0 - minNum);
                }
            }

            vec3 lightDir = normalize(vec3(lightPos - vec3(x, y, 0.0)));
            //float F = 1.0;
            float F = 1.0 / (1.0 + dis * 0.0009 + dis  * dis * 0.0005);
            //2.得到法线贴图的法线数据
            vec3 NormalMap = texture2D(CC_Texture0, v_texCoord).rgb;
            //将法线贴图里的rgb数据转换成真正的法线数据，并归一化
            vec3 normal = normalize(NormalMap * 2.0 - 1.0);
            float diff = max(dot(normal, lightDir), 0.0) * lightDiffNum;
            diffuseLight = diff * lightColor * F * vec3(texture2D(texture, v_texCoord).rgb);
            if (diff == 0.0 && texture2D(CC_Texture0, v_texCoord).a > 0.1) 
            {
                return vec4(0.0, 0.0, 0.0, 1.0 - minNum);
            } 
            return vec4(diffuseLight, 1.0);
        }

        void main()
        {
            if (lightNum == 1)
            {   
                gl_FragColor = getResultColor(1);
                return;
            }
            else if (lightNum == 2)
            {
                gl_FragColor = getResultColor(1) + getResultColor(2);
                return;
            }
            else if (lightNum == 3)
            {
                gl_FragColor = getResultColor(1) + getResultColor(2) + getResultColor(3);
                return;
            }
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - minNum);
        }
    `;
};

module.exports = outModule;