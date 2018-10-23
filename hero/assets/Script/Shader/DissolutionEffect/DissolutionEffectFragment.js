var outModule = {};

outModule.getCodeStr = () => {
    return `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        varying vec4 v_fragmentColor;
        varying vec2 v_texCoord;
        
        uniform float num;

        void main()
        {
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
            if (gl_FragColor.r < num) 
            {
                gl_FragColor = vec4(0.0);
            }
        }
    `;
};

module.exports = outModule;