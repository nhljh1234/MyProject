var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
            gl_FragColor = vec4(
                0.393 * gl_FragColor.r + 0.769 * gl_FragColor.g + 0.189 * gl_FragColor.b,
                0.394 * gl_FragColor.r + 0.686 * gl_FragColor.g + 0.168 * gl_FragColor.b,
                0.272 * gl_FragColor.r + 0.534 * gl_FragColor.g + 0.131 * gl_FragColor.b,
                1.0
            );
        }
    `;
};

module.exports = outModule;