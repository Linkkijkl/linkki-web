const canvas = document.getElementById("shader");
const homeCarousel = document.getElementsByClassName("home-carousel")[0];
const shaderPath = canvas.getAttribute("data-shader");

let gl = null;
let shaderProgram;
let resolutionLocation;
let vertexArray = new Float32Array;
let darkModeLocation;


const resizeCanvas = () => {
    canvas.width = homeCarousel.clientWidth;
    canvas.height = homeCarousel.clientHeight;
    if (gl != null) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
}


new ResizeObserver((entires) => {
    for (const entry of entires) {
        resizeCanvas();
    }
}).observe(homeCarousel);


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
};


const getPrimaryAccent = () => {
    const hexToRgb = hex =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
    return hexToRgb(
        getComputedStyle(document.body).getPropertyValue('--primary-accent')
    );
};


window.addEventListener("DOMContentLoaded", async () => {
    gl = canvas.getContext("webgl2");
    if (!gl) return;

    const getShaderSource = url => fetch(url).then(response => response.text());

    shaderProgram = buildShaderProgram([
        {
            type: gl.VERTEX_SHADER,
            code: await getShaderSource(
                document.querySelector('script[type="x-shader/x-vertex"]').src
            )
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: await getShaderSource(
                document.querySelector('script[type="x-shader/x-fragment').src
            )
        }
    ]);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const accentLocation = gl.getUniformLocation(shaderProgram, "u_primary_accent");
    darkModeLocation = gl.getUniformLocation(shaderProgram, "u_dark_mode");

    const vao = gl.createVertexArray();
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

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,          // 2 components per iteration
        gl.FLOAT,   // the data is 32bit floats
        false,      // don't normalize the data
        0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        0,          // start at the beginning of the buffer
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);


    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    const pa = getPrimaryAccent();
    gl.uniform3f(accentLocation, pa[0] / 255.0, pa[1] / 255.0, pa[2] / 255.0);
    gl.uniform1i(darkModeLocation, isThemeDark());

    let timeTracker = 0.0;
    let startTime = document.timeline.currentTime;

    function render() {
        timeTracker = (document.timeline.currentTime - startTime) * 0.001;

        gl.uniform1f(timeLocation, timeTracker);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        window.requestAnimationFrame(render);
    }

    render();
});


document.getRootNode().addEventListener("ThemeChange", () => {
    if (gl) gl.uniform1i(darkModeLocation, isThemeDark());
});
