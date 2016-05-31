// MultiAttributeSize_Interleaved.js
// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = a_PointSize;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' + // uniform变量
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
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

    // 设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // 清空<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.POINTS, 0, n); // n is 3
}

function initVertexBuffers(gl) {
    var verticesSize = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    var n = 3; //点的个数

    // 创建缓冲区对象
    var vertexSizeBuffer = gl.createBuffer();

    if (!vertexSizeBuffer) {
        console.log('Failed to create the vertexSizeBuffer object ');
        return -1;
    }

    // 将顶点坐标与尺寸写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW);

    var FSIZE = verticesSize.BYTES_PER_ELEMENT;

    // 获取a_Position的存储位置， 分配缓冲区并开启;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return a_Position;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    // 获取 a_PointSize的存储位置，分配缓冲区并开启
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return a_PointSize;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    return n
}
