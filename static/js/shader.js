const canvas = document.getElementById("shader");
const homeCarousel = document.getElementsByClassName("home-carousel")[0];
const shaderPath = canvas.getAttribute("data-shader");

const resizeCanvas = () => {
    console.log("Resizing");
    canvas.width = homeCarousel.clientWidth;
    canvas.height = homeCarousel.clientHeight;
}

new ResizeObserver((entires) => {
    for (const entry of entires) {
        resizeCanvas();
    }
}).observe(homeCarousel);


let gl = null;
let vertexArray = new Float32Array


const compileShader = (code, type) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`,
        );
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}



const buildShaderProgram = (shaderInfo) => {
    const program = gl.createProgram();

    shaderInfo.forEach((desc) => {
        const shader = compileShader(desc.code, desc.type);

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }

    return program;
}


window.onload = () => {
    console.log("Hello World");
    gl = canvas.getContext("webgl2");
    if (!gl) return;

    const shaderProgram = buildShaderProgram([
        {
            type: gl.VERTEX_SHADER,
            code: `#version 300 es
            in vec4 a_position;

            void main() {
                gl_Position = a_position;
            }`
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: `#version 300 es
            precision highp float;
                    
            out vec4 outColor;
                    
            void main() {
                outColor = vec4(1, 0, 0.1, 1);
            }`
        }
    ]);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");

    console.log(shaderProgram);

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // fill it with a 2 triangles that cover clip space
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  // first triangle
        1, -1,
        -1, 1,
        -1, 1,  // second triangle
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,          // 2 components per iteration
        gl.FLOAT,   // the data is 32bit floats
        false,      // don't normalize the data
        0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        0,          // start at the beginning of the buffer
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Drawing
    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);
    gl.drawArrays(
        gl.TRIANGLES, 0, 6
    )
}