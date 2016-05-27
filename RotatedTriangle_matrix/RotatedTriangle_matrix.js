// RotatedTriangle_Matrix.js
// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_xformMatrix;\n' +
    'void main() {\n' +
    '   gl_Position = u_xformMatrix * a_Position;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' + // uniform变量
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';

// 旋转角度
var ANGLE = 90.0;

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

    // 创建旋转矩阵
    var radian = Math.PI * ANGLE / 180.0 ; // 转为弧度制
    var cosB = Math.cos(radian), sinB = Math.sin(radian);

    // 注意WebGL中矩阵式列主序的
    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    //将旋转矩阵传输给顶点着色器
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');


    if (!u_xformMatrix) {
        console.log('Failed to get u_xformMatrix variable');
        return;
    }

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    // 清空<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n); // n is 3
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3; //点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object ');
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return a_Position;
    }

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Poisition变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n
}
