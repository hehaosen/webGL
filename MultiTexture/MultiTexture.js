// MultiTexture.js
// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
    '   vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
    '   gl_FragColor = color0 * color1;\n' +
    '}\n';

function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');

    // 获取webGL上下文
    var gl =getWebGLContext(canvas);

    if(!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }

    // 配置纹理
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // 清空<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }
}

function initVertexBuffers(gl) {
    var  verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    var n = 4; //点的个数

    // 创建缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the vertexTexCooredBuffer object ');
        return -1;
    }

    // 将顶点坐标和纹理坐标写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    // 获取a_Position的存储位置,分配缓冲区并开启
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

    // 连接a_Poisition变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 将纹理坐标分配给A_TexCoord并开启它

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);// 开启缓冲区分配

    return n
}

function  initTextures(gl, n) {

    //创建缓冲区对象
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();

    if (!texture0 || !texture1) {
        console.log('Failed to create the texture object');
        return false;
    }

    // 获取u_Sampler的存储位置
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    if (!u_Sampler0 || !u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    // 创建一个image对象
    var image0 = new Image();
    var image1 = new Image();

    if (!image0 || !image1) {
        console.log('Failed to create the image object');
        return false;
    }

    // 注册图像加载时间的响应函数,在图像加载完成后调用
    image0.onload = function () { loadTexture(gl, n, texture0, u_Sampler0, image0, 0);};
    image1.onload = function () { loadTexture(gl, n, texture1, u_Sampler1, image1, 1);};

    // 浏览器开始加载图像
    image0.src = 'sky.jpg';
    image1.src = 'circle.gif';
    return true
}

//标记纹理单元是否已经就绪
var g_texUnit0 = false, g_texUnit1 = false;

function loadTexture(gl, n , texture, u_Sampler, image, texUnit) {

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转

    // 激活纹理
    if (texUnit == 0 ) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }

    // 向 target 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // 将纹理传递给着色器
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //绘制矩形
    }
}