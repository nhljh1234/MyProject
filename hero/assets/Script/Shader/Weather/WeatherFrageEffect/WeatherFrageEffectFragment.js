var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform vec3 lightColor;
        uniform float midX;
        uniform float midY;
        uniform float speed;
        uniform int isCenterBuild;

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
            float dis = sqrt((v_texCoord.x - midX) * (v_texCoord.x - midX) + (v_texCoord.y - midY) * (v_texCoord.y - midY));
            //雾气的透明度
            float aNum = dis * 0.707 * speed;
            if (aNum > 1.0) {
                aNum = 1.0;
            }
            vec3 newColor;
            if (isCenterBuild == 1) 
            {
                newColor = gl_FragColor.xyz * aNum + lightColor.xyz * (1.0 - aNum);
            }
            else 
            {
                newColor = gl_FragColor.xyz * (1.0 - aNum) + lightColor.xyz * aNum;
            }
            gl_FragColor = vec4(newColor.xyz, 1.0);
        }
    `;
};

module.exports = outModule;