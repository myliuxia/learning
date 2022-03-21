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
// 定义顶点
var positions = [];
// 找到顶点着色器中的变量 a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 启用着色器中的属性 a_Position
gl.enableVertexAttribArray(a_Position)

// 找到顶点着色器中的变量 a_Screen_Size
var a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
// 为顶点着色器中的 a_Screen_Size, 传递canves 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height)

// 获得片元着色器的变量 u_Color
var u_Color = gl.getUniformLocation(program, 'u_Color')
// 为片元着色器中的 u_Color 传递颜色
gl.uniform4f(u_Color, 255, 0, 0, 1)

// 创建一个缓冲区
var buffer = gl.createBuffer()
// 绑定缓存区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

/**
 * 从缓冲区中提取数据
 */

// 设置从缓冲区提取数据的方式
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

// 添加点击事件监听
canvas.addEventListener('mouseup', e => {
  var x = e.pageX
  var y = e.pageY
  positions.push(x, y)
  if(positions.length > 0 ){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
    render(gl)    
  }
})
//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
//用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT);

/**
 * 绘制方法
 */
function render(gl){
    //用上一步设置的清空画布颜色清空画布。
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图元设置为三角形
    var primitiveType = gl.LINE_LOOP; // LINES：基本线段 / LINE_STRIP：带状线段 / LINE_LOOP：环状线段
    //从顶点数组的开始位置取顶点数据
    var drawOffset = 0;
    //因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作
    gl.drawArrays(primitiveType, drawOffset, positions.length / 2);
}