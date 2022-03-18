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



// 找到顶点着色器中的变量a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 找到顶点着色器中的变量a_Screen_Size
var a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
// 找到片元着色器的变量 u_Color
var u_Color = gl.getUniformLocation(program, 'u_Color')

// 为顶点着色器中的 a_Screen_Size, 传递canves 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height)

// 存储点击位置数组
var points = []
canvas.addEventListener('click',e => {
  var x = e.pageX
  var y = e.pageY
  var color = randomColor()
  points.push({x, y, color})
  gl.clearColor(0, 0, 0, 1.0)
  // 用上一步设置的清除画布颜色 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT)
  for(let i = 0; i < points.length; i++){
    var color = points[i].color
    // 为片元着色器中的 u_Color 传递随机颜色
    gl.uniform4f(u_Color, color.r, color.g, color.b, color.a)
    // 为顶点着色器中的 a_Position 传递顶点坐标
    gl.vertexAttrib2f(a_Position, points[i].x, points[i].y)
    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1)
  }
})

//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);