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

        void main()
        {
            vec3 color = vec3(0.0);
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(oneWidth, 0.0))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(oneWidth, -1.0 * oneHeight))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(0.0, -1.0 * oneHeight))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(-1.0 * oneWidth, -1.0 * oneHeight))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(-1.0 * oneWidth, 0.0))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(-1.0 * oneWidth, 1.0 * oneHeight))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(0.0, 1.0 * oneHeight))).rgb;
            color = color + (v_fragmentColor * texture2D(CC_Texture0, v_texCoord + vec2(oneWidth, oneHeight))).rgb;
            gl_FragColor = vec4(color / 8.0, 1.0);
        }
    `;
};

module.exports = outModule;