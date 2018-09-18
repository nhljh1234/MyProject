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


            vec4 color = texture2D(CC_Texture0, v_texCoord);

            if (lightWidth < dis) 
            {
                if (color.a < 0.1)
                {
                    return color;
                }
                else
                {
                    return vec4(color.rgb, minNum);
                }
            }

            if (color.a < 0.1)
            {
                return color;
            }
            return vec4(color.rgb, 1.0);
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
            vec4 color = texture2D(CC_Texture0, v_texCoord);
            if (color.a < 0.1)
            {
                gl_FragColor = color;
            }
            else
            {
                gl_FragColor = vec4(color.rgb, minNum);
            }
        }
    `;
};

module.exports = outModule;