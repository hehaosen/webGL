// ColoredPoints.js
// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +
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

    // 获取a_Position变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // 获取 u_FragColor变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    if (!u_FragColor) {
        console.log('Failed to get u_FragColor variable');
        return;
    }

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position);};

    // 清空<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = []; // 鼠标单击位置数组
    var g_colors = []; // 存储点颜色的数组

    function click (ev, gl, canvas, a_Position) {
        var x = ev.clientX; //鼠标点击处的x坐标
        var y = ev.clientY; // 鼠标点击处的y坐标
        var rect = ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
        y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);

        // 将坐标存储到g_points数组里
        g_points.push([x, y]);

        // 将点的颜色存储到g_colors数组中
        if (x >= 0.0 && y>=0.0) {   // 第一象限
            g_colors.push([1.0, 0.0, 0.0, 1.0]); // 红色
        } else if (x < 0.0 && y < 0.0) {   // 第三象限
            g_colors.push([0.0, 1.0, 0.0, 1.0]); // 绿色
        } else { // 其他
            g_colors.push([1.0, 1.0, 1.0, 1.0]); //白色
        }
        //清除<canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for (var i = 0; i<len ; i++) {
            var xy = g_points[i];
            var rgba = g_colors[i];

            // 将点的位置传递到变量中a_Position
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

            // 将点的颜色传输到u_FragColor变量中
            gl.uniform4f(u_FragColor, rgba[0],rgba[1], rgba[2], rgba[3]);
            //绘制点
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }

}

