/**
 * 通过绘制一个点来演示WebGL程序的过程
 */
// 获得canvas，并创建一三维渲染上下文
var canvas = document.querySelector('#webgl');
var gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");

/**
 * 创建顶点着色器
 */
// 获取顶点着色器源码
var vertexShaderSource = document.querySelector('#vertexShader').innerHTML
// 创建顶点着色器对象
var vertexShader = gl.createShader(gl.VERTEX_SHADER)
// 将源码分配给顶点着色器对象
gl.shaderSource(vertexShader, vertexShaderSource)
// 编辑顶点着色器程序
gl.compileShader(vertexShader)

/**
 * 创建片元着色器
 */
// 获取片元着色器源码
var fragmentShaderSource = document.querySelector('#fragmentShader').innerHTML
// 创建片元着色器程序
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
// 将源码分配给片元着色器对象
gl.shaderSource(fragmentShader, fragmentShaderSource)
// 编译片元着色器
gl.compileShader(fragmentShader)

/**
 * 创建着色器程序
 */
// 创建着色器程序
var program = gl.createProgram()
// 将顶点着色器挂载在着色器程序上
gl.attachShader(program, vertexShader)
// 将片元着色器挂载在着色器程序上
gl.attachShader(program, fragmentShader)
// 链接着色器程序
gl.linkProgram(program)

// 使用刚创建好的着色器程序
gl.useProgram(program)

/**
 * 准备工作做好，接下来开始绘制
 * 
 */
// 设置清空画布颜色为黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0)
// 用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT)

/**
 * void gl.drawArrays(mode, first, count);
 * 参数：
 * mode，代表图元类型。
 * first，代表从第几个点开始绘制。
 * count，代表绘制的点的数量。
 */
// 绘制点
gl.drawArrays(gl.POINTS, 0, 1)


