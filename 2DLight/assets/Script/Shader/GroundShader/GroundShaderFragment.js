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

        uniform vec3 lightPos_2;
        uniform vec3 lightColor_2;
        uniform float lightWidth_2;

        uniform vec3 lightPos_3;
        uniform vec3 lightColor_3;
        uniform float lightWidth_3;

        uniform int lightNum;
        uniform int type;

        uniform float minNum;
        uniform float minColorNum;

        uniform vec2 ResolutionSize;

        vec4 getResultColor(int count)
        {
            vec3 lightPos;
            vec3 lightColor;
            float lightWidth;
            if (count == 1)
            {
                lightPos = lightPos_1;
                lightColor = lightColor_1;
                lightWidth = lightWidth_1;
            }
            else if (count == 2)
            {
                lightPos = lightPos_2;
                lightColor = lightColor_2;
                lightWidth = lightWidth_2;
            }
            else if (count == 3)
            {
                lightPos = lightPos_3;
                lightColor = lightColor_3;
                lightWidth = lightWidth_3;
            }

            float x, y;
            x = (v_texCoord.x - 0.5) * ResolutionSize.x;
            y = (0.5 - v_texCoord.y) * ResolutionSize.y;

            vec3 diffuseLight;
            float dis = length(lightPos - vec3(x, y, 0.0));
            dis = abs(dis);

            float minNumResult = minNum;
            //过渡距离
            float disNum = 100.0;
            if (lightWidth < dis + disNum) 
            {
                //return vec4(0.0, 0.0, 0.0, 1.0 - minNum);
                minNumResult = (1.0 - (dis + disNum - lightWidth) / disNum) * minNum;
            }

            float radio = 1.0 - (dis / lightWidth);
            return vec4(lightColor * radio * 0.2 * minColorNum * (minNumResult + (1.0 - minNum)), 1.0 - minNumResult);
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