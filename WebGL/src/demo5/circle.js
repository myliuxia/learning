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
// 找到顶点着色器中的变量 a_Screen_Size
var a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
// 为顶点着色器中的 a_Screen_Size, 传递canves 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height) 

// 找到顶点着色器中的变量 a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 启用着色器中的属性 a_Position
gl.enableVertexAttribArray(a_Position)

// 获得顶点着色器的变量 a_Color
var a_Color = gl.getAttribLocation(program, 'a_Color')
// 启用着色器中的属性 a_Color
gl.enableVertexAttribArray(a_Color)

// 定义顶点坐标变量


var sin = Math.sin;
var cos = Math.cos;
function createCircleVertex(x, y, radius, n) {
	var positions = [x, y, 125, 255, 0, 1];
	for (let i = 0; i <= n; i++) {
		var angle = i * Math.PI * 2 / n;
		positions.push(x + radius * sin(angle), y + radius * cos(angle), 255, 0, 0, 1);
	}
	return positions;
}
var positions = createCircleVertex(165, 165, 150,  24);

// 创建一个 坐标信息 缓冲区
var positionBuffer = gl.createBuffer()
// 绑定缓存区
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// 设置从缓冲区提取坐标数据
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
// 设置从缓冲区提取颜色数据
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
// 将数据放入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
//用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT);
//因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作
gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);

