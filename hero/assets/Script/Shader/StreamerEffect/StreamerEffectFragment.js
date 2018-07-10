var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float lightWidth;
        uniform float startX;
        uniform float tanNum;
        uniform vec3 lightColor;

        bool judgePos(vec2 pos)
        {
            return (pos.x >= startX - (pos.y / tanNum)) && (pos.x <= (startX - pos.y / tanNum) + lightWidth);
        }

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
            if (judgePos(v_texCoord) && gl_FragColor.a >= 0.5) 
            {
                vec3 color = vec3(gl_FragColor.xyz) * 0.5 + vec3(lightColor.xyz) * 0.5;
                gl_FragColor = vec4(color, 1.0);
            }
        }
    `;
};

module.exports = outModule;