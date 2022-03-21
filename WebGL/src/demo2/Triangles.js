/**
 * 通过绘制一个点来演示WebGL程序的过程
 */
//获取canvas
let canvas = getCanvas('#webgl');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);

//创建顶点着色器
var vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER,'vertexShader');
//创建片元着色器
var fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER,'fragmentShader');

//创建着色器程序
let program = createSimpleProgram(gl, vertexShader, fragmentShader);

//使用该着色器程序
gl.useProgram(program);

/**
 * 定义缓冲区，并将数据存缓冲区
 */
// 定义三角形的三个顶点
var positions = [1,0, 0,1, 0,0];
// 找到顶点着色器中的变量a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 获得片元着色器的变量 u_Color
var u_Color = gl.getUniformLocation(program, 'u_Color')
// 创建一个缓冲区
var buffer = gl.createBuffer()
// 绑定缓存区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 往当前缓冲区中写入数据
// gl.STATIC_DRAW  提示 WebGL 我们不会频繁改变缓冲区中的数据, WebGL 会根据这个参数做一些优化处理
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

/**
 * 从缓冲区中提取数据
 */
// 启用着色器中的属性 a_Position
gl.enableVertexAttribArray(a_Position)

// 设置从缓冲区提取数据的方式
// 每次提取两个数据
var size = 2
// 每个数据的类型是32位浮点型
var type = gl.FLOAT
// 不需要归一化数据
var normalize = false
// 每次迭代运行需要移动数据数*每个数据所占用内存 到下一个数据开始点
var stride = 0
// 从缓冲起始位置开始读取
var offset = 0
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer
gl.vertexAttribPointer(a_Position, size, type, normalize, stride, offset)

/**
 * 绘制代码
 */
// 为片元着色器中的 u_Color 传递颜色
gl.uniform4f(u_Color, 255, 0, 0, 1)
//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);
// 绘制图元设置为三角形
var primitiveType = gl.TRIANGLES
// 从顶点数组开始位置取顶点数据
var offset = 0
// 因为我们要绘制三个点，所以执行三次顶点绘制操作
var count = 3
gl.drawArrays(primitiveType, offset, count)

