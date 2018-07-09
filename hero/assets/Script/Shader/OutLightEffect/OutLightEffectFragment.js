var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float lightWidth;
        uniform vec3 lightColor;
        uniform int isOutLight;

        float judgePos(vec2 pos)
        {
            float addAngle = 10.0;
            float addWidth = lightWidth / 20.0;
            float angle = 0.0;
            float width = addWidth;
            float minNum = lightWidth * 2.0;
            float opacity = 0.0;
            for (int i = 0; i < 36; i++) 
            {   
                width = addWidth;
                for (int j = 0; j < 20; j++)
                {
                    vec2 newPos = pos + vec2(width * cos(angle * 0.01745329252), width * sin(angle * 0.01745329252));
                    opacity = opacity + texture2D(CC_Texture0, newPos).a;
                    width = width + addWidth;
                }
                angle = angle + addAngle;
            }
            return opacity / float(20 * 36);
        }

        void main()
        {
            if (isOutLight == 1) 
            {
                gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
                if (gl_FragColor.a >= 0.5) 
                {
                    return;
                }
                float opacity = judgePos(v_texCoord);
                gl_FragColor = vec4(lightColor.xyz, opacity);
            }
            else
            {
                gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
                if (gl_FragColor.a < 0.5) 
                {
                    return;
                }
                float opacity = judgePos(v_texCoord);
                if (opacity >= 1.0)
                {
                    return;
                }
                gl_FragColor = vec4(lightColor.xyz, 1.0  - opacity);
            }
        }
    `;
};

module.exports = outModule;