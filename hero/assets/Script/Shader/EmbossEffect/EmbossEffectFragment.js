var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float oneWidth;
        uniform float oneHeight;
        uniform vec3 embossColor;

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
            vec2 newPos = vec2(v_texCoord.x - oneWidth, v_texCoord.y - oneHeight);
            vec4 FragColor_left = v_fragmentColor * texture2D(CC_Texture0, newPos);
            gl_FragColor = vec4((gl_FragColor.rgb - FragColor_left.rgb + embossColor), 1.0);
        }
    `;
};

module.exports = outModule;